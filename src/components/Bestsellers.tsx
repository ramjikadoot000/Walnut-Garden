import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Minus,
  ShoppingBag,
  Coffee,
  ArrowRight,
  Utensils,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from './StarText';
import { CartItem } from './CartDrawer';
import { Reveal } from './Reveal';

interface BestsellersProps {
  cart: CartItem[];
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onOpenCart: () => void;
}

// 12 signature dishes curated as 3 balanced 4-tile menu sets for the homepage showcase
const FEATURED_HOME_IDS = [
  // Set I · Himachali Icons
  'sepu-badi-himachali',
  'aloo-palda',
  'kangri-dham',
  'tudkiya-bhath',
  // Set II · Mountain Kitchen
  'special-chicken-biryani',
  'desi-aalu-parantha',
  'paneer-butter-masala',
  'special-pahadi-rada-chicken',
  // Set III · Fireside & Cafe
  'veg-momos',
  'special-pizza',
  'chocolate-shake',
  'honey-masala-tea',
];

const SET_LABELS = [
  'I. Himachali Icons',
  'II. Mountain Kitchen',
  'III. Fireside & Cafe',
];

function getCardsPerView(): number {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

export const Bestsellers: React.FC<BestsellersProps> = ({
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardsPerView, setCardsPerView] = useState<number>(getCardsPerView);
  const [activePage, setActivePage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  // Curate 12 signature dishes (prioritizing bestseller items and FEATURED_HOME_IDS)
  const curatedFeatured = FEATURED_HOME_IDS.map((id) =>
    siteContent.bestsellers.items.find((item) => item.id === id)
  ).filter((item): item is typeof siteContent.bestsellers.items[0] => Boolean(item));

  const displayItems =
    curatedFeatured.length === 12
      ? curatedFeatured
      : siteContent.bestsellers.items.filter((i) => i.bestseller).slice(0, 12);

  // Group items into clean pages of 4 tiles on desktop (2 on tablet, 1 on mobile)
  const pages: typeof displayItems[] = [];
  for (let i = 0; i < displayItems.length; i += cardsPerView) {
    pages.push(displayItems.slice(i, i + cardsPerView));
  }

  const totalPages = pages.length;

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const syncScrollMetrics = useCallback(() => {
    const el = trackRef.current;
    if (!el || totalPages === 0) return;

    const firstSlide = el.querySelector<HTMLElement>('[data-menu-page]');
    const gap = 20;
    const step = firstSlide ? firstSlide.offsetWidth + gap : el.clientWidth;
    if (step > 0) {
      const idx = Math.round(el.scrollLeft / step);
      setActivePage(Math.max(0, Math.min(totalPages - 1, idx)));
    }
  }, [totalPages]);

  useEffect(() => {
    syncScrollMetrics();
  }, [cardsPerView, syncScrollMetrics]);

  const scrollToPage = (pageIdx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(totalPages - 1, pageIdx));
    const firstSlide = el.querySelector<HTMLElement>('[data-menu-page]');
    const gap = 20;
    const step = firstSlide ? firstSlide.offsetWidth + gap : el.clientWidth;
    el.scrollTo({ left: clamped * step, behavior: 'smooth' });
  };

  // Mouse drag-to-scroll (touch/trackpad handled natively by overflow-x-auto)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    const el = trackRef.current;
    if (!el) return;
    dragStateRef.current = {
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    const el = trackRef.current;
    if (!state.active || !el) return;
    const x = e.pageX - el.offsetLeft;
    const delta = x - state.startX;
    if (Math.abs(delta) > 5) {
      state.moved = true;
    }
    e.preventDefault();
    el.scrollLeft = state.scrollLeft - delta * 1.15;
  };

  const stopDragging = () => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    setIsDragging(false);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const rangeStart = activePage * cardsPerView + 1;
  const rangeEnd = Math.min((activePage + 1) * cardsPerView, displayItems.length);
  const canScrollLeft = activePage > 0;
  const canScrollRight = activePage < totalPages - 1;

  return (
    <section
      id="bestsellers"
      className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto border-b border-[#F5EFE6]/10"
    >
      <div id="menu" className="absolute -top-16" aria-hidden="true" />

      {/* Section Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3">
              03 · FROM THE MOUNTAIN KITCHEN
            </p>
            <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal text-[#F5EFE6] tracking-tight [text-wrap:balance]">
              <StarText text="Signature *Bestsellers*" />
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs tracking-[0.18em] uppercase bg-[#161311] border border-[#F5EFE6]/15 text-[#F5EFE6] rounded hover:border-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Cart</span>
              <span aria-hidden="true" className="text-[#C8BFA8]/40">·</span>
              <span className="font-mono-tabular text-[#D4AF37]">
                {totalItems} (₹{subtotal})
              </span>
            </button>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors whitespace-nowrap shrink-0"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Full Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Reveal>

      {/* 4-Tile Set Switcher + Range Indicator + Left/Right Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#F5EFE6]/10">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-[#C8BFA8]/80">
          <span className="text-[#D4AF37] font-mono-tabular">
            {String(rangeStart).padStart(2, '0')}–{String(rangeEnd).padStart(2, '0')} / {String(displayItems.length).padStart(2, '0')}
          </span>
        </div>

        {/* Desktop Curated 4-Tile Set Tabs */}
        {cardsPerView === 4 && (
          <div className="hidden lg:flex items-center gap-1 p-1 bg-[#14110F] border border-[#F5EFE6]/10 rounded-md">
            {SET_LABELS.map((label, idx) => {
              const isSelected = activePage === idx;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollToPage(idx)}
                  className={`px-3.5 py-1.5 text-[11px] tracking-[0.16em] uppercase rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#0C0A09] font-medium'
                      : 'text-[#C8BFA8] hover:text-[#F5EFE6]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToPage(activePage - 1)}
            disabled={!canScrollLeft}
            aria-label="Previous four dishes"
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              canScrollLeft
                ? 'border-[#F5EFE6]/20 bg-[#14110F] text-[#F5EFE6] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0C0A09] cursor-pointer'
                : 'border-[#F5EFE6]/10 bg-[#14110F]/50 text-[#C8BFA8]/30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToPage(activePage + 1)}
            disabled={!canScrollRight}
            aria-label="Next four dishes"
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              canScrollRight
                ? 'border-[#F5EFE6]/20 bg-[#14110F] text-[#F5EFE6] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0C0A09] cursor-pointer'
                : 'border-[#F5EFE6]/10 bg-[#14110F]/50 text-[#C8BFA8]/30 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Left-to-Right Scroll Track — Exact 4 Compact Tiles on Desktop */}
      <div
        ref={trackRef}
        onScroll={syncScrollMetrics}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={`flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-2 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        role="region"
        aria-label="Signature dishes horizontal four-tile carousel"
      >
        {pages.map((group, pageIdx) => (
          <div
            key={`page-${pageIdx}`}
            data-menu-page
            className="w-full shrink-0 snap-start snap-always grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {group.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              const hasFailed = failedImages[item.id];

              return (
                <article
                  key={item.id}
                  className="group h-full bg-[#14110F] border border-[#F5EFE6]/12 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37]/45"
                >
                  <div>
                    {/* Compact 4:3 Culinary Frame */}
                    <div className="relative aspect-[4/3] w-full bg-[#1C1815] overflow-hidden">
                      {!hasFailed ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          draggable={false}
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

                    {/* Dish Title */}
                    <div className="px-4 sm:px-5 pt-4 pb-2">
                      <h3 className="font-serif-display text-lg sm:text-xl text-[#F5EFE6] font-normal leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  {/* Compact Price & Add to Order Footer */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-[#F5EFE6]/10 flex items-center justify-between gap-3">
                    <span className="font-mono-tabular text-base text-[#D4AF37] font-medium">
                      ₹{item.price}
                    </span>

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
        ))}
      </div>

      {/* Pagination Dots (Synced to 4-Tile Sets) */}
      <div className="flex items-center justify-center gap-2 mt-6" aria-label="Menu set pagination">
        {pages.map((_, idx) => {
          const isActive = idx === activePage;
          return (
            <button
              key={`dot-${idx}`}
              type="button"
              onClick={() => scrollToPage(idx)}
              aria-label={`View menu set ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-8 bg-[#D4AF37]'
                  : 'w-2 bg-[#F5EFE6]/25 hover:bg-[#F5EFE6]/50'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};
