import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuCard from '../components/MenuCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'starters';

  const categories = [
    { id: 'starters', name: 'Starters' },
    { id: 'mains', name: 'Mains' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' },
  ];

  const menuItems = {
    starters: [
      {
        id: 'st-1',
        name: 'Wild Mushroom Consommé',
        price: 450,
        description: 'Double-strained forest mushroom broth, truffle dust, dehydrated chanterelles, and fresh chervil.',
        rating: 4.8,
        reviews: 24,
        diet: 'VG',
        label: 'Chef\'s Signature',
        image: '/menu/Wild Mushroom Consommé.jpg',
      },
      {
        id: 'st-2',
        name: 'Coal-Fired Asparagus',
        price: 620,
        description: 'Tender green asparagus charred over wood embers, white miso emulsion, toasted sesame powder, and micro herbs.',
        rating: 4.6,
        reviews: 18,
        diet: 'GF',
        image: '/menu/Coal-Fired Asparagus.jpg',
      },
      {
        id: 'st-3',
        name: 'Crispy Burrata Salad',
        price: 720,
        description: 'Handcrafted local burrata, flash-fried skin, organic heirloom tomato carpaccio, basil oil pearls, and aged balsamic glass.',
        rating: 4.9,
        reviews: 42,
        diet: 'V',
        label: 'Popular',
        image: '/menu/Crispy Burrata Salad.jpg',
      },
      {
        id: 'st-4',
        name: 'Truffle Arancini',
        price: 580,
        description: 'Crisp Arborio rice croquettes infused with black summer truffle paste, scamorza cheese core, and garlic aioli.',
        rating: 4.7,
        reviews: 35,
        diet: 'V',
        image: '/menu/Truffle Arancini.webp',
      }
    ],
    mains: [
      {
        id: 'mn-1',
        name: 'Pan-Seared Sea Bass',
        price: 1450,
        description: 'Sustainably sourced sea bass, lemongrass broth infusion, wilted sea greens, baby bok choy, and ginger emulsion.',
        rating: 4.9,
        reviews: 58,
        diet: 'GF',
        label: 'Chef\'s Special',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'mn-2',
        name: 'Saffron Lobster Tagliolini',
        price: 1650,
        description: 'Hand-cranked egg yolk ribbons, fresh bay lobster tail meat, Kashmiri saffron reduction, fennel fronds, and sea salt.',
        rating: 4.8,
        reviews: 29,
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'mn-3',
        name: 'Wood-Grilled Ribeye',
        price: 1890,
        description: 'Dry-aged tender ribeye cut grilled over applewood embers, black garlic butter melt, roasted fingerling potatoes, and shallot confit.',
        rating: 5.0,
        reviews: 73,
        diet: 'GF',
        label: 'Prime Cut',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'mn-4',
        name: 'Charcoal Roasted Duck',
        price: 1520,
        description: 'Crisp-skin Peking-style duck breast, spice plum glaze, braised red cabbage, parsnip purée, and elderberry jus.',
        rating: 4.7,
        reviews: 21,
        image: 'https://images.unsplash.com/photo-1514944224746-6bba5b09e5c2?auto=format&fit=crop&w=600&q=80',
      }
    ],
    desserts: [
      {
        id: 'ds-1',
        name: 'Matcha Forest Textures',
        price: 520,
        description: 'Layered Uji matcha soil, white chocolate mousse logs, black sesame sponge cake, and raspberry gel cloud.',
        rating: 4.9,
        reviews: 39,
        diet: 'V',
        label: 'Best Seller',
        image: 'https://images.unsplash.com/photo-1536680465769-2365207b035e?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'ds-2',
        name: 'Deconstructed Tiramisu',
        price: 480,
        description: 'Espresso-soaked sponge cake, whipped mascarpone quenelles, chocolate soil dust, and kahlua caviar drops.',
        rating: 4.8,
        reviews: 44,
        diet: 'V',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'ds-3',
        name: 'Smoked Chocolate Mousse',
        price: 460,
        description: 'Single-origin 72% dark chocolate mousse cold-smoked with oak chips, sea salt flakes, olive oil drizzle, and caramelized hazelnut clusters.',
        rating: 4.7,
        reviews: 19,
        diet: 'GF',
        image: 'https://images.unsplash.com/photo-1541795795328-f073b763494e?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'ds-4',
        name: 'Lavender Yuzu Tart',
        price: 420,
        description: 'Crisp pastry shell, sharp Japanese Yuzu citrus curd, dried organic French lavender blossoms, and torched Swiss meringue.',
        rating: 4.5,
        reviews: 14,
        diet: 'V',
        image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
      }
    ],
    beverages: [
      {
        id: 'bv-1',
        name: 'Smoked Rosemary Negroni',
        price: 750,
        description: 'Artisanal dry gin, sweet vermouth, Campari infused with orange rind, served in a rosemary smoke-filled cloche.',
        rating: 4.9,
        reviews: 62,
        label: 'Aether Bar Classic',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bv-2',
        name: 'Hibiscus Ginger Kombucha',
        price: 320,
        description: 'In-house double fermented tea, organic hibiscus petals, pressed ginger extract, sparkling carbonation.',
        rating: 4.7,
        reviews: 26,
        diet: 'VG',
        image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bv-3',
        name: 'Elderflower Tonic Mocktail',
        price: 280,
        description: 'Elderflower syrup concentrate, fresh lime chunks, micro cucumber wheels, premium tonic water, mint garnish.',
        rating: 4.6,
        reviews: 17,
        diet: 'VG',
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'bv-4',
        name: 'Cold Drip Reserve Coffee',
        price: 350,
        description: 'Single-estate Chikmagalur coffee beans dripped over ice for 18 hours, presenting notes of cacao, berries, and a floral finish.',
        rating: 4.8,
        reviews: 31,
        diet: 'VG',
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80',
      }
    ],
  };

  const handleCategoryChange = (category) => {
    setSearchParams({ category });
  };

  return (
    <div className="pt-20 bg-charcoal-900 font-sans min-h-screen text-white px-6">
      <div className="max-w-7xl mx-auto py-16 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-gold-500 uppercase tracking-[0.2em] text-xs font-semibold">Curation of Taste</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wide">The Culinary Menu</h1>
          <p className="text-sm text-charcoal-400 font-light leading-relaxed">
            Please choose a category below. Each dish is prepared à la minute by our culinary artisans using locally sourced organic ingredients.
          </p>
        </div>

        {/* Categories Tab Swiper */}
        <div className="flex justify-center border-b border-charcoal-800">
          <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-none max-w-full">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`text-sm uppercase tracking-widest transition-all duration-300 relative pb-2 font-semibold px-2 cursor-pointer ${
                    isActive ? 'text-gold-500 font-bold' : 'text-charcoal-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                  {isActive && (
                    <motion.span
                      layoutId="menuActiveTabLine"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {menuItems[activeCategory]?.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
