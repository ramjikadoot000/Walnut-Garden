import React from 'react';
import { siteContent } from '../data/content.js';

export const MarqueeStrip: React.FC = () => {
  const words = siteContent.marqueeWords;
  // Duplicate array for seamless infinite loop
  const track = [...words, ...words, ...words];

  return (
    <section
      aria-label="Highlights strip"
      className="relative w-full bg-[#110E0C] border-y border-[#F5EFE6]/10 py-5 overflow-hidden select-none"
    >
      <div className="animate-marquee flex items-center">
        {track.map((word, index) => (
          <div key={index} className="flex items-center shrink-0">
            <span
              className={`px-6 sm:px-8 ${
                index % 2 === 1
                  ? 'font-editorial-italic italic text-3xl sm:text-4xl text-[#D4AF37] tracking-normal'
                  : 'font-display-syne text-xl sm:text-2xl uppercase tracking-[-0.03em] text-[#F5EFE6]/95'
              }`}
            >
              {word}
            </span>
            <span
              aria-hidden="true"
              className="text-xs tracking-[0.3em] text-[#D4AF37]/60"
            >
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
