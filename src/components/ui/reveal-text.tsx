"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export interface RevealTextProps {
  text?: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
  letterImages?: string[];
  className?: string;
}

const DEFAULT_WALNUT_IMAGES = [
  "/assets/aistudio/Change_tree_to_dried_tree_a247d845_2K_6724f2bf.png",
  "/assets/aistudio/WhatsApp_Image_2026-11-24_at_8.05.17_PM_2faf1c54.jpeg",
  "/assets/aistudio/Prayer_Flags_Over_a_Mountain_Cottage_6dceeea4.png",
  "/assets/aistudio/Gemini_Generated_Image_fjx62qfjx62qfjx6_cdd48c70.png",
  "/assets/aistudio/WhatsApp_Image_2026-11-24_at_8.05.19_PM_c49a41b5.jpeg",
  "/assets/aistudio/WhatsApp_Image_2026-11-24_at_3.20.40_AM_a978fa96.jpeg",
  "/src/assets/images/sepu_badi_himachali_1795607023254.jpg",
  "/src/assets/images/kangri_dham_thali_1795607025442.jpg",
];

export function RevealText({
  text = "WALNUT GARDEN",
  textColor = "text-[#FDFBF7]",
  overlayColor = "text-[#D4AF37]",
  fontSize = "text-4xl sm:text-6xl md:text-8xl lg:text-[115px]",
  letterDelay = 0.06,
  overlayDelay = 0.04,
  overlayDuration = 0.45,
  springDuration = 550,
  letterImages = DEFAULT_WALNUT_IMAGES,
  className = "",
}: RevealTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showOverlayText, setShowOverlayText] = useState(false);

  useEffect(() => {
    setShowOverlayText(false);
    const lastLetterDelay = Math.max(0, text.length - 1) * letterDelay;
    const totalDelay = lastLetterDelay * 1000 + springDuration;

    const timer = setTimeout(() => {
      setShowOverlayText(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [text, letterDelay, springDuration]);

  return (
    <div className={`flex items-center relative ${className}`}>
      <div
        className="flex flex-nowrap items-center"
        style={{
          fontFamily: "'Syne', 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {text.split("").map((letter, index) => {
          const isSpace = letter === " ";
          const displayChar = isSpace ? "\u00A0" : letter;

          return (
            <motion.span
              key={`${letter}-${index}`}
              onMouseEnter={() => !isSpace && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onTouchStart={() => !isSpace && setHoveredIndex(index)}
              className={`${fontSize} font-extrabold uppercase tracking-[-0.03em] leading-[0.96] ${
                isSpace ? "w-[0.28em] pointer-events-none" : "cursor-pointer"
              } relative overflow-hidden select-none drop-shadow-[0_14px_38px_rgba(0,0,0,0.82)]`}
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: index * letterDelay,
                type: "spring",
                damping: 10,
                stiffness: 210,
                mass: 0.8,
              }}
            >
              {/* Base text layer */}
              <motion.span
                className={`absolute inset-0 ${textColor}`}
                animate={{
                  opacity: hoveredIndex === index ? 0 : 1,
                }}
                transition={{ duration: 0.12 }}
              >
                {displayChar}
              </motion.span>

              {/* Image text layer with background panning */}
              <motion.span
                className="text-transparent bg-clip-text bg-cover bg-no-repeat block"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  backgroundPosition:
                    hoveredIndex === index ? "15% center" : "0% center",
                }}
                transition={{
                  opacity: { duration: 0.12 },
                  backgroundPosition: {
                    duration: 2.6,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  backgroundImage: isSpace
                    ? undefined
                    : `url('${letterImages[index % letterImages.length]}')`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {displayChar}
              </motion.span>

              {/* Overlay text layer that sweeps across each letter */}
              {showOverlayText && !isSpace && (
                <motion.span
                  className={`absolute inset-0 ${overlayColor} pointer-events-none`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    delay: index * overlayDelay,
                    duration: overlayDuration,
                    times: [0, 0.15, 0.7, 1],
                    ease: "easeInOut",
                  }}
                >
                  {displayChar}
                </motion.span>
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

export default RevealText;
