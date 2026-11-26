import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-md flex justify-center">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-lg bg-[#14110F]/95 border border-[#D4AF37]/40 text-[#F5EFE6] shadow-2xl backdrop-blur-md"
          >
            <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Check className="w-3 h-3" />
            </span>
            <p className="text-xs sm:text-sm tracking-wide text-[#F5EFE6] font-normal">
              {toast.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
