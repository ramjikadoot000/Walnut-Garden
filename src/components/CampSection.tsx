import React, { useState } from 'react';
import { Tent, ArrowRight } from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from './StarText';
import { Reveal } from './Reveal';

interface CampSectionProps {
  selectedOptionId: string;
  onOpenBooking: (optionId: string) => void;
}

export const CampSection: React.FC<CampSectionProps> = ({
  selectedOptionId,
  onOpenBooking,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section
      id="camp"
      className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto border-b border-[#F5EFE6]/10"
    >
      <div id="process" className="absolute -top-16" aria-hidden="true" />
      {/* Section Heading */}
      <Reveal>
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-2">
            {siteContent.camp.kicker}
          </p>
          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal text-[#F5EFE6] tracking-tight [text-wrap:balance]">
            <StarText text={siteContent.camp.heading} />
          </h2>
        </div>
      </Reveal>

      {/* Tent & Evening-Camp Option Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {siteContent.camp.options.map((opt) => {
          const isSelected = opt.id === selectedOptionId;
          const hasFailed = failedImages[opt.id];

          return (
            <div
              key={opt.id}
              className={`group rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 bg-[#14110F] border ${
                isSelected
                  ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.12)]'
                  : 'border-[#F5EFE6]/10 hover:border-[#D4AF37]/40'
              }`}
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-[#1C1815] overflow-hidden">
                  {!hasFailed ? (
                    <img
                      src={opt.image}
                      alt={opt.name}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [opt.id]: true }))
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1C1815] p-6">
                      <Tent className="w-8 h-8 text-[#D4AF37]/60 mb-2" />
                      <span className="font-serif-display text-lg text-[#F5EFE6]">
                        {opt.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-[#14110F]/20 to-transparent" />

                  <div className="absolute bottom-3 left-5 right-5 flex items-baseline justify-between">
                    <span className="text-[10px] tracking-[0.22em] uppercase text-[#D4AF37]">
                      {opt.subtitle}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="font-serif-display text-2xl text-[#F5EFE6] font-normal">
                      {opt.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="font-mono-tabular text-xl text-[#D4AF37] font-medium">
                        ₹{opt.price}
                      </span>
                      <span className="text-[10px] tracking-[0.12em] uppercase text-[#C8BFA8]/70 ml-1">
                        /{opt.unit}
                      </span>
                    </div>
                  </div>

                  {opt.highlights && opt.highlights.length > 0 && (
                    <p className="text-xs text-[#C8BFA8]/80 font-light line-clamp-1">
                      {opt.highlights[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                <button
                  type="button"
                  onClick={() => onOpenBooking(opt.id)}
                  className={`w-full py-3.5 px-5 text-xs tracking-[0.22em] uppercase font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#0C0A09] hover:bg-[#e3be42]'
                      : 'bg-[#1C1815] text-[#F5EFE6] border border-[#F5EFE6]/15 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  <span>Choose & Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
