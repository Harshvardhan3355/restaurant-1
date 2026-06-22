import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderTracker from './pages/OrderTracker';
import ChefDashboard from './pages/ChefDashboard';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-charcoal-900 text-white selection:bg-gold-500/30 selection:text-white">
          {/* Header Navigation */}
          <Navbar onCartToggle={() => setIsCartOpen(!isCartOpen)} />
          
          {/* Main Page Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/track/:orderId" element={<OrderTracker />} />
              <Route path="/chef" element={<Navigate to="/kds" replace />} />
              <Route path="/kds" element={<ChefDashboard />} />
            </Routes>
          </main>

          {/* Footer Address & Hours */}
          <Footer />

          {/* Checkout Shopping Cart Drawer */}
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
