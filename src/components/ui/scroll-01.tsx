"use client";

import React, {
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import { ArrowRight, Compass, Music } from "lucide-react";

export type Scroll01Item = {
  id?: string;
  number?: string;
  category?: string;
  title: string;
  description: string;
  media: string;
  highlights?: string[];
  ctaLabel?: string;
  secondaryLabel?: string;
  icon?: React.FC<{ className?: string }>;
};

export interface Scroll01Props {
  items: Scroll01Item[];
  onPrimaryAction?: (item: Scroll01Item, index: number) => void;
  onSecondaryAction?: (item: Scroll01Item, index: number) => void;
}

function ScrollItem({
  item,
  index,
  isCurrentActive,
  setActive,
  onPrimaryAction,
  onSecondaryAction,
}: {
  item: Scroll01Item;
  index: number;
  isCurrentActive: boolean;
  setActive: Dispatch<SetStateAction<number>>;
  onPrimaryAction?: (item: Scroll01Item, index: number) => void;
  onSecondaryAction?: (item: Scroll01Item, index: number) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 12%"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [28, 0, -28]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0.95, 1, 1, 0.95]
  );

  const opacityValues = index === 0 ? [1, 0.9, 1, 0.2] : [0.2, 0.9, 1, 0.2];
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.26, 0.74, 1],
    opacityValues
  );

  const isActive = useTransform(scrollYProgress, (v) => v > 0.32 && v < 0.68);

  useMotionValueEvent(isActive, "change", (v) => {
    if (v) {
      setActive((prev) => (prev === index ? prev : index));
    }
  });

  const IconComponent = item.icon || Compass;

  return (
    <motion.article
      ref={ref}
      style={{ opacity, y, scale }}
      onMouseEnter={() => setActive(index)}
      onTouchStart={() => setActive(index)}
      whileHover={{
        scale: 1.03,
        boxShadow:
          "0 24px 54px rgba(0, 0, 0, 0.82), 0 0 32px rgba(212, 175, 55, 0.22)",
        borderColor: "rgba(212, 175, 55, 0.75)",
      }}
      whileTap={{
        scale: 1.02,
        boxShadow:
          "0 20px 44px rgba(0, 0, 0, 0.82), 0 0 28px rgba(212, 175, 55, 0.22)",
        borderColor: "rgba(212, 175, 55, 0.75)",
      }}
      transition={{ duration: 0.25 }}
      className={`relative flex flex-col items-start text-left p-3.5 sm:p-5 md:p-7 rounded-xl md:rounded-2xl bg-[#14110F]/95 backdrop-blur-md border transition-colors duration-300 ${
        isCurrentActive
          ? "border-[#D4AF37]/75 shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_24px_rgba(212,175,55,0.16)]"
          : "border-[#F5EFE6]/12"
      }`}
    >
      <div className="w-full flex items-center justify-between gap-2 mb-2.5 md:mb-3">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2.5">
          {item.number && (
            <span className="font-mono-tabular text-[10px] md:text-xs tracking-[0.18em] md:tracking-[0.22em] text-[#D4AF37] bg-[#0C0A09] px-1.5 md:px-2.5 py-0.5 md:py-1 rounded border border-[#D4AF37]/30">
              {item.number}
            </span>
          )}
          {item.category && (
            <span className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.16em] md:tracking-[0.22em] uppercase text-[#D4AF37]">
              {item.category}
            </span>
          )}
        </div>

        <span
          className={`w-7 h-7 md:w-9 md:h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
            isCurrentActive
              ? "bg-[#D4AF37] text-[#0C0A09] border-[#D4AF37]"
              : "bg-[#0C0A09] text-[#D4AF37] border-[#D4AF37]/40"
          }`}
        >
          <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </span>
      </div>

      <h3 className="font-serif-display text-lg sm:text-2xl lg:text-4xl font-normal text-[#F5EFE6] leading-snug mb-2 md:mb-3">
        {item.title}
      </h3>

      {item.highlights && item.highlights.length > 0 && (
        <div className="w-full flex flex-wrap items-center gap-y-1 text-[10px] sm:text-xs text-[#C8BFA8] pt-2.5 md:pt-3 pb-3 md:pb-4 border-t border-[#F5EFE6]/10">
          {item.highlights.map((hl, hlIdx) => (
            <React.Fragment key={hl}>
              <span>{hl}</span>
              {hlIdx < item.highlights!.length - 1 && (
                <span aria-hidden="true" className="mx-1.5 md:mx-2 text-[#D4AF37]">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {(item.ctaLabel || item.secondaryLabel) && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 md:gap-3 pt-1">
          {item.ctaLabel && (
            <button
              type="button"
              onClick={() => onPrimaryAction?.(item, index)}
              className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 sm:px-3.5 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs tracking-[0.16em] md:tracking-[0.2em] uppercase font-medium bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{item.ctaLabel}</span>
              <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          )}

          {item.secondaryLabel && (
            <button
              type="button"
              onClick={() => onSecondaryAction?.(item, index)}
              className="inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs tracking-[0.14em] md:tracking-[0.18em] uppercase text-[#C8BFA8] hover:text-[#D4AF37] underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Music className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#D4AF37]" />
              <span>{item.secondaryLabel}</span>
            </button>
          )}
        </div>
      )}
    </motion.article>
  );
}

export function Scroll01({
  items,
  onPrimaryAction,
  onSecondaryAction,
}: Readonly<Scroll01Props>) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  return (
    <div className="relative">
      {/* 2-Column Split (Left to Right: Sticky Picture on Left, Scrolling Texts on Right) */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:gap-10 items-start">
        {/* Sticky Crossfading Visual Showcase — Left Side */}
        <div className="sticky top-20 md:top-24 z-20 h-[48vh] sm:h-[58vh] md:h-[68vh] min-h-[260px] md:min-h-[420px] max-h-[620px] overflow-hidden rounded-xl md:rounded-2xl border border-[#D4AF37]/35 bg-[#14110F] shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
          {items.map((item, index) => {
            const IconComponent = item.icon || Compass;
            const hasFailed = failedImages[index];
            const isCurrent = activeIndex === index;

            return (
              <motion.div
                key={`${item.title}-${index}`}
                className="absolute inset-0 h-full w-full"
                initial={{ opacity: index === 0 ? 1 : 0 }}
                animate={{
                  opacity: isCurrent ? 1 : 0,
                  scale: isCurrent ? 1 : 1.05,
                  willChange: "opacity, transform",
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {!hasFailed ? (
                  <img
                    src={item.media}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [index]: true }))
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-[#1C1815]">
                    <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37]/50" />
                  </div>
                )}

                {/* Measured Dark Gradient Scrim & Caption Bar */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/25 to-transparent" />

                <div className="absolute bottom-3 sm:bottom-5 md:bottom-6 left-3 sm:left-5 md:left-6 right-3 sm:right-5 md:right-6 flex items-end justify-between gap-2 md:gap-4">
                  <div className="min-w-0">
                    {item.category && (
                      <p className="text-[8px] sm:text-[10px] tracking-[0.2em] md:tracking-[0.24em] uppercase text-[#D4AF37] mb-0.5 truncate">
                        {item.category}
                      </p>
                    )}
                    <p className="font-serif-display text-sm sm:text-xl md:text-2xl lg:text-3xl text-[#F5EFE6] leading-tight line-clamp-1">
                      {item.title}
                    </p>
                  </div>

                  <span className="font-mono-tabular text-[9px] sm:text-xs tracking-[0.18em] md:tracking-[0.22em] text-[#D4AF37] bg-[#0C0A09]/80 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#F5EFE6]/15 shrink-0">
                    {item.number || `0${index + 1}`} / 0{items.length}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll-Animated Text Cards — Right Side */}
        <div className="relative py-[6vh] md:py-[12vh]">
          <div className="relative space-y-[14vh] md:space-y-[18vh]">
            {items.map((item, index) => (
              <ScrollItem
                key={`${item.title}-${index}`}
                item={item}
                index={index}
                isCurrentActive={activeIndex === index}
                setActive={setActiveIndex}
                onPrimaryAction={onPrimaryAction}
                onSecondaryAction={onSecondaryAction}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scroll01;
