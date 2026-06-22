import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { Check, Clock, ChevronRight, ShoppingBag, Home, Phone } from 'lucide-react';

export default function OrderTracker() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synthesize chimes using Web Audio API
  const playAudioChime = (status) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (status === 'Preparing') {
        // Double rising tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.setValueAtTime(320, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.15);
        gain1.gain.setValueAtTime(0.08, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.2);

        setTimeout(() => {
          const ctx2 = new AudioCtx();
          const osc2 = ctx2.createOscillator();
          const gain2 = ctx2.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx2.destination);
          osc2.frequency.setValueAtTime(480, ctx2.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(640, ctx2.currentTime + 0.15);
          gain2.gain.setValueAtTime(0.08, ctx2.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.2);
          osc2.start();
          osc2.stop(ctx2.currentTime + 0.2);
        }, 150);
      } else if (status === 'Ready') {
        // High sparkling triplet chime (arpeggio)
        const playNote = (freq, delay, duration) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.start();
            osc.stop(ctx.currentTime + duration);
          }, delay);
        };
        playNote(523.25, 0, 0.35); // C5
        playNote(659.25, 100, 0.35); // E5
        playNote(783.99, 200, 0.45); // G5
      } else if (status === 'Served') {
        // Descending relaxing chord
        const playNote = (freq, delay, duration) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.start();
            osc.stop(ctx.currentTime + duration);
          }, delay);
        };
        playNote(783.99, 0, 0.4); // G5
        playNote(659.25, 120, 0.4); // E5
        playNote(523.25, 240, 0.5); // C5
      }
    } catch (e) {
      console.warn("Audio Context failed to play chime (browser security blocked it):", e);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('order_id', orderId);
        
        if (error) throw error;
        if (data && data.length > 0) {
          setOrder(data[0]);
        }
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Subscribe to updates for this specific order
    const channel = supabase
      .channel(`order-tracker-${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.new.order_id === orderId) {
          setOrder(payload.new);
          // Trigger correct chime sound
          playAudioChime(payload.new.status);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [orderId]);

  const steps = [
    { label: 'Placed', status: 'Pending', description: 'Order logged, awaiting chef review' },
    { label: 'Preparing', status: 'Preparing', description: 'Chef is crafting your plates' },
    { label: 'Ready', status: 'Ready', description: 'Your plate is prepared & plated' },
    { label: 'Served', status: 'Served', description: 'Served/Handed over' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Preparing': return 1;
      case 'Ready': return 2;
      case 'Served': return 3;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="pt-20 bg-charcoal-900 font-sans min-h-screen flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-charcoal-400">Loading Order Tracker...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-20 bg-charcoal-900 font-sans min-h-screen flex items-center justify-center text-white px-6">
        <div className="text-center space-y-6 max-w-sm glass-card p-8 rounded-xl">
          <ShoppingBag className="w-12 h-12 text-red-400 stroke-[1.2] mx-auto" />
          <h2 className="font-display text-xl">Order Not Found</h2>
          <p className="text-xs text-charcoal-400 font-light leading-relaxed">
            We could not locate order <strong>{orderId}</strong>. Verify the reference key or return to storefront.
          </p>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gold-500 hover:bg-gold-600 text-charcoal-900 uppercase tracking-widest font-bold text-xs rounded transition-all duration-300 shadow-lg"
          >
            <Home className="w-4 h-4" /> Storefront Home
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="pt-20 bg-charcoal-900 font-sans min-h-screen text-white px-6">
      <div className="max-w-4xl mx-auto py-16 space-y-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 border-b border-gold-500/10 pb-8">
          <div>
            <span className="text-gold-500 uppercase tracking-widest text-[10px] font-semibold block mb-1">Live Order Status</span>
            <h1 className="font-display text-2xl font-bold tracking-wide">ID: {order.order_id}</h1>
          </div>
          <div className="flex gap-4">
            <div className="bg-charcoal-950/60 p-3 rounded-lg border border-gold-500/10">
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block mb-0.5">Pickup Code</span>
              <span className="text-base font-bold text-gold-500">{order.pickup_code}</span>
            </div>
            {order.order_type === 'Dine-In' && (
              <div className="bg-charcoal-950/60 p-3 rounded-lg border border-gold-500/10">
                <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block mb-0.5">Table</span>
                <span className="text-base font-bold text-white">#{order.table_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Stepper Timeline */}
        <div className="glass-card p-8 rounded-xl space-y-12">
          {/* Timeline Visual - Horizontal on desktop, Vertical on mobile */}
          <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-8">
            {/* Background progress bar */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-charcoal-800 -translate-y-1/2 hidden md:block z-0" />
            <div
              className="absolute top-1/2 left-0 h-[2px] bg-gold-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-700 ease-out"
              style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;
              const isUpcoming = idx > currentStepIdx;

              return (
                <div key={step.status} className="flex md:flex-col items-center gap-4 md:text-center relative z-10 flex-1">
                  {/* Step bubble */}
                  <motion.div
                    animate={isActive ? { scale: [1, 1.15, 1], boxShadow: '0 0 20px rgba(197, 168, 128, 0.4)' } : {}}
                    transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isCompleted
                        ? 'bg-gold-500 border-gold-500 text-charcoal-900'
                        : isActive
                        ? 'bg-charcoal-900 border-gold-500 text-gold-500'
                        : 'bg-charcoal-900 border-charcoal-800 text-charcoal-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <span>{idx + 1}</span>}
                  </motion.div>

                  {/* Step label / details */}
                  <div className="space-y-0.5 text-left md:text-center">
                    <h3 className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 ${isActive ? 'text-gold-500' : 'text-white'}`}>
                      {step.label}
                    </h3>
                    <p className="text-[10px] text-charcoal-500 font-light leading-relaxed hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper info box for active state */}
          <div className="p-4 bg-charcoal-950/40 rounded-lg border border-gold-500/5 text-center flex items-center justify-center gap-3">
            <Clock className="w-4 h-4 text-gold-500 animate-pulse" />
            <span className="text-xs text-charcoal-400 font-light">
              Current state: <strong className="text-white uppercase tracking-wider">{order.status}</strong> — {steps[currentStepIdx].description}
            </span>
          </div>
        </div>

        {/* Invoice breakdown card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="glass-card p-6 rounded-xl space-y-4">
            <h2 className="font-display text-lg text-white font-medium">Order items</h2>
            <div className="divide-y divide-charcoal-800/60 max-h-64 overflow-y-auto pr-2">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between text-xs font-light">
                  <div>
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-charcoal-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="text-gold-500">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Metadata */}
          <div className="glass-card p-6 rounded-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="font-display text-lg text-white font-medium">Delivery details</h2>
              <div className="text-xs font-light text-charcoal-400 space-y-2">
                <div className="flex justify-between">
                  <span>Guest Name</span>
                  <span className="text-white font-medium">{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone Number</span>
                  <span className="text-white font-medium">{order.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email Address</span>
                  <span className="text-white font-medium">{order.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Type</span>
                  <span className="text-white font-medium">{order.order_type}</span>
                </div>
                {order.order_type === 'Pickup' && (
                  <div className="flex justify-between">
                    <span>Schedule</span>
                    <span className="text-white font-medium">Pickup at {order.time_slot}</span>
                  </div>
                )}
                {order.order_type === 'Delivery' && (
                  <div className="flex flex-col text-left space-y-1">
                    <span>Address</span>
                    <span className="text-white font-medium pl-2 border-l border-gold-500/15">{order.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Link Back to Storefront */}
            <div className="flex gap-4 pt-4 border-t border-charcoal-800">
              <Link
                to="/menu"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-900 border border-gold-500/10 hover:border-gold-500 text-gold-500 font-sans text-xs uppercase tracking-widest font-semibold rounded transition-all duration-300"
              >
                Order More
              </Link>
              <Link
                to="/"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-sans text-xs uppercase tracking-widest font-bold rounded transition-all duration-300 shadow-md shadow-gold-500/5"
              >
                Home <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
