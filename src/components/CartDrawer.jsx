import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, QrCode, CreditCard, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, getCartTotals, placeOrder } = useCart();
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState('Dine-In'); // Dine-In, Pickup, Delivery
  const navigate = useNavigate();

  // Step 2 Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('18:00');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Step 3 Payment States
  const [paymentMethod, setPaymentMethod] = useState('Card'); // Card, UPI
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Step 4 OTP States
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Step 5 Receipt State
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const { subtotal, gst, packagingFee, grandTotal } = getCartTotals();

  // Reset drawer state when closed/opened
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setOtp('');
      setOtpError('');
      setFormErrors({});
    }
  }, [isOpen]);

  const handleQuantityChange = (itemId, q) => {
    updateQuantity(itemId, q);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (cart.length === 0) return;
      setStep(2);
    } else if (step === 2) {
      // Validate details
      const errors = {};
      if (!name.trim()) errors.name = 'Name is required';
      if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) errors.phone = 'A valid 10-digit phone number is required';
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'A valid email address is required';
      
      if (orderType === 'Dine-In' && !tableNumber) {
        errors.tableNumber = 'Table number is required';
      }
      if (orderType === 'Delivery' && !deliveryAddress.trim()) {
        errors.deliveryAddress = 'Delivery address is required';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setFormErrors({});
      setStep(3);
    } else if (step === 3) {
      // Validate payment
      if (paymentMethod === 'Card') {
        const errors = {};
        if (!cardNumber.trim() || cardNumber.length < 16) errors.cardNumber = 'Valid 16-digit card is required';
        if (!cardExpiry.trim()) errors.cardExpiry = 'Expiry date is required';
        if (!cardCvv.trim() || cardCvv.length < 3) errors.cardCvv = 'CVV is required';

        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          return;
        }
      }
      setFormErrors({});
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1 && step < 5) {
      setStep(step - 1);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (otp !== '7724') {
      setOtpError('Invalid authorization code. Please enter 7724.');
      return;
    }

    setOtpError('');
    setVerifyingOtp(true);

    // Simulate database insertion & order placement
    try {
      const order = await placeOrder({
        name,
        phone,
        email,
        orderType,
        tableNumber: orderType === 'Dine-In' ? tableNumber : null,
        timeSlot: orderType === 'Pickup' ? timeSlot : null,
        deliveryAddress: orderType === 'Delivery' ? deliveryAddress : null,
        paymentMethod,
      });

      setPlacedOrderDetails(order);
      setVerifyingOtp(false);
      setStep(5);

      // Trigger high-end confetti celebration
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c5a880', '#e8dbb2', '#1b1b1e', '#d4af37'],
      });
    } catch (err) {
      console.error(err);
      setOtpError('An error occurred during verification. Try again.');
      setVerifyingOtp(false);
    }
  };

  const handleTrackRedirect = () => {
    if (placedOrderDetails) {
      onClose();
      navigate(`/track/${placedOrderDetails.order_id}`);
    }
  };

  const handleClose = () => {
    if (step === 5) {
      onClose();
    } else {
      onClose();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col h-full max-h-full justify-between overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gold-500/10 flex items-center justify-between">
              <span className="font-display text-lg tracking-wider text-white">Your Order</span>
              <button onClick={handleClose} className="p-2 text-charcoal-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-charcoal-600 stroke-[1.2]" />
                  <p className="text-charcoal-400 font-light text-sm">Your order is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-charcoal-800 pb-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-charcoal-800" />
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between">
                        <span className="font-display text-sm font-medium text-white">{item.name}</span>
                        <span className="font-sans text-sm text-gold-500">₹{item.price * item.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gold-500/15 rounded bg-charcoal-900 overflow-hidden">
                          <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="p-1 px-2 text-charcoal-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs text-white">{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="p-1 px-2 text-charcoal-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-charcoal-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Order Type Toggle */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-charcoal-800">
                  <span className="text-xs uppercase tracking-widest text-charcoal-400 font-medium block mb-3">Order Type</span>
                  <div className="grid grid-cols-3 gap-2 bg-charcoal-900/50 p-1 rounded-lg border border-gold-500/10">
                    {['Dine-In', 'Pickup', 'Delivery'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`py-2 text-xs uppercase tracking-widest font-semibold rounded-md transition-all cursor-pointer ${
                          orderType === type
                            ? 'bg-gold-500 text-charcoal-900 shadow-md shadow-gold-500/10'
                            : 'text-charcoal-400 hover:text-white hover:bg-charcoal-800'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="bg-charcoal-900 p-6 border-t border-gold-500/10 space-y-4">
                <div className="space-y-2 text-sm text-charcoal-400 font-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging / Service Fee</span>
                    <span>₹{packagingFee}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-charcoal-800">
                    <span>Total Amount</span>
                    <span className="text-gold-500">₹{grandTotal}</span>
                  </div>
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-900 uppercase tracking-widest font-bold text-xs rounded transition-all duration-300 shadow-lg shadow-gold-500/10 cursor-pointer"
                >
                  Proceed to Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col h-full max-h-full justify-between overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gold-500/10 flex items-center gap-3">
              <button onClick={handlePrevStep} className="p-1 text-charcoal-400 hover:text-white cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
              <span className="font-display text-lg tracking-wider text-white">Your details</span>
            </div>

            {/* Form */}
            <div className="flex-grow overflow-y-auto px-6 py-6 space-y-6">
              <div className="space-y-4 font-sans">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-charcoal-400">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                  />
                  {formErrors.name && <p className="text-xs text-red-400 mt-1 font-light">{formErrors.name}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-charcoal-400">10-Digit Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                  />
                  {formErrors.phone && <p className="text-xs text-red-400 mt-1 font-light">{formErrors.phone}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-charcoal-400">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@email.com"
                    className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                  />
                  {formErrors.email && <p className="text-xs text-red-400 mt-1 font-light">{formErrors.email}</p>}
                </div>

                {/* Dine-In Table Selection */}
                {orderType === 'Dine-In' && (
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-charcoal-400">Select Table Number</label>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                    >
                      <option value="">-- Choose Table --</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Table #{i + 1}</option>
                      ))}
                    </select>
                    {formErrors.tableNumber && <p className="text-xs text-red-400 mt-1 font-light">{formErrors.tableNumber}</p>}
                  </div>
                )}

                {/* Pickup Time Slots */}
                {orderType === 'Pickup' && (
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-charcoal-400">Select Pickup Time</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                    >
                      {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'].map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Delivery Address */}
                {orderType === 'Delivery' && (
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-charcoal-400">Delivery Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter full delivery address in Chinchwad / Pune"
                      rows={3}
                      className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                    {formErrors.deliveryAddress && <p className="text-xs text-red-400 mt-1 font-light">{formErrors.deliveryAddress}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-charcoal-900 p-6 border-t border-gold-500/10">
              <button
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-900 uppercase tracking-widest font-bold text-xs rounded transition-all duration-300 cursor-pointer"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col h-full max-h-full justify-between overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gold-500/10 flex items-center gap-3">
              <button onClick={handlePrevStep} className="p-1 text-charcoal-400 hover:text-white cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
              <span className="font-display text-lg tracking-wider text-white">Payment Method</span>
            </div>

            {/* Selection */}
            <div className="flex-grow overflow-y-auto px-6 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'Card'
                      ? 'border-gold-500 bg-gold-500/5 text-gold-500'
                      : 'border-charcoal-800 text-charcoal-400 hover:border-gold-500/30'
                  }`}
                >
                  <CreditCard className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-xs uppercase tracking-widest font-semibold">Credit/Debit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-gold-500 bg-gold-500/5 text-gold-500'
                      : 'border-charcoal-800 text-charcoal-400 hover:border-gold-500/30'
                  }`}
                >
                  <QrCode className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-xs uppercase tracking-widest font-semibold">UPI QR Code</span>
                </button>
              </div>

              {/* Dynamic View */}
              {paymentMethod === 'Card' ? (
                <div className="space-y-4 font-sans">
                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest text-charcoal-400">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                    />
                    {formErrors.cardNumber && <p className="text-xs text-red-400 mt-1 font-light">{formErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry */}
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-charcoal-400">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                          setCardExpiry(val.slice(0, 5));
                        }}
                        placeholder="MM/YY"
                        className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                      />
                      {formErrors.cardExpiry && <p className="text-xs text-red-400 mt-1 font-light">{formErrors.cardExpiry}</p>}
                    </div>

                    {/* CVV */}
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-charcoal-400">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="***"
                        className="w-full bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-3 rounded text-sm text-white focus:outline-none transition-colors"
                      />
                      {formErrors.cardCvv && <p className="text-xs text-red-400 mt-1 font-light">{formErrors.cardCvv}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 border border-gold-500/10 rounded-xl bg-charcoal-900/50 space-y-4">
                  <div className="p-3 bg-white rounded-lg relative overflow-hidden shadow-xl shadow-gold-500/5">
                    {/* Simulated QR Code using styling */}
                    <div className="w-40 h-40 flex items-center justify-center bg-zinc-100 text-zinc-800 font-bold border-4 border-white font-sans text-xs flex-col relative">
                      <QrCode className="w-32 h-32 text-charcoal-900 stroke-[1.2]" />
                      <span className="text-[10px] text-charcoal-600 mt-1 uppercase font-semibold">₹{grandTotal}</span>
                    </div>
                  </div>
                  <p className="text-xs text-charcoal-400 font-light text-center">
                    Scan using GPay, PhonePe, or BHIM. <br />
                    Payment will process automatically.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="bg-charcoal-900 p-6 border-t border-gold-500/10">
              <button
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-900 uppercase tracking-widest font-bold text-xs rounded transition-all duration-300 cursor-pointer"
              >
                Proceed to Verification <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col h-full max-h-full justify-between overflow-hidden font-sans">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gold-500/10 flex items-center gap-3">
              <button onClick={handlePrevStep} className="p-1 text-charcoal-400 hover:text-white cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
              <span className="font-display text-lg tracking-wider text-white">Verification</span>
            </div>

            {/* OTP Entry */}
            <form onSubmit={handleOtpVerify} className="flex-grow overflow-y-auto px-6 py-8 flex flex-col justify-center space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500">
                  <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-xl font-medium text-white">3D Secure Validation</h3>
                <p className="text-sm text-charcoal-400 font-light leading-relaxed px-4">
                  We sent an authentication code to your registered mobile number <strong className="text-white">+91 ******{phone.slice(-4)}</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1 text-center">
                  <label className="text-xs uppercase tracking-widest text-charcoal-400 block mb-2">Enter Verification Code (OTP)</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="Enter '7724'"
                    className="bg-charcoal-900 border border-gold-500/15 focus:border-gold-500 p-4 text-center rounded text-xl font-bold tracking-[0.5em] text-white focus:outline-none transition-colors w-48 mx-auto block"
                  />
                  {otpError && <p className="text-xs text-red-400 mt-2 font-light">{otpError}</p>}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={verifyingOtp}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/40 text-charcoal-900 uppercase tracking-widest font-bold text-xs rounded transition-all duration-300 cursor-pointer"
                >
                  {verifyingOtp ? 'Verifying payment...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col h-full max-h-full justify-between overflow-hidden font-sans">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gold-500/10 flex items-center justify-between">
              <span className="font-display text-lg tracking-wider text-white">Order Confirmed</span>
              <button onClick={handleClose} className="p-2 text-charcoal-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            {/* Receipt Content */}
            <div className="flex-grow overflow-y-auto px-6 py-6 space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-400">
                  <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white">Thank you for dining with AETHER</h3>
                <p className="text-xs text-charcoal-400 font-light">Your order details are listed below. A confirmation has been logged.</p>
              </div>

              {/* Styled Receipt */}
              <div className="border border-gold-500/15 rounded-xl bg-charcoal-900 p-5 space-y-4">
                {/* Codes */}
                <div className="flex justify-between items-center pb-4 border-b border-charcoal-800">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Order ID</span>
                    <span className="text-xs font-semibold text-white">{placedOrderDetails?.order_id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Pickup Code</span>
                    <span className="text-sm font-bold text-gold-500 font-sans">{placedOrderDetails?.pickup_code}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-charcoal-400 font-light pb-4 border-b border-charcoal-800">
                  <div className="flex justify-between">
                    <span>Guest Name</span>
                    <span className="text-white font-medium">{placedOrderDetails?.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Type</span>
                    <span className="text-white font-medium">{placedOrderDetails?.order_type}</span>
                  </div>
                  {placedOrderDetails?.order_type === 'Dine-In' && (
                    <div className="flex justify-between">
                      <span>Table Assigned</span>
                      <span className="text-gold-500 font-semibold">Table #{placedOrderDetails?.table_number}</span>
                    </div>
                  )}
                  {placedOrderDetails?.order_type === 'Pickup' && (
                    <div className="flex justify-between">
                      <span>Pickup Time</span>
                      <span className="text-white font-medium">{placedOrderDetails?.time_slot}</span>
                    </div>
                  )}
                  {placedOrderDetails?.order_type === 'Delivery' && (
                    <div className="flex flex-col text-left space-y-1">
                      <span>Delivery Address</span>
                      <span className="text-white font-medium pl-2 border-l border-gold-500/15">{placedOrderDetails?.deliveryAddress}</span>
                    </div>
                  )}
                </div>

                {/* Items Summarized */}
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block mb-2">Items ordered</span>
                  {placedOrderDetails?.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs font-light">
                      <span className="text-charcoal-400">{item.name} <span className="text-white font-normal">x{item.quantity}</span></span>
                      <span className="text-charcoal-300">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-4 border-t border-charcoal-800 space-y-1 text-xs text-charcoal-400">
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{placedOrderDetails?.gst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging fee</span>
                    <span>₹{placedOrderDetails?.packaging_fee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-white pt-1">
                    <span>Total Amount</span>
                    <span className="text-gold-500">₹{placedOrderDetails?.grand_total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt CTA */}
            <div className="bg-charcoal-900 p-6 border-t border-gold-500/10">
              <button
                onClick={handleTrackRedirect}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-900 uppercase tracking-widest font-bold text-xs rounded transition-all duration-300 shadow-lg shadow-gold-500/10 cursor-pointer"
              >
                Track Live Order <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-charcoal-900/95 border-l border-gold-500/10 flex flex-col h-screen max-h-screen overflow-hidden"
          >
            {renderStep()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
