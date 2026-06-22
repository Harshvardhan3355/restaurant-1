import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Users, Clock, Send, Check } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !date) return;
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      // reset form
      setName('');
      setPhone('');
      setEmail('');
      setDate('');
      setGuests('2');
      setNotes('');
    }, 1500);
  };

  return (
    <div className="pt-20 bg-charcoal-900 font-sans min-h-screen text-white px-6">
      <div className="max-w-7xl mx-auto py-16 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-gold-500 uppercase tracking-[0.2em] text-xs font-semibold">Join Our Table</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wide">Reservations & Location</h1>
          <p className="text-sm text-charcoal-400 font-light leading-relaxed">
            Reserve your seating or send us an inquiry. Walk-ins are accommodated based on micro-season seat availability.
          </p>
        </div>

        {/* Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 rounded-xl space-y-6"
          >
            <h2 className="font-display text-2xl text-white font-medium">Table Reservation</h2>
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4 text-xs font-light text-charcoal-300"
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal-400 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-charcoal-900/60 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal-400 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit number"
                        className="w-full bg-charcoal-900/60 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal-400 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@email.com"
                        className="w-full bg-charcoal-900/60 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal-400 block mb-1">Reservation Date</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-charcoal-900/60 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal-400 block mb-1">Number of Guests</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-charcoal-900/60 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal-400 block mb-1">Seating Time</label>
                      <select className="w-full bg-charcoal-900/60 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors">
                        {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-charcoal-400 block mb-1">Dietary Preferences / Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Indicate any allergies or seating preferences..."
                      rows={3}
                      className="w-full bg-charcoal-900/60 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/40 text-charcoal-900 uppercase tracking-widest font-bold text-xs rounded transition-all duration-300 shadow-lg shadow-gold-500/10 cursor-pointer mt-4"
                  >
                    {loading ? 'Submitting Reservation...' : (
                      <>
                        Request Booking <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 border border-green-500/20">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-white">Booking Request Received</h3>
                  <p className="text-xs text-charcoal-400 font-light max-w-sm leading-relaxed">
                    Thank you. We have logged your request. A host will review seat availability for your selected date and email/SMS confirmation details shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-gold-500 uppercase tracking-widest hover:text-white transition-colors duration-300 font-semibold border-b border-gold-500 pb-0.5"
                  >
                    Book Another Table
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Details & Map */}
          <div className="space-y-8 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-8 rounded-xl space-y-6"
            >
              <h2 className="font-display text-2xl text-white font-medium">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-light text-charcoal-300">
                <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="p-2.5 bg-gold-500/5 text-gold-500 rounded-full border border-gold-500/10 inline-block"><Phone className="w-4 h-4" /></span>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block mb-0.5">Call Us</span>
                    <a href="tel:+91205550198" className="text-white hover:text-gold-500 transition-colors">+91 20 555 0198</a>
                  </div>
                </div>

                <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="p-2.5 bg-gold-500/5 text-gold-500 rounded-full border border-gold-500/10 inline-block"><Mail className="w-4 h-4" /></span>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block mb-0.5">Email Us</span>
                    <a href="mailto:reservations@aether.com" className="text-white hover:text-gold-500 transition-colors">reservations@aether.com</a>
                  </div>
                </div>

                <div className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="p-2.5 bg-gold-500/5 text-gold-500 rounded-full border border-gold-500/10 inline-block"><MapPin className="w-4 h-4" /></span>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block mb-0.5">Location</span>
                    <span className="text-white">Spine Road, Chinchwad, MH</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Geometric SVG Map of Pimpri Chinchwad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card rounded-xl overflow-hidden h-[280px] relative border border-gold-500/10 bg-charcoal-950 flex flex-col justify-end"
            >
              {/* SVG Map */}
              <svg className="absolute inset-0 w-full h-full text-charcoal-800" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background grid lines */}
                <path d="M 0,50 L 600,50 M 0,150 L 600,150 M 0,250 L 600,250 M 100,0 L 100,300 M 300,0 L 300,300 M 500,0 L 500,300" stroke="#1b1b1e" strokeWidth="0.8" strokeDasharray="3 6" />

                {/* River Indrayani Path */}
                <path d="M-20,190 C 80,180 180,240 280,210 C 380,180 440,120 620,140" stroke="#1c2d3d" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                <path d="M-20,190 C 80,180 180,240 280,210 C 380,180 440,120 620,140" stroke="#253e52" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

                {/* Main Highways (Pune-Nashik Hwy, Spine Road) */}
                {/* Spine Road */}
                <path d="M 0,120 L 600,120" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="8" />
                <path d="M 0,120 L 600,120" stroke="rgba(197, 168, 128, 0.15)" strokeWidth="1.5" />
                
                {/* Pune-Nashik Hwy */}
                <path d="M 220,0 L 320,300" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="6" />
                <path d="M 220,0 L 320,300" stroke="rgba(197, 168, 128, 0.15)" strokeWidth="1.2" />

                {/* Local Grid Streets */}
                <path d="M 80,0 L 120,300" stroke="#1b1b1e" strokeWidth="1" />
                <path d="M 450,0 L 400,300" stroke="#1b1b1e" strokeWidth="1" />
                
                <path d="M 0,40 C 200,80 300,10 600,60" stroke="#1b1b1e" strokeWidth="0.8" />
                <path d="M 0,260 C 200,240 400,290 600,270" stroke="#1b1b1e" strokeWidth="0.8" />

                <path d="M 200,120 L 220,200 L 380,200 L 400,120" stroke="#1b1b1e" strokeWidth="0.8" />

                {/* Map Labels */}
                <text x="350" y="240" fill="#44444c" fontSize="8" letterSpacing="2" className="uppercase select-none">Indrayani River</text>
                <text x="30" y="110" fill="#44444c" fontSize="8" letterSpacing="2" className="uppercase select-none">Spine Road</text>
                <text x="240" y="40" fill="#44444c" fontSize="8" letterSpacing="1" className="uppercase select-none transform rotate-75">Nashik Hwy</text>
                
                {/* AETHER Location Highlight */}
                {/* Pulsing glow ring */}
                <circle cx="360" cy="120" r="14" fill="url(#goldGlow)" />
                <circle cx="360" cy="120" r="4" fill="#c5a880" />
                <circle cx="360" cy="120" r="1.5" fill="#ffffff" />
                
                {/* Definitions for Glow Gradients */}
                <defs>
                  <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c5a880" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#c5a880" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
              
              {/* Map Info Overlay */}
              <div className="absolute top-4 left-4 glass-card p-3 rounded-lg border border-gold-500/15">
                <span className="text-[9px] uppercase tracking-widest text-gold-500 block font-semibold mb-0.5">Location Pin</span>
                <span className="text-[11px] text-white font-medium block">AETHER Gastronomy</span>
                <span className="text-[9px] text-charcoal-400 block font-light">Sector 20, Chinchwad, Pune</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
