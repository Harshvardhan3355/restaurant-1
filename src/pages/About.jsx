import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const sourcingCards = [
    {
      region: 'Indrayani Valley',
      focus: 'Organic Root Crops & Grains',
      description: 'Collaborating directly with smallholder farmers in the Western Ghats to grow heirloom tubers, native carrots, and local Indrayani fragrant rice using organic, biodynamic methods.',
    },
    {
      region: 'Malabar Coast',
      focus: 'Coastal Spices & Pods',
      description: 'Sourcing single-origin green cardamoms, tellicherry black peppercorns, and organic coconut nectars harvested by traditional farming guilds along the Kerala coast.',
    },
    {
      region: 'Konkan Shorelines',
      focus: 'Estuary Sea Greens & Catch',
      description: 'Our seafood and saline herbs are gathered at dawn from clean estuaries in the Konkan belt, ensuring local sea bass and samphire grass arrive at our kitchen within hours.',
    }
  ];

  const tastingMatrix = [
    {
      element: 'Wild Mushroom Consommé',
      profile: 'Deep Umami, Earthy, Mild Salt',
      aroma: 'Oakwood Smoke, Forest Pine, Truffle Damp',
      visual: 'Brilliant amber liquid, floating gold oil pearls, chervil leaf branch',
    },
    {
      element: 'Pan-Seared Sea Bass',
      profile: 'Delicate Sweet, Sharp Citric, Warm Ginger',
      aroma: 'Crushed Lemongrass, Fresh Lime Zest, Sea Salt Breeze',
      visual: 'Crisp silver skin, ivory flesh pool in golden herb broth, bok choy base',
    },
    {
      element: 'Matcha Forest Textures',
      profile: 'Deep Bittersweet, Milky Cream, Nutty Sesame',
      aroma: 'Uji Matcha Grassy Note, Roasted Black Sesame, White Chocolate Cocoa',
      visual: 'Emerald powder dust, sponge logs, charcoal sesame soil, red gel clouds',
    },
    {
      element: 'Smoked Rosemary Negroni',
      profile: 'Bitter Campari, Citrus Sweet, Herbal Dry',
      aroma: 'Burnt Rosemary Sprigs, Orange Oils, Sweet Vermouth Oak',
      visual: 'Ruby red block ice in lead-free crystal glass, cedarwood smoke fog',
    }
  ];

  return (
    <div className="pt-20 bg-charcoal-900 font-sans min-h-screen text-white px-6">
      <div className="max-w-7xl mx-auto py-16 space-y-20">
        
        {/* Intro Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold">The Philosophy</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wide leading-tight">
              A Quiet Dialogue Between Nature and Plate
            </h1>
            <p className="text-sm text-charcoal-400 font-light leading-relaxed">
              Founded in 2024 in Chinchwad, Maharashtra, AETHER is born from a desire to strip fine dining down to its bare, emotional essentials. We do not cook to shock or overwhelm. Instead, our culinary canvas focuses on highlighting the structural essence of singular ingredients.
            </p>
            <p className="text-sm text-charcoal-400 font-light leading-relaxed">
              We practice micro-seasonality. Because nature shifts in cycles shorter than standard calendars, our kitchen menu evolves every 15 days, adapting to the immediate harvests of local farms.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-[400px] rounded-xl overflow-hidden shadow-2xl relative"
          >
            <img
              src="/about_restaurant.png"
              alt="Plating fine dining"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gold-500/5 mix-blend-color" />
          </motion.div>
        </section>

        {/* Sourcing Cards */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold">Geographical Roots</span>
            <h2 className="font-display text-3xl font-bold tracking-wide">Our Sourcing Map</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sourcingCards.map((card, idx) => (
              <motion.div
                key={card.region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="glass-card p-8 rounded-xl space-y-4"
              >
                <div className="w-8 h-[1px] bg-gold-500" />
                <h3 className="font-display text-xl text-white font-medium">{card.region}</h3>
                <span className="text-xs uppercase tracking-widest font-semibold text-gold-500 block">
                  {card.focus}
                </span>
                <p className="text-xs text-charcoal-400 font-light leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tasting Matrix Table */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold">Sensory Elements</span>
            <h2 className="font-display text-3xl font-bold tracking-wide">Tasting Matrix</h2>
            <p className="text-xs text-charcoal-400 font-light max-w-lg mx-auto">
              Our culinary philosophy broken down into primary profiles, volatile aromatics, and structural presentation models.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-x-auto border border-gold-500/10 rounded-xl bg-charcoal-900/60"
          >
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gold-500/10 bg-charcoal-900 font-display text-[10px] uppercase tracking-widest text-gold-500 font-semibold">
                  <th className="p-5 font-bold">Culinary Element</th>
                  <th className="p-5 font-bold">Taste Profile</th>
                  <th className="p-5 font-bold">Volatile Aroma</th>
                  <th className="p-5 font-bold">Visual Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800/60 font-light text-charcoal-300">
                {tastingMatrix.map((row) => (
                  <tr key={row.element} className="hover:bg-charcoal-800/20 transition-colors">
                    <td className="p-5 font-medium font-display text-sm text-white">{row.element}</td>
                    <td className="p-5">{row.profile}</td>
                    <td className="p-5 italic text-charcoal-400">{row.aroma}</td>
                    <td className="p-5 font-sans text-charcoal-400">{row.visual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* Executive Quote Block */}
        <section className="py-12 bg-charcoal-900/50 border-y border-gold-500/10 max-w-4xl mx-auto">
          <blockquote className="text-center space-y-6">
            <p className="font-display text-lg md:text-2xl text-white italic font-light leading-relaxed px-6">
              "We strive to make cooking invisible. An ingredient should taste like itself, elevated only by correct temperature, precise salt levels, and quiet respect. When you sit at AETHER, we want you to taste the earth, the rain, and the fire — nothing else."
            </p>
            <footer className="space-y-1">
              <cite className="not-italic text-sm font-semibold uppercase tracking-widest text-gold-500">
                Kabir Dev
              </cite>
              <p className="text-[10px] uppercase tracking-widest text-charcoal-500">
                Executive Chef & Founder
              </p>
            </footer>
          </blockquote>
        </section>

      </div>
    </div>
  );
}
