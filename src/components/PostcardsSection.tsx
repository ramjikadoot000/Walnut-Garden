import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mountain, Stamp } from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from './StarText';
import { Reveal } from './Reveal';

export const PostcardsSection: React.FC = () => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section
      id="postcards"
      className="relative py-28 sm:py-36 border-b border-[#F5EFE6]/10 overflow-visible"
    >
      <div id="ingredients" className="absolute -top-16" aria-hidden="true" />
      {/* Fixed/pinned night photo of the camp in the background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={siteContent.postcards.backgroundImage}
          alt="Starlit night bonfire at Walnut Cafe & Camp, Palampur"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09] via-[#0C0A09]/70 to-[#0C0A09]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3">
              {siteContent.postcards.kicker}
            </p>
            <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal text-[#F5EFE6] tracking-tight [text-wrap:balance]">
              <StarText text={siteContent.postcards.heading} />
            </h2>
          </div>
        </Reveal>

        {/* Stacking & Tilting Postcards Container */}
        <div className="space-y-16 sm:space-y-24 pb-12">
          {siteContent.postcards.cards.map((card, index) => {
            const topOffset = 96 + index * 24;
            const hasFailed = failedImages[card.id];

            return (
              <div
                key={card.id}
                style={{ top: `${topOffset}px` }}
                className="sticky transition-transform duration-300"
              >
                <motion.article
                  initial={{ opacity: 0, y: 36, rotate: 0 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: index === 0 ? -1.8 : index === 1 ? 1.6 : -1.1,
                  }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#181411] border border-[#D4AF37]/35 rounded-xl p-5 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.85)] relative overflow-hidden"
                >
                  {/* Subtle vintage airmail / postcard inner border */}
                  <div className="border border-[#F5EFE6]/10 rounded-lg p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Side: Postcard Photograph (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col justify-between">
                      <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-[#120F0D] border border-[#F5EFE6]/10">
                        {!hasFailed ? (
                          <img
                            src={card.image}
                            alt={card.caption}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [card.id]: true }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <Mountain className="w-8 h-8 text-[#D4AF37]/60 mb-2" />
                            <span className="font-serif-display text-lg text-[#F5EFE6]">
                              {card.caption}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181411]/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#F5EFE6]/90">
                          <span>{card.title}</span>
                          <span className="text-[#D4AF37]">{card.caption}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Stamp & Concise Handwritten-style Message (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col justify-between lg:border-l border-[#F5EFE6]/15 lg:pl-7">
                      {/* Top row: Circular Postmark + Perforated Stamp */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="w-14 h-14 rounded-full border border-dashed border-[#D4AF37]/70 flex flex-col items-center justify-center text-center p-1 -rotate-6 shrink-0">
                          <span className="text-[7px] tracking-[0.16em] uppercase text-[#D4AF37] leading-tight font-medium">
                            PALAMPUR
                          </span>
                          <span className="w-7 h-[0.5px] bg-[#D4AF37]/50 my-0.5" />
                          <span className="text-[6px] tracking-[0.14em] uppercase text-[#C8BFA8]">
                            1,450M
                          </span>
                        </div>

                        <div className="w-16 h-20 bg-[#120F0D] border-2 border-dotted border-[#D4AF37]/60 p-1.5 flex flex-col items-center justify-center gap-1.5 text-center shrink-0">
                          <Mountain className="w-5 h-5 text-[#D4AF37]" />
                          <span className="font-mono-tabular text-[8px] tracking-[0.14em] text-[#D4AF37]">
                            {card.stampCode}
                          </span>
                        </div>
                      </div>

                      {/* Warm Message */}
                      <blockquote className="font-serif-display italic text-xl sm:text-2xl text-[#F5EFE6] leading-snug mb-5 line-clamp-3">
                        “<StarText text={card.message} />”
                      </blockquote>

                      {/* Address line */}
                      <div className="pt-3 border-t border-[#F5EFE6]/10 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[#C8BFA8]">
                        <span>{siteContent.postcards.fromLabel}</span>
                        <span className="text-[#D4AF37] font-medium">
                          {siteContent.postcards.toLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
