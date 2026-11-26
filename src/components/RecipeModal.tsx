import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Flame, Coffee, CheckCircle2, ArrowRight } from 'lucide-react';
import { siteContent } from '../data/content.js';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderNow: () => void;
}

const FIVE_INGREDIENTS = [
  {
    number: '01',
    name: 'Hand-Cracked Himalayan Walnuts',
    detail: 'Cold-pressed & lightly toasted in a cast-iron skillet for rich, buttery mountain oils.',
    amount: '45g · Shelled in Palampur',
  },
  {
    number: '02',
    name: 'First-Flush Kangra Valley CTC & Espresso Blend',
    detail: 'Slow-steeped at high altitude for a deep, malty backbone with zero bitterness.',
    amount: '60ml · Double Extraction',
  },
  {
    number: '03',
    name: 'Wild Dhauladhar Forest Honey',
    detail: 'Raw, unfiltered multifloral mountain honey gathered from upper Bundla orchards.',
    amount: '15ml · Golden Drizzle',
  },
  {
    number: '04',
    name: 'Crushed Green Cardamom & Ceylon Cinnamon',
    detail: 'Freshly mortar-ground pods that release warm aromatic oils into the steam.',
    amount: '3 Pods · Whole Spices',
  },
  {
    number: '05',
    name: 'Velvety Farm Milk & Pinch of Himalayan Pink Salt',
    detail: 'Micro-foamed to 65°C with a crystal of rock salt to elevate the roasted walnut notes.',
    amount: '180ml · Silky Pour',
  },
];

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  onOrderNow,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recipe-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#160C08] border border-[#FDFBF7]/15 text-[#FDFBF7] shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden my-auto"
          >
            {/* Top Banner */}
            <div className="relative p-6 sm:p-8 border-b border-[#FDFBF7]/12 bg-gradient-to-br from-[#24140E] to-[#160C08]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.26em] uppercase text-[#E87A5D] font-medium mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>OPEN-SOURCE ROASTERY FORMULA</span>
                  </span>
                  <h2
                    id="recipe-modal-title"
                    className="font-serif-display text-3xl sm:text-4xl text-[#FDFBF7] font-normal tracking-tight"
                  >
                    The 5-Ingredient <em className="italic text-[#FCD34D]">Walnut Brew</em> Recipe
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close recipe modal"
                  className="w-10 h-10 rounded-full bg-[#24140E] border border-[#FDFBF7]/15 flex items-center justify-center text-[#FDFBF7]/80 hover:bg-[#E87A5D] hover:text-[#FDFBF7] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#C8BFA8] font-light mt-2 leading-relaxed">
                Nothing artificial, zero syrups. Here is the exact 60-second mountain craft behind our signature cup at {siteContent.brand.name}.
              </p>
            </div>

            {/* 5 Ingredients List */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
              {FIVE_INGREDIENTS.map((item) => (
                <div
                  key={item.number}
                  className="p-4 rounded-2xl bg-[#24140E]/75 border border-[#FDFBF7]/10 flex items-start justify-between gap-4 hover:border-[#E87A5D]/50 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="font-mono-tabular text-xs font-semibold text-[#FCD34D] bg-[#160C08] border border-[#FCD34D]/30 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="font-serif-display text-xl text-[#FDFBF7] font-medium">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#C8BFA8]/85 font-light leading-relaxed mt-0.5">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono-tabular text-[11px] text-[#E87A5D] whitespace-nowrap shrink-0 pt-1">
                    {item.amount}
                  </span>
                </div>
              ))}

              {/* 60-Second Method Box */}
              <div className="p-4 rounded-2xl bg-[#1F110B] border border-[#E87A5D]/30 flex items-start gap-3">
                <Flame className="w-5 h-5 text-[#E87A5D] shrink-0 mt-0.5" />
                <div className="text-xs text-[#C8BFA8] leading-relaxed">
                  <span className="text-[#FDFBF7] font-medium uppercase tracking-[0.16em] block mb-1">
                    60-Second Roastery Method
                  </span>
                  Press the warm toasted walnut paste with double extraction brew, whisk in raw forest honey and crushed cardamom for 20 seconds, and pour micro-foamed farm milk over the top.
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 sm:px-8 py-4 border-t border-[#FDFBF7]/12 bg-[#120906] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#C8BFA8]">
                <CheckCircle2 className="w-4 h-4 text-[#E87A5D]" />
                <span>Freshly pressed to order at Palampur</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOrderNow();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#E87A5D] text-[#FDFBF7] text-xs tracking-[0.18em] uppercase font-medium hover:bg-[#d96a4d] transition-colors cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Order Pickup Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
