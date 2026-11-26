import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from './StarText';
import { RevealText } from './ui/reveal-text';

const TOTAL_FRAMES = siteContent.hero.totalFrames || 165;

interface ScrollHeroProps {
  onOpenCampBooking?: () => void;
}

export const ScrollHero: React.FC<ScrollHeroProps> = ({ onOpenCampBooking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Refs for animation loop and loaded images
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const seqFramesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const keyframesRef = useRef<HTMLImageElement[]>([]);
  const usingExternalSeqRef = useRef(false);

  // Detect landscape vs portrait viewport for separate frame sets
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (canvasRef.current) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload keyframe anchor images for the 165-frame synthesized canvas walk-in
  useEffect(() => {
    const anchors = isMobile
      ? siteContent.hero.keyframeAnchors.portrait
      : siteContent.hero.keyframeAnchors.landscape;

    const loadedAnchors: HTMLImageElement[] = [];
    anchors.forEach((src, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => {
        loadedAnchors[idx] = img;
        keyframesRef.current = loadedAnchors;
      };
    });
  }, [isMobile]);

  // Helper to draw an image with cover + zoom forward dolly movement
  const drawCoverZoom = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cw: number,
    ch: number,
    zoom: number,
    alpha: number,
    panY: number = 0
  ) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih) * zoom;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2 + panY * ch;

    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  };

  // Scroll listener + requestAnimationFrame canvas renderer
  useEffect(() => {
    let rafId: number;

    const updateScrollTarget = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const raw = -rect.top / scrollable;
      targetProgressRef.current = Math.max(0, Math.min(1, raw));
    };

    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    updateScrollTarget();

    const renderLoop = () => {
      // Smooth lerp toward target scroll progress
      const current = progressRef.current;
      const target = targetProgressRef.current;
      const next = current + (target - current) * 0.14;
      progressRef.current = Math.abs(target - next) < 0.0005 ? target : next;

      const p = progressRef.current;
      const frameIndex = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(p * (TOTAL_FRAMES - 1)) + 1)
      );

      setScrollProgress(p);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const cw = canvas.width;
          const ch = canvas.height;

          ctx.fillStyle = '#0C0A09';
          ctx.fillRect(0, 0, cw, ch);

          const externalImg = seqFramesRef.current[frameIndex - 1];
          if (usingExternalSeqRef.current && externalImg && externalImg.complete && externalImg.naturalWidth > 0) {
            // Render exact preloaded .webp frame
            drawCoverZoom(ctx, externalImg, cw, ch, 1.0, 1.0, 0);
          } else {
            // Synthesize 165-frame forward camera walk from outside cottage (1st hero image) -> through front door -> warm wooden interior with hanging lights (2nd hero image)
            const anchors = keyframesRef.current;
            const stage1 = anchors[0]; // 1st Hero Image: Outside cottage
            const stage2 = anchors[1]; // 2nd Hero Image: Warm wooden interior with hanging Edison lights

            if (stage1) {
              // Forward dolly into the open front door of the cottage
              if (p <= 0.45) {
                const localP = p / 0.45; // 0 -> 1
                const zoom = 1.0 + localP * 0.55; // 1.0x -> 1.55x moving straight toward front door
                drawCoverZoom(ctx, stage1, cw, ch, zoom, 1.0, localP * 0.02);
              } else {
                const localP = (p - 0.45) / 0.55; // 0 -> 1
                const crossfade = Math.min(1, localP * 2.2);
                // Cross-dissolve from exterior threshold into 2nd Hero Image (Warm wooden interior with hanging lights)
                if (crossfade < 1) {
                  const zoomOutStage1 = 1.55 + localP * 0.35;
                  drawCoverZoom(ctx, stage1, cw, ch, zoomOutStage1, 1 - crossfade, 0.02);
                }
                const secondHeroImg = stage2 || stage1;
                const zoomInSecondHero = 1.0 + localP * 0.25;
                drawCoverZoom(ctx, secondHeroImg, cw, ch, zoomInSecondHero, crossfade, 0);
              }

              // Subtle wooden doorway frame vignette as camera passes through the open front door (frames 60 to 115)
              if (p > 0.32 && p < 0.75) {
                const doorPhase = 1 - Math.abs(p - 0.53) / 0.22;
                if (doorPhase > 0) {
                  const frameWidth = cw * 0.08 * doorPhase;
                  ctx.save();
                  ctx.fillStyle = `rgba(22, 14, 9, ${0.55 * doorPhase})`;
                  ctx.fillRect(0, 0, frameWidth, ch);
                  ctx.fillRect(cw - frameWidth, 0, frameWidth, ch);
                  ctx.restore();
                }
              }
            }
          }

          // Warm dark luxury scrim for typographic contrast
          const grad = ctx.createLinearGradient(0, 0, 0, ch);
          grad.addColorStop(0, 'rgba(12, 10, 9, 0.65)');
          grad.addColorStop(0.45, 'rgba(12, 10, 9, 0.38)');
          grad.addColorStop(1, 'rgba(12, 10, 9, 0.85)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, cw, ch);
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => {
      window.removeEventListener('scroll', updateScrollTarget);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 1. Opening Title & Tagline (0.00 -> 0.22): Fades out as user starts scrolling down
  const fadeOutProgress = Math.min(1, Math.max(0, scrollProgress / 0.22));
  const heroTextOpacity = Math.max(0, 1 - fadeOutProgress);
  const heroTextTranslateY = -fadeOutProgress * 38;
  const heroTextScale = 1 - fadeOutProgress * 0.04;

  // 2. Finale Cafe Vibe Text (0.76 -> 1.00): Appears at the end when scroll interaction arrives inside the warm cafe
  const finaleProgress = Math.min(1, Math.max(0, (scrollProgress - 0.76) / 0.16));
  const finaleOpacity = finaleProgress;
  const finaleTranslateY = (1 - finaleProgress) * 28;
  const finaleScale = 0.96 + finaleProgress * 0.04;

  const scrollToSection = (hash: string) => {
    if (hash === '#camp-book' && onOpenCampBooking) {
      onOpenCampBooking();
      return;
    }
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-[520vh] bg-[#0C0A09]"
      aria-label="Opening scroll story"
    >
      {/* Sticky full-screen pinned canvas */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Hero Overlays Container */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 text-center w-full h-full flex items-center justify-center pointer-events-none">
          {/* Opening Staggered Two-Line Title & Tagline (Matches Reference Image: WALNUT top-left, GARDEN bottom-right) */}
          <div
            style={{
              opacity: heroTextOpacity,
              transform: `translate3d(0, ${heroTextTranslateY}px, 0) scale(${heroTextScale})`,
              pointerEvents: heroTextOpacity > 0.35 ? 'auto' : 'none',
            }}
            className="absolute inset-x-4 sm:inset-x-8 flex flex-col items-center justify-center select-none transition-none"
          >
            <div className="w-full max-w-4xl mx-auto flex flex-col">
              {/* Line 1: WALNUT (shifted left as in reference image) */}
              <div className="self-start pl-2 sm:pl-10 md:pl-16">
                <RevealText
                  text={siteContent.hero.openingTitleLine1 || 'WALNUT'}
                  textColor="text-[#FDFBF7]"
                  overlayColor="text-[#D4AF37]"
                  fontSize="text-5xl sm:text-7xl md:text-8xl lg:text-[116px]"
                  letterDelay={0.06}
                  overlayDelay={0.04}
                  overlayDuration={0.45}
                  springDuration={500}
                />
              </div>

              {/* Line 2: GARDEN (shifted right below WALNUT as in reference image) */}
              <div className="self-end pr-2 sm:pr-6 md:pr-10 mt-2 sm:mt-4">
                <RevealText
                  text={siteContent.hero.openingTitleLine2 || 'GARDEN'}
                  textColor="text-[#FDFBF7]"
                  overlayColor="text-[#D4AF37]"
                  fontSize="text-5xl sm:text-7xl md:text-8xl lg:text-[116px]"
                  letterDelay={0.07}
                  overlayDelay={0.045}
                  overlayDuration={0.45}
                  springDuration={560}
                />
              </div>
            </div>

            <div className="mt-6 sm:mt-8 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0C0A09]/60 backdrop-blur-md border border-[#D4AF37]/40 shadow-[0_10px_28px_rgba(0,0,0,0.75)]">
              <span className="text-[#D4AF37] text-xs">✦</span>
              <p className="text-xs sm:text-base md:text-lg font-semibold uppercase tracking-[0.38em] text-[#F5EFE6]">
                {siteContent.hero.openingTagline || siteContent.brand.tagline || 'Cafe & Camp'}
              </p>
              <span className="text-[#D4AF37] text-xs">✦</span>
            </div>
          </div>

          {/* Finale Cafe-Vibe Text (Appears at the end when scroll interaction finishes inside the warm wooden cafe) */}
          <div
            style={{
              opacity: finaleOpacity,
              transform: `translate3d(0, ${finaleTranslateY}px, 0) scale(${finaleScale})`,
              pointerEvents: finaleOpacity > 0.45 ? 'auto' : 'none',
            }}
            className="absolute inset-x-6 max-w-4xl mx-auto flex flex-col items-center justify-center text-center select-none transition-none"
          >
            <span className="font-mono-tabular text-[10px] sm:text-xs tracking-[0.34em] uppercase text-[#D4AF37] mb-3 drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)]">
              {siteContent.hero.finaleKicker || 'WELCOME INSIDE · PALAMPUR · 1,850M'}
            </span>

            <div className="w-12 h-[1px] bg-[#D4AF37]/60 mb-5" />

            <h2
              style={{
                fontSize: 'clamp(2.5rem, 7.2vw, 6.2rem)',
              }}
              className="font-serif-display font-extrabold tracking-[-0.03em] text-[#FDFBF7] leading-[1.02] mb-4 drop-shadow-[0_12px_36px_rgba(0,0,0,0.85)] [text-wrap:balance]"
            >
              <StarText text={siteContent.hero.finaleHeading || 'Good Food, *Good Mood*'} />
            </h2>

            <p className="text-[11px] sm:text-sm md:text-base tracking-[0.26em] uppercase text-[#F5EFE6]/90 font-medium mb-8 drop-shadow-[0_6px_18px_rgba(0,0,0,0.85)]">
              {siteContent.hero.finaleSubtext || 'Steaming Chai · Himachali Kitchen · Starlit Bonfires'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('#bestsellers')}
                className="px-6 py-3 text-xs tracking-[0.22em] uppercase font-semibold bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer whitespace-nowrap shadow-[0_10px_28px_rgba(0,0,0,0.6)]"
              >
                {siteContent.hero.finalePrimaryCtaLabel || 'Explore Menu'}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('#camp-book')}
                className="px-6 py-3 text-xs tracking-[0.22em] uppercase font-medium border border-[#F5EFE6]/35 text-[#F5EFE6] rounded hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap bg-[#0C0A09]/55 backdrop-blur-md"
              >
                {siteContent.hero.finaleSecondaryCtaLabel || 'Book Tent & Bonfire'}
              </button>
            </div>
          </div>
        </div>

        {/* Minimal bottom scroll progress bar */}
        <div className="absolute bottom-7 inset-x-5 sm:inset-x-8 z-20 flex items-center justify-center gap-4">
          <ArrowDown className="w-3.5 h-3.5 text-[#D4AF37]" />
          <div className="w-36 sm:w-48 h-[1px] bg-[#F5EFE6]/15 overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-none"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
