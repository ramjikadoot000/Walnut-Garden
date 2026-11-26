import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Flame,
  Gamepad2,
  Music,
  ArrowRight,
  X,
  CalendarClock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from './StarText';
import { Reveal } from './Reveal';
import { Scroll01, Scroll01Item } from './ui/scroll-01';

const ACTIVITY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'activity-trekking': Compass,
  'activity-bonfire': Flame,
  'activity-games': Gamepad2,
  'activity-music': Music,
};

interface ActivitiesSectionProps {
  embedded?: boolean;
  onSelectActivity?: (activityTitle: string) => void;
  onOpenCampBooking?: (optionId?: string) => void;
}

const ACTIVITY_TO_CAMP_OPTION: Record<string, string> = {
  'activity-trekking': 'alpine-dome-stay',
  'activity-bonfire': 'evening-bonfire-circle',
  'activity-games': 'day-picnic-meadow',
  'activity-music': 'evening-bonfire-circle',
};

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  embedded = false,
  onSelectActivity,
  onOpenCampBooking,
}) => {
  const { activities } = siteContent;
  const acoustic = activities.acousticSessions;
  const [isAcousticModalOpen, setIsAcousticModalOpen] = useState(false);

  // Escape key & scroll lock for Live Acoustic Sessions modal
  useEffect(() => {
    if (!isAcousticModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAcousticModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isAcousticModalOpen]);

  const scrollItems: Scroll01Item[] = activities.items.map((item) => ({
    id: item.id,
    number: item.number,
    category: item.category,
    title: item.title,
    description: item.description,
    media: item.image,
    highlights: item.highlights,
    ctaLabel: item.ctaLabel,
    secondaryLabel: item.id === 'activity-music' ? 'Session Details' : undefined,
    icon: ACTIVITY_ICONS[item.id] || Compass,
  }));

  const handlePrimaryAction = (scrollItem: Scroll01Item, index: number) => {
    const sourceItem = activities.items[index];
    if (!sourceItem) return;
    onSelectActivity?.(sourceItem.title);
    if (sourceItem.ctaHref === '#camp-book' && onOpenCampBooking) {
      onOpenCampBooking(ACTIVITY_TO_CAMP_OPTION[sourceItem.id]);
      return;
    }
    const targetId = sourceItem.ctaHref.replace('#', '');
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="activities"
      className={
        embedded
          ? 'pt-14 mt-14 border-t border-[#F5EFE6]/10 mb-24'
          : 'relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto border-b border-[#F5EFE6]/10'
      }
    >
      {/* Section Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-2">
              02 · {activities.kicker}
            </p>
            <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal text-[#F5EFE6] tracking-tight [text-wrap:balance]">
              <StarText text={activities.heading} />
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsAcousticModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium bg-[#14110F] border border-[#D4AF37]/50 text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-[#0C0A09] transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Live Acoustic Sessions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </Reveal>

      {/* Scroll-01 Sticky Split Showcase for Activities */}
      <Scroll01
        items={scrollItems}
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={() => setIsAcousticModalOpen(true)}
      />

      {/* Live Acoustic Sessions Custom Modal */}
      <AnimatePresence>
        {isAcousticModalOpen && acoustic && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="acoustic-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAcousticModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-2xl rounded-2xl bg-[#14110F] border border-[#D4AF37]/35 text-[#F5EFE6] shadow-[0_28px_90px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              {/* Top Visual Header */}
              <div className="relative p-6 sm:p-8 border-b border-[#F5EFE6]/10 bg-gradient-to-br from-[#1C1612] to-[#120F0D]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.26em] uppercase text-[#D4AF37] mb-2">
                      <Music className="w-3.5 h-3.5" />
                      <span>{acoustic.kicker}</span>
                    </span>
                    <h3
                      id="acoustic-modal-title"
                      className="font-serif-display text-3xl sm:text-4xl text-[#F5EFE6] font-normal tracking-tight"
                    >
                      <StarText text={acoustic.title} />
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAcousticModalOpen(false)}
                    aria-label="Close Live Acoustic Sessions modal"
                    className="w-10 h-10 rounded-full bg-[#1C1815] border border-[#F5EFE6]/15 flex items-center justify-center text-[#C8BFA8] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[#C8BFA8] font-light mt-2 leading-relaxed">
                  {acoustic.subtitle}
                </p>

                {/* Schedule / Setting / Sounds Info Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#F5EFE6]/10">
                  {acoustic.schedule.map((entry, idx) => {
                    const MetaIcon =
                      idx === 0 ? CalendarClock : idx === 1 ? MapPin : Sparkles;
                    return (
                      <div key={entry.label} className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-[#D4AF37]">
                          <MetaIcon className="w-3 h-3" />
                          <span>{entry.label}</span>
                        </span>
                        <p className="text-xs text-[#F5EFE6]/90 font-light">
                          {entry.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evening Program Highlights */}
              <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
                {acoustic.program.map((part) => (
                  <div
                    key={part.number}
                    className="p-4 rounded-xl bg-[#1A1613] border border-[#F5EFE6]/10 flex items-start gap-4 hover:border-[#D4AF37]/40 transition-colors"
                  >
                    <span className="font-mono-tabular text-xs font-semibold text-[#D4AF37] bg-[#0C0A09] border border-[#D4AF37]/30 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
                      {part.number}
                    </span>
                    <div>
                      <h4 className="font-serif-display text-xl text-[#F5EFE6] font-normal">
                        {part.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#C8BFA8]/85 font-light leading-relaxed mt-1">
                        {part.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer CTA */}
              <div className="px-6 sm:px-8 py-4 border-t border-[#F5EFE6]/10 bg-[#100D0B] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#C8BFA8]/80 font-light">
                  {acoustic.footnote}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsAcousticModalOpen(false);
                    onOpenCampBooking?.('evening-bonfire-circle');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#D4AF37] text-[#0C0A09] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#e3be42] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{acoustic.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
