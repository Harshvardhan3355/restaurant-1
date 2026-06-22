import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MenuCard({ item }) {
  const { addToCart } = useCart();

  const getDietBadgeColor = (diet) => {
    switch (diet?.toUpperCase()) {
      case 'VG':
        return 'bg-green-950/40 text-green-400 border-green-500/20'; // Vegan
      case 'V':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'; // Veg
      case 'GF':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/20'; // Gluten Free
      default:
        return 'bg-charcoal-800 text-charcoal-300 border-charcoal-700';
    }
  };

  const getDietLabel = (diet) => {
    switch (diet?.toUpperCase()) {
      case 'VG': return 'Vegan';
      case 'V': return 'Vegetarian';
      case 'GF': return 'Gluten Free';
      default: return '';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="glass-card rounded-xl overflow-hidden flex flex-col h-full group"
    >
      {/* Item Image */}
      <div className="relative h-56 overflow-hidden bg-charcoal-800">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {item.label && (
          <span className="absolute top-4 left-4 bg-gold-500 text-charcoal-900 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
            {item.label}
          </span>
        )}
        {item.diet && (
          <span className={`absolute top-4 right-4 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border ${getDietBadgeColor(item.diet)}`}>
            {getDietLabel(item.diet)}
          </span>
        )}
      </div>

      {/* Item Content */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          {/* Header & Price */}
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-display text-lg font-medium text-white group-hover:text-gold-500 transition-colors duration-300">
              {item.name}
            </h3>
            <span className="font-sans text-base font-semibold text-gold-500">
              ₹{item.price}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(item.rating)
                    ? 'fill-gold-500 text-gold-500'
                    : 'text-charcoal-700'
                }`}
              />
            ))}
            <span className="text-xs text-charcoal-400 font-light ml-1">
              {item.rating} ({item.reviews})
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-charcoal-400 font-light leading-relaxed line-clamp-3 pt-1">
            {item.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <button
            onClick={() => addToCart(item)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-charcoal-800 hover:bg-gold-500 hover:text-charcoal-900 border border-gold-500/20 hover:border-gold-500 text-gold-500 text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add to Order
          </button>
        </div>
      </div>
    </motion.div>
  );
}
