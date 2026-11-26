import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteContent } from '../data/content.js';
import { RevealText } from './ui/reveal-text';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1650; // Crisp 1.65s branded intro with RevealText sweep

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 450);
        }, 200);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  const cleanIntroTitle = (siteContent.preloader.title || 'WALNUT GARDEN').replace(/\*/g, '');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#0C0A09] flex flex-col items-center justify-between px-6 py-10 select-none"
        >
          {/* Top coordinate line */}
          <div className="w-full max-w-6xl flex items-center justify-between text-[10px] tracking-[0.26em] uppercase text-[#C8BFA8]/60 border-b border-[#F5EFE6]/10 pb-4">
            <span>{siteContent.preloader.kicker}</span>
            <span className="font-mono-tabular">{siteContent.brand.tagline}</span>
          </div>

          {/* Center brand emblem */}
          <div className="flex flex-col items-center text-center max-w-4xl my-auto">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={siteContent.brand.logo}
              alt={`${siteContent.brand.name} Logo`}
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-contain bg-black p-1 border border-[#D4AF37]/30 mb-5 shadow-[0_0_32px_rgba(212,175,55,0.24)]"
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] tracking-[0.32em] uppercase text-[#D4AF37] mb-3"
            >
              {siteContent.brand.tagline}
            </motion.p>

            <div className="mb-6">
              <RevealText
                text={cleanIntroTitle}
                textColor="text-[#F5EFE6]"
                overlayColor="text-[#D4AF37]"
                fontSize="text-4xl sm:text-6xl md:text-7xl"
                letterDelay={0.04}
                overlayDelay={0.03}
                overlayDuration={0.35}
                springDuration={320}
              />
            </div>

            <div className="w-48 sm:w-64 h-[1px] bg-[#F5EFE6]/10 overflow-hidden mb-5">
              <motion.div
                className="h-full bg-[#D4AF37]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#C8BFA8]/80">
              {siteContent.preloader.subtitle}
            </p>
          </div>

          {/* Bottom progress counter */}
          <div className="w-full max-w-6xl flex items-center justify-between text-[11px] tracking-[0.22em] uppercase text-[#C8BFA8]/60 border-t border-[#F5EFE6]/10 pt-4">
            <span>LOADING FRAMES & KITCHEN</span>
            <span className="font-mono-tabular text-[#D4AF37]">{progress}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
