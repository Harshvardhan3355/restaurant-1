import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';

export default function Home() {
  const taglines = ["sensory textures", "seasonal ingredients", "culinary narratives", "pure gastronomy"];
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    let timer;
    const currentFullText = taglines[taglineIndex];
    const speed = isDeleting ? 40 : 100;

    if (!isDeleting && displayText === currentFullText) {
      // Wait before starting deletion
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    } else {
      timer = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentFullText.slice(0, displayText.length - 1)
            : currentFullText.slice(0, displayText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, taglineIndex]);

  const featuredItems = [
    {
      id: 'spec-1',
      name: 'Charred Heirloom Carrots',
      price: 680,
      description: 'Slow-roasted multi-colored carrots, wild honey glaze, whipped macadamia cream, and carrot top pesto oil.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'spec-2',
      name: 'Pan-Seared Sea Bass',
      price: 1450,
      description: 'Sustainably sourced sea bass, lemongrass broth infusion, wilted sea greens, baby bok choy, and ginger emulsion.',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'spec-3',
      name: 'Matcha Forest Textures',
      price: 520,
      description: 'Layered Uji matcha soil, white chocolate mousse logs, black sesame sponge cake, and raspberry gel cloud.',
      image: 'https://images.unsplash.com/photo-1536680465769-2365207b035e?auto=format&fit=crop&w=600&q=80',
    }
  ];

  return (
    <div className="pt-20 bg-charcoal-900 font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_restaurant_bg.png"
            alt="Aether Restaurant Interior"
            className="w-full h-full object-cover scale-105 animate-pulse-slow brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-500 uppercase tracking-[0.3em] text-xs font-semibold block"
          >
            AETHER GASTRONOMY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl md:text-6xl font-bold text-white tracking-wide leading-tight min-h-[140px] md:min-h-[160px]"
          >
            Crafting <br />
            <span className="text-gold-400 typewriter-cursor border-r border-gold-500/80 pr-1">
              {displayText}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base text-charcoal-300 max-w-xl mx-auto font-light leading-relaxed"
          >
            A minimalist dialogue between culinary tradition and modern flavor architectures. Honoring the essence of clean ingredients.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-6"
          >
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-charcoal-900 uppercase tracking-widest font-bold text-xs rounded transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 cursor-pointer"
            >
              Explore Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Strip */}
      <section className="bg-charcoal-900 border-y border-gold-500/10 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full border border-gold-500/15 flex items-center justify-center text-gold-500">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Dinner Hours</span>
              <span className="text-sm text-white font-medium">Tue - Sun | 18:00 - 23:00</span>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <div className="w-10 h-10 rounded-full border border-gold-500/15 flex items-center justify-center text-gold-500">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Address Location</span>
              <span className="text-sm text-white font-medium">Spine Road, Chinchwad, Pune</span>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-end">
            <div className="w-10 h-10 rounded-full border border-gold-500/15 flex items-center justify-center text-gold-500">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-charcoal-500 block">Reservations</span>
              <span className="text-sm text-white font-medium">+91 20 555 0198</span>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="w-12 h-[1px] bg-gold-500 mx-auto" />
        <h2 className="font-display text-2xl md:text-4xl text-white tracking-wide">
          The Fifth Element
        </h2>
        <p className="text-sm md:text-base text-charcoal-400 font-light max-w-2xl mx-auto leading-relaxed">
          In gastronomy, standard dishes satisfy the physical senses. At AETHER, we strive for the fifth state — the harmonious vacuum where texture, heat, aesthetics, aroma, and quiet spaces align. We invite you to pause, disconnect, and experience nourishment as a minimalist art form.
        </p>
        <div className="w-12 h-[1px] bg-gold-500 mx-auto" />
      </section>

      {/* Featured Highlights */}
      <section className="py-24 px-6 bg-charcoal-900/50 border-t border-gold-500/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold">CHEF'S CULINARY PROLOGUE</span>
            <h2 className="font-display text-3xl font-bold text-white tracking-wider">Signature Highlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glass-card rounded-xl overflow-hidden flex flex-col group h-full"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-display text-lg text-white font-medium group-hover:text-gold-500 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="text-sm font-semibold text-gold-500">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-charcoal-400 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    to="/menu"
                    className="inline-flex items-center justify-center w-full py-2.5 bg-charcoal-800 group-hover:bg-gold-500 group-hover:text-charcoal-900 text-gold-500 font-sans text-xs uppercase tracking-widest font-semibold border border-gold-500/10 group-hover:border-gold-500 rounded transition-all duration-300"
                  >
                    View in Menu
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
