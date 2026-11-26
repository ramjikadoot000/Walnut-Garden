import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Minus,
  ShoppingBag,
  X,
  Coffee,
  FileImage,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from '../components/StarText';
import { CartItem } from '../components/CartDrawer';

interface MenuPageProps {
  cart: CartItem[];
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onOpenCart: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOriginalMenuCard, setShowOriginalMenuCard] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const items = siteContent.bestsellers.items.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (searchQuery.trim() !== '') return true;
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Bestsellers') return Boolean(item.bestseller);
    return item.category === activeCategory;
  });

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <main className="pt-28 pb-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Top Back Navigation */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C8BFA8] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowOriginalMenuCard(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.18em] uppercase border border-[#D4AF37]/40 text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-[#0C0A09] transition-colors cursor-pointer whitespace-nowrap"
        >
          <FileImage className="w-3.5 h-3.5" />
          <span>View Printed Menu Card</span>
        </button>
      </div>

      {/* Menu Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3">
            {siteContent.bestsellers.kicker}
          </p>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-normal text-[#F5EFE6] tracking-tight [text-wrap:balance]">
            <StarText text={siteContent.bestsellers.heading} />
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[#C8BFA8] max-w-md font-light leading-relaxed">
          {siteContent.bestsellers.subtext}
        </p>
      </div>

      {/* Kitchen Note + Search Bar */}
      <div className="mb-8 p-4 rounded-lg bg-[#14110F] border border-[#D4AF37]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-[#C8BFA8] leading-relaxed">
          <span className="text-[#D4AF37] uppercase tracking-[0.18em] font-medium mr-2">
            Kitchen Note:
          </span>
          {siteContent.bestsellers.weekendNote}
        </p>

        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-3.5 h-3.5 text-[#C8BFA8]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any dish (e.g. Sepu Badi, Parantha)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#1C1815] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] placeholder-[#C8BFA8]/45 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Category Filter Tabs + Order Cart Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-10 border-b border-[#F5EFE6]/10">
        <div className="flex flex-wrap items-center gap-2">
          {['All', ...siteContent.bestsellers.categories].map((cat) => {
            const active = activeCategory === cat && searchQuery.trim() === '';
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-3.5 py-2 text-[11px] tracking-[0.16em] uppercase rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#D4AF37] text-[#0C0A09] font-medium'
                    : 'bg-[#161311] text-[#C8BFA8] hover:text-[#F5EFE6] border border-[#F5EFE6]/10'
                }`}
              >
                {cat === 'All'
                  ? `All Dishes (${siteContent.bestsellers.items.length})`
                  : cat}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCart}
          className="self-start lg:self-auto flex items-center gap-3 px-4 py-2.5 text-xs tracking-[0.18em] uppercase bg-[#161311] border border-[#D4AF37]/40 text-[#F5EFE6] rounded hover:border-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Order Cart</span>
          <span aria-hidden="true" className="text-[#C8BFA8]/40">·</span>
          <span className="font-mono-tabular text-[#D4AF37]">
            {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'} (₹{subtotal})
          </span>
        </button>
      </div>

      {/* Full Dishes Grid — 4 Compact Tiles Per Row on Desktop */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item, idx) => {
            const inCart = cart.find((c) => c.id === item.id);
            const hasFailed = failedImages[item.id];

            return (
              <article
                key={item.id}
                className="group h-full bg-[#14110F] border border-[#F5EFE6]/12 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37]/45"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-[#1C1815] overflow-hidden">
                    {!hasFailed ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1C1815] to-[#0C0A09] p-5 text-center">
                        <Coffee className="w-7 h-7 text-[#D4AF37]/60 mb-2" />
                        <span className="font-serif-display text-base text-[#F5EFE6]/80">
                          {item.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-[#14110F]/15 to-transparent opacity-80" />
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-[#C8BFA8]/75 mb-2">
                      <span className="font-mono-tabular text-[#D4AF37]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{item.category}</span>
                    </div>

                    <h2 className="font-serif-display text-lg sm:text-xl text-[#F5EFE6] font-normal leading-snug mb-1.5 line-clamp-1">
                      {item.name}
                    </h2>

                    <p className="text-xs sm:text-[13px] text-[#C8BFA8]/85 font-light leading-relaxed line-clamp-2 min-h-[2.4rem]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-[#F5EFE6]/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#C8BFA8]/60 block">
                      PRICE
                    </span>
                    <span className="font-mono-tabular text-base text-[#F5EFE6] font-medium">
                      ₹{item.price}
                    </span>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-1.5 bg-[#1D1916] border border-[#D4AF37]/50 rounded px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="p-1 text-[#C8BFA8] hover:text-[#D4AF37] transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono-tabular text-xs px-1.5 text-[#F5EFE6]">
                        {inCart.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="p-1 text-[#C8BFA8] hover:text-[#D4AF37] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase font-medium bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-16 px-6 text-center rounded-xl bg-[#14110F] border border-[#F5EFE6]/10">
          <p className="font-serif-display text-2xl text-[#F5EFE6] mb-2">
            No dishes match “{searchQuery}”
          </p>
          <p className="text-sm text-[#C8BFA8]/75 mb-5">
            Try searching for Himachali dishes, paranthas, momos, or reset the filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
            className="px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer"
          >
            Show All Dishes
          </button>
        </div>
      )}

      {/* Original Physical Menu Card Modal */}
      <AnimatePresence>
        {showOriginalMenuCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOriginalMenuCard(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#14110F] border border-[#D4AF37]/40 rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F5EFE6]/10">
                <div>
                  <span className="text-[10px] tracking-[0.24em] uppercase text-[#D4AF37] block">
                    WALNUT GARDEN · CAFE & CAMPING
                  </span>
                  <h3 className="font-serif-display text-xl text-[#F5EFE6]">
                    Official Printed Menu Card
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOriginalMenuCard(false)}
                  aria-label="Close menu card preview"
                  className="p-2 text-[#C8BFA8] hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[80vh] overflow-auto bg-[#0C0A09] p-2">
                <img
                  src={siteContent.brand.menuCardImage}
                  alt="Walnut Garden Full Menu Card"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain mx-auto"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
