import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, PhoneCall, CheckSquare, Play, Sparkles, LogOut, CheckCircle, BarChart3, TrendingUp, ShoppingBag, Send } from 'lucide-react';

export default function ChefDashboard() {
  const { orders, updateOrderStatus } = useCart();
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('chef_unlocked') === 'true';
    }
    return false;
  });
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Mobile Active Lane Switcher
  const [mobileActiveTab, setMobileActiveTab] = useState('Pending');

  // Order card time aging ticker hook (triggers state change every 30s)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio Synthesizers
  const playBuzzer = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn(e);
    }
  };

  const playSuccessChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn(e);
    }
  };

  // Keyboard support for PIN entry
  useEffect(() => {
    if (unlocked) return;
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 4) {
          setPin((prev) => prev + e.key);
          setPinError(false);
        }
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
        setPinError(false);
      } else if (e.key === 'Enter') {
        submitPin(pin);
      } else if (e.key === 'Escape') {
        setPin('');
        setPinError(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, unlocked]);

  const handleNumpadClick = (num) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setPinError(false);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleClear = () => {
    setPin('');
    setPinError(false);
  };

  const submitPin = (currentPin) => {
    if (currentPin === '8850') {
      playSuccessChime();
      setUnlocked(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('chef_unlocked', 'true');
      }
      setPin('');
    } else {
      playBuzzer();
      setPinError(true);
      setPin('');
    }
  };

  // Check pin length to auto-submit
  useEffect(() => {
    if (pin.length === 4) {
      submitPin(pin);
    }
  }, [pin]);

  // Order filtration
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');
  const readyOrders = orders.filter((o) => o.status === 'Ready');
  const servedOrders = orders.filter((o) => o.status === 'Served');

  // Metrics Calculations
  const totalSales = servedOrders.reduce((sum, o) => sum + o.grand_total, 0);
  const activeQueuedCount = pendingOrders.length + preparingOrders.length + readyOrders.length;

  const getBestSeller = () => {
    const counts = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    let max = 0;
    let name = 'N/A';
    Object.entries(counts).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        name = k;
      }
    });
    return name;
  };

  const calculateMinutesAgo = (dateStr) => {
    const minutes = Math.floor((new Date() - new Date(dateStr)) / 60000);
    return minutes >= 0 ? minutes : 0;
  };

  const getCardBorderColor = (createdAt) => {
    const minutes = calculateMinutesAgo(createdAt);
    if (minutes >= 15) return 'border-red-500 pulse-red-glow'; // Flashing Red
    if (minutes >= 10) return 'border-amber-500 shadow-amber-500/10'; // Amber
    return 'border-gold-500/10 hover:border-gold-500/20'; // Default Glass
  };

  const getWhatsAppLink = (order) => {
    let cleanPhone = order.customer_phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }
    const message = `Hi ${order.customer_name}, your order ${order.order_id} is ready for pick up at AETHER Gastronomy. Please show your Pickup Code: ${order.pickup_code} at the counter.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  if (!unlocked) {
    return (
      <div className="pt-20 bg-charcoal-900 font-sans min-h-screen flex items-center justify-center text-white px-6">
        <div className="w-full max-w-sm glass-card p-8 rounded-xl flex flex-col items-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-gold-500/15 flex items-center justify-center text-gold-500">
              <Lock className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h2 className="font-display text-xl font-medium tracking-wide">KDS Secure Gate</h2>
            <p className="text-xs text-charcoal-400 font-light">Enter chef PIN code to open kitchen display dashboard.</p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border border-gold-500/30 transition-all duration-300 ${
                  pinError ? 'bg-red-500 border-red-500' : i < pin.length ? 'bg-gold-500 border-gold-500' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* 3x4 Numpad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handleNumpadClick(n)}
                className="w-16 h-16 rounded-full border border-gold-500/10 hover:border-gold-500 bg-charcoal-950/40 hover:bg-gold-500/10 text-white font-sans text-lg font-semibold flex items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer"
              >
                {n}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="w-16 h-16 rounded-full border border-charcoal-800 text-charcoal-500 hover:text-red-400 text-xs uppercase tracking-widest font-semibold flex items-center justify-center transition-all focus:outline-none cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => handleNumpadClick(0)}
              className="w-16 h-16 rounded-full border border-gold-500/10 hover:border-gold-500 bg-charcoal-950/40 hover:bg-gold-500/10 text-white font-sans text-lg font-semibold flex items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="w-16 h-16 rounded-full border border-charcoal-800 text-charcoal-500 hover:text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center transition-all focus:outline-none cursor-pointer"
            >
              Back
            </button>
          </div>
          
          {pinError && (
            <p className="text-xs text-red-400 font-light animate-bounce">
              Access Denied. Passcode incorrect.
            </p>
          )}
        </div>
      </div>
    );
  }

  const renderOrderCard = (order) => {
    const minsAgo = calculateMinutesAgo(order.created_at);
    return (
      <div
        key={order.order_id}
        className={`glass-card p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-300 ${getCardBorderColor(
          order.created_at
        )}`}
      >
        {/* Card Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[10px] text-charcoal-500 uppercase tracking-widest font-semibold block">Order Ref</span>
            <span className="text-xs font-semibold text-white">{order.order_id}</span>
          </div>
          <div className="text-right">
            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${
              minsAgo >= 15 ? 'bg-red-950 text-red-400 border border-red-500/20' : minsAgo >= 10 ? 'bg-amber-950 text-amber-400 border border-amber-500/20' : 'bg-charcoal-950 text-charcoal-400'
            }`}>
              {minsAgo}m ago
            </span>
          </div>
        </div>

        {/* Guest Details */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-charcoal-300">
            <span className="font-medium text-white">{order.customer_name}</span>
            <span className="text-gold-500 font-bold">{order.pickup_code}</span>
          </div>
          <div className="text-[10px] text-charcoal-400 font-light flex gap-2">
            <span>Type: {order.order_type}</span>
            {order.order_type === 'Dine-In' && <span>(Table #{order.table_number})</span>}
            {order.order_type === 'Pickup' && <span>(At {order.time_slot})</span>}
          </div>
        </div>

        {/* Ordered items list */}
        <div className="bg-charcoal-950/40 p-3 rounded-lg border border-gold-500/5 text-xs space-y-1.5 max-h-36 overflow-y-auto">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between font-light">
              <span className="text-charcoal-300">{item.name} <span className="text-white font-normal">x{item.quantity}</span></span>
              <span className="text-[10px] uppercase text-charcoal-500 px-1 border border-charcoal-800 rounded">{item.diet || 'STD'}</span>
            </div>
          ))}
        </div>

        {/* Actions bar */}
        <div className="flex gap-2 pt-2 border-t border-charcoal-800">
          {order.status === 'Pending' && (
            <button
              onClick={() => updateOrderStatus(order.order_id, 'Preparing')}
              className="flex-grow flex items-center justify-center gap-1.5 py-2 rounded bg-gold-500 hover:bg-gold-600 text-charcoal-900 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Start Preparing
            </button>
          )}
          {order.status === 'Preparing' && (
            <button
              onClick={() => updateOrderStatus(order.order_id, 'Ready')}
              className="flex-grow flex items-center justify-center gap-1.5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" /> Mark as Ready
            </button>
          )}
          {order.status === 'Ready' && (
            <>
              <a
                href={getWhatsAppLink(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded border border-green-500/20 hover:border-green-500 bg-green-950/20 hover:bg-green-950/40 text-green-400 text-[10px] uppercase tracking-widest font-semibold transition-all duration-300"
              >
                <Send className="w-3 h-3" /> WhatsApp
              </a>
              <button
                onClick={() => updateOrderStatus(order.order_id, 'Served')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded bg-gold-500 hover:bg-gold-600 text-charcoal-900 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Hand Over
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-20 bg-charcoal-900 font-sans min-h-screen text-white px-6">
      <div className="max-w-7xl mx-auto py-12 space-y-10">
        
        {/* Header Dashboard Control */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gold-500/10 pb-6">
          <div className="space-y-1">
            <span className="text-gold-500 uppercase tracking-widest text-[10px] font-semibold block">Chef Console</span>
            <h1 className="font-display text-2xl font-bold tracking-wide">Kitchen Display System</h1>
          </div>
          <button
            onClick={() => {
              setUnlocked(false);
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('chef_unlocked');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/20 hover:border-red-500 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs uppercase tracking-widest font-semibold rounded transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Lock Console
          </button>
        </div>

        {/* Analytics Statistics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="glass-card p-5 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Queue Count</span>
              <span className="text-xl font-semibold text-white">{activeQueuedCount} Active</span>
            </div>
            <ShoppingBag className="w-8 h-8 text-gold-500 opacity-60 stroke-[1.2]" />
          </div>
          <div className="glass-card p-5 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Served Revenue</span>
              <span className="text-xl font-semibold text-gold-500">₹{totalSales}</span>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500 opacity-60 stroke-[1.2]" />
          </div>
          <div className="glass-card p-5 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Best Selling Plate</span>
              <span className="text-sm font-semibold text-white truncate max-w-[140px] block">{getBestSeller()}</span>
            </div>
            <Sparkles className="w-8 h-8 text-gold-500 opacity-60 stroke-[1.2]" />
          </div>
          <div className="glass-card p-5 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Completed Tickets</span>
              <span className="text-xl font-semibold text-white">{servedOrders.length} Served</span>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400 opacity-60 stroke-[1.2]" />
          </div>
        </div>

        {/* Mobile Column Switcher (Tabbar) */}
        <div className="md:hidden flex bg-charcoal-950 p-1 rounded-lg border border-gold-500/10">
          {[
            { id: 'Pending', count: pendingOrders.length, name: 'New' },
            { id: 'Preparing', count: preparingOrders.length, name: 'Preparing' },
            { id: 'Ready', count: readyOrders.length, name: 'Ready' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileActiveTab(tab.id)}
              className={`flex-1 py-2 text-xs uppercase tracking-widest font-semibold rounded-md flex items-center justify-center gap-2 cursor-pointer ${
                mobileActiveTab === tab.id
                  ? 'bg-gold-500 text-charcoal-900 font-bold'
                  : 'text-charcoal-400 hover:text-white'
              }`}
            >
              {tab.name}
              <span className={`text-[10px] px-1.5 rounded-full font-bold ${
                mobileActiveTab === tab.id ? 'bg-charcoal-900 text-gold-500' : 'bg-charcoal-900 text-charcoal-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 3-Column Lanes Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Lane 1: Pending (New Orders) */}
          <div className={`space-y-4 md:block ${mobileActiveTab === 'Pending' ? 'block' : 'hidden'}`}>
            <div className="flex justify-between items-center bg-charcoal-950/60 p-3 rounded-lg border border-gold-500/10">
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" /> New Orders
              </h2>
              <span className="text-xs bg-charcoal-900 border border-gold-500/10 text-gold-500 font-bold px-2.5 py-0.5 rounded-full">
                {pendingOrders.length}
              </span>
            </div>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl text-charcoal-500 text-xs">
                  No pending tickets
                </div>
              ) : (
                pendingOrders.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Lane 2: Preparing */}
          <div className={`space-y-4 md:block ${mobileActiveTab === 'Preparing' ? 'block' : 'hidden'}`}>
            <div className="flex justify-between items-center bg-charcoal-950/60 p-3 rounded-lg border border-gold-500/10">
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> In Preparation
              </h2>
              <span className="text-xs bg-charcoal-900 border border-gold-500/10 text-gold-500 font-bold px-2.5 py-0.5 rounded-full">
                {preparingOrders.length}
              </span>
            </div>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {preparingOrders.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl text-charcoal-500 text-xs">
                  No active preparation
                </div>
              ) : (
                preparingOrders.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Lane 3: Ready for pick up */}
          <div className={`space-y-4 md:block ${mobileActiveTab === 'Ready' ? 'block' : 'hidden'}`}>
            <div className="flex justify-between items-center bg-charcoal-950/60 p-3 rounded-lg border border-gold-500/10">
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ready to Serve
              </h2>
              <span className="text-xs bg-charcoal-900 border border-gold-500/10 text-gold-500 font-bold px-2.5 py-0.5 rounded-full">
                {readyOrders.length}
              </span>
            </div>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {readyOrders.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl text-charcoal-500 text-xs">
                  No plates waiting
                </div>
              ) : (
                readyOrders.map(renderOrderCard)
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
