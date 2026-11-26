import React, { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from '../components/StarText';

export const GalleryPage: React.FC = () => {
  const gallery = siteContent.pages.gallery;
  const categories = ['All', 'The Cottage', 'Interiors', 'Camping', 'Lawn & Games', 'Bonfire'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<typeof gallery.items[0] | null>(null);

  const filtered = gallery.items.filter((item) =>
    activeCategory === 'All' ? true : item.category === activeCategory
  );

  return (
    <main className="pt-28 pb-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3">
            {gallery.kicker}
          </p>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-normal text-[#F5EFE6] tracking-tight">
            <StarText text={gallery.heading} />
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[#C8BFA8] max-w-md font-light leading-relaxed">
          {gallery.subtext}
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-[#F5EFE6]/10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs tracking-[0.18em] uppercase rounded transition-colors cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#D4AF37] text-[#0C0A09] font-medium'
                : 'bg-[#14110F] text-[#C8BFA8] border border-[#F5EFE6]/10 hover:text-[#F5EFE6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="break-inside-avoid group relative rounded-xl overflow-hidden bg-[#14110F] border border-[#F5EFE6]/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
              <div>
                <span className="text-[10px] tracking-[0.22em] uppercase text-[#D4AF37] block mb-0.5">
                  {item.category}
                </span>
                <h2 className="font-serif-display text-xl text-[#F5EFE6]">
                  {item.title}
                </h2>
              </div>
              <span className="p-2 rounded-full bg-[#0C0A09]/60 border border-[#F5EFE6]/20 text-[#F5EFE6] group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-[#14110F] border border-[#F5EFE6]/15 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              aria-label="Close image preview"
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#0C0A09]/80 text-[#F5EFE6] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxItem.image}
              alt={lightboxItem.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[78vh] object-contain bg-[#0C0A09]"
            />
            <div className="p-5 flex items-center justify-between border-t border-[#F5EFE6]/10">
              <div>
                <span className="text-[10px] tracking-[0.22em] uppercase text-[#D4AF37] block">
                  {lightboxItem.category}
                </span>
                <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                  {lightboxItem.title}
                </h3>
              </div>
              <span className="text-xs tracking-[0.18em] uppercase text-[#C8BFA8]/60">
                {siteContent.brand.locationShort}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
