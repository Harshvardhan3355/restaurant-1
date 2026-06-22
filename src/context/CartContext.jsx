import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('aether_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('aether_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch all orders on mount and subscribe to real-time updates
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*');
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching historical orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();

    // Subscribe to live postgres changes
    const channel = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders((prev) => {
            if (prev.some((o) => o.order_id === payload.new.order_id)) return prev;
            return [payload.new, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          setOrders((prev) =>
            prev.map((order) => (order.order_id === payload.new.order_id ? payload.new : order))
          );
        } else if (payload.eventType === 'DELETE') {
          setOrders((prev) => prev.filter((order) => order.order_id !== payload.old.order_id));
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gst = Math.round(subtotal * 0.18); // 18% GST
    const packagingFee = subtotal > 0 ? 30 : 0; // 30 Rs packaging fee if order has items
    const grandTotal = subtotal + gst + packagingFee;
    return { subtotal, gst, packagingFee, grandTotal };
  };

  const placeOrder = async (customerDetails) => {
    const { subtotal, gst, packagingFee, grandTotal } = getCartTotals();
    const orderId = `AE-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const pickupCode = `AE-${Math.floor(10 + Math.random() * 90)}`;

    const newOrder = {
      order_id: orderId,
      pickup_code: pickupCode,
      customer_name: customerDetails.name,
      customer_phone: customerDetails.phone,
      customer_email: customerDetails.email,
      order_type: customerDetails.orderType, // 'Dine-In' | 'Pickup' | 'Delivery'
      table_number: customerDetails.tableNumber || null,
      time_slot: customerDetails.timeSlot || null,
      items: cart,
      subtotal,
      gst,
      packaging_fee: packagingFee,
      grand_total: grandTotal,
      payment_method: customerDetails.paymentMethod,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from('orders').insert([newOrder]);
      if (error) throw error;
      
      // Optimistically update orders state to guarantee instant visibility in KDS
      setOrders((prev) => {
        if (prev.some((o) => o.order_id === newOrder.order_id)) return prev;
        return [newOrder, ...prev];
      });

      clearCart();
      return newOrder;
    } catch (err) {
      console.error("Error inserting order into database:", err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('order_id', orderId);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error updating status for order ${orderId}:`, err);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        loadingOrders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotals,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
