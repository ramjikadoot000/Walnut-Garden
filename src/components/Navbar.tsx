import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { siteContent } from '../data/content.js';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenRecipeModal?: () => void;
}

interface NavOverlayItem {
  index: string;
  label: string;
  href: string;
  fallbackTargetId: string;
  tagline: string;
  previewImage: string;
}

const OVERLAY_NAV_ITEMS: NavOverlayItem[] = [
  {
    index: '01',
    label: 'HOME',
    href: '#home',
    fallbackTargetId: 'home',
    tagline: 'Crack it up · Signature hero',
    previewImage: '/assets/aistudio/made_the_time_to_night_34850f7f_2K_63170625.png',
  },
  {
    index: '02',
    label: 'MENU',
    href: '#menu',
    fallbackTargetId: 'bestsellers',
    tagline: 'Six cold-pressed walnut brews',
    previewImage: '/src/assets/images/himalayan_masala_chai_1795578017697.jpg',
  },
  {
    index: '03',
    label: 'PROCESS',
    href: '#process',
    fallbackTargetId: 'camp',
    tagline: 'Bean to cup in 60 seconds',
    previewImage: '/assets/aistudio/WhatsApp_Image_2026-11-24_at_8.05.19_PM_c49a41b5.jpeg',
  },
  {
    index: '04',
    label: 'GALLERY',
    href: '#ingredients',
    fallbackTargetId: 'postcards',
    tagline: "What's inside · Roastery gallery",
    previewImage: '/assets/aistudio/WhatsApp_Image_2026-11-24_at_8.05.17_PM_2faf1c54.jpeg',
  },
  {
    index: '05',
    label: 'VISIT',
    href: '#visit',
    fallbackTargetId: 'visit',
    tagline: '742 Burnside Ave · Daily 7am–7pm',
    previewImage: '/assets/aistudio/Gemini_Generated_Image_fjx62qfjx62qfjx6_cdd48c70.png',
  },
];

const LIGHT_SECTIONS = ['menu', 'process', 'ingredients'];
const DARK_SECTIONS = ['home', 'wipe', 'visit'];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenRecipeModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [isOverLightSection, setIsOverLightSection] = useState(false);
  const [isAtHeroTop, setIsAtHeroTop] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const location = useLocation();
  const navigate = useNavigate();

  // Body scroll lock & Escape key listener when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Automatic Scroll Contrast Adaptation against light sections (#menu, #process, #ingredients)
  // vs dark sections (#home, #wipe, #visit) + active section index tracking
  useEffect(() => {
    const handleScroll = () => {
      const probeY = 42; // Top-left brand mark vertical center
      setIsAtHeroTop(location.pathname === '/' && window.scrollY <= 80);

      let detectedLight = false;
      for (const id of LIGHT_SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= probeY && rect.bottom >= probeY) {
            if (el.dataset.theme === 'light' || el.classList.contains('light-section')) {
              detectedLight = true;
            }
          }
        }
      }
      for (const id of DARK_SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= probeY && rect.bottom >= probeY) {
            detectedLight = false;
          }
        }
      }
      setIsOverLightSection(detectedLight);

      // Update active section counter (01 to 05)
      const viewportCenter = window.innerHeight * 0.35;
      OVERLAY_NAV_ITEMS.forEach((item, idx) => {
        const primaryId = item.href.replace('#', '');
        const el =
          document.getElementById(primaryId) ||
          document.getElementById(item.fallbackTargetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            setActiveSectionIdx(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Mouse parallax handler for the atmospheric glow blobs inside the overlay
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const normY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
    setMouseOffset({ x: normX * 28, y: normY * 28 });
  }, []);

  const scrollToTarget = (item: NavOverlayItem, idx: number) => {
    setIsOpen(false);
    setActiveSectionIdx(idx);

    const primaryId = item.href.replace('#', '');
    const performScroll = () => {
      const targetEl =
        document.getElementById(primaryId) ||
        document.getElementById(item.fallbackTargetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else if (primaryId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(performScroll, 140);
    } else {
      performScroll();
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activePreview = OVERLAY_NAV_ITEMS[hoveredIdx] || OVERLAY_NAV_ITEMS[0];
  const brandTextColorClass =
    isOpen || !isOverLightSection ? 'text-[#FDFBF7]' : 'text-[#24140E]';

  const handleNavHref = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      e.preventDefault();
      const hash = href.slice(1); // '#bestsellers' or '#camp-book'
      if (location.pathname !== '/') {
        navigate('/' + hash);
      } else if (hash === '#camp-book') {
        navigate('/#camp-book');
      } else {
        const targetId = hash.replace('#', '');
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const showRibbon = isAtHeroTop && !isOpen;

  return (
    <>
      {/* =====================================================================
          1. TRANSLUCENT TOP RIBBON (Only visible at top of Home / Hero section;
             slides up on scroll down leaving only Logo & Menu Icon visible)
          ===================================================================== */}

      {/* 1A. Translucent Ribbon Bar (slides up when user scrolls down) */}
      <header
        aria-hidden={!showRibbon}
        className={`fixed top-0 inset-x-0 z-[47] h-16 sm:h-20 bg-[#0C0A09]/65 backdrop-blur-md border-b border-[#F5EFE6]/12 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showRibbon
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between gap-6">
          {/* Left spacer matching logo width + Brand Wordmark inside ribbon */}
          <div className="flex items-center gap-3 pl-12 sm:pl-14">
            <div className="flex flex-col">
              <span
                className={`font-serif-display text-lg sm:text-xl font-semibold tracking-wider leading-none transition-colors duration-300 whitespace-nowrap ${brandTextColorClass}`}
              >
                {siteContent.brand.name}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#D4AF37] mt-1 whitespace-nowrap">
                {siteContent.brand.tagline}
              </span>
            </div>
          </div>

          {/* Center Desktop Navigation Links */}
          <nav
            aria-label="Top Ribbon Navigation"
            className="hidden lg:flex items-center gap-7"
          >
            <a
              href="/#activities"
              onClick={(e) => handleNavHref(e, '/#activities')}
              className="text-[11px] tracking-[0.22em] uppercase text-[#C8BFA8] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
            >
              Activities
            </a>
            {siteContent.navigation.categories.map((cat) =>
              cat.href.startsWith('/#') ? (
                <a
                  key={cat.label}
                  href={cat.href}
                  onClick={(e) => handleNavHref(e, cat.href)}
                  className="text-[11px] tracking-[0.22em] uppercase text-[#C8BFA8] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
                >
                  {cat.label}
                </a>
              ) : (
                <Link
                  key={cat.label}
                  to={cat.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-[11px] tracking-[0.22em] uppercase transition-colors whitespace-nowrap shrink-0 ${
                    location.pathname === cat.href
                      ? 'text-[#D4AF37] font-medium'
                      : 'text-[#C8BFA8] hover:text-[#D4AF37]'
                  }`}
                >
                  {cat.label}
                </Link>
              )
            )}
            <a
              href={siteContent.navigation.campButton.href}
              onClick={(e) => handleNavHref(e, siteContent.navigation.campButton.href)}
              className="text-[11px] tracking-[0.22em] uppercase text-[#C8BFA8] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
            >
              {siteContent.navigation.campButton.label}
            </a>
          </nav>

          {/* Right Ribbon Actions (Cart & Book CTA; leaves room on right for persistent Menu Icon) */}
          <div className="flex items-center gap-2.5 sm:gap-3 pr-12 sm:pr-14 shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Open order cart"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#F5EFE6]/15 bg-[#161311]/75 text-xs tracking-[0.16em] uppercase text-[#F5EFE6] hover:border-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-mono-tabular text-[11px] text-[#D4AF37]">
                {cartCount}
              </span>
            </button>

            <a
              href={siteContent.navigation.bookButton.href}
              onClick={(e) => handleNavHref(e, siteContent.navigation.bookButton.href)}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-[#D4AF37] text-[#0C0A09] text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#e3be42] transition-colors whitespace-nowrap shrink-0"
            >
              {siteContent.navigation.bookButton.label}
            </a>
          </div>
        </div>
      </header>

      {/* 1B. Persistent Top-Left Logo Emblem (Always visible on scroll) */}
      <a
        href="#home"
        onClick={handleBrandClick}
        aria-label={`${siteContent.brand.name} Home`}
        className="fixed top-3 left-5 sm:top-4 sm:left-8 z-[48] inline-flex items-center group focus:outline-none select-none"
      >
        <img
          src={siteContent.brand.logo}
          alt={`${siteContent.brand.name} Logo`}
          referrerPolicy="no-referrer"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain bg-black p-0.5 border border-[#D4AF37]/35 shadow-[0_6px_18px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-105 shrink-0"
        />
      </a>

      {/* 1C. Persistent Top-Right Menu Icon Button (Always visible on scroll) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="nav-overlay"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="fixed top-3 right-5 sm:top-4 sm:right-8 z-[48] w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#FDFBF7]/18 bg-[#24140E]/90 text-[#FDFBF7] shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-[#D4AF37] hover:text-[#0C0A09] hover:border-[#D4AF37] hover:scale-105 active:scale-90 cursor-pointer"
      >
        {isOpen ? (
          <X className="w-5 h-5 transition-transform duration-300 rotate-0" />
        ) : (
          <Menu className="w-5 h-5 transition-transform duration-300" />
        )}
      </button>

      {/* =====================================================================
          2. FULL-SCREEN CINEMATIC MENU OVERLAY (1.8s Slow Reveal)
          ===================================================================== */}
      <div
        id="nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation"
        onMouseMove={handleMouseMove}
        className={`cinematic-overlay ${
          isOpen ? 'active' : ''
        } fixed inset-0 z-[45] bg-[#160C08]/98 backdrop-blur-2xl overflow-x-hidden overflow-y-auto flex flex-col justify-between`}
      >
        {/* Clipped Atmospheric Background Layer */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Subtle animated SVG film grain texture (opacity: 0.045) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.045]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="walnut-film-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="4"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#walnut-film-grain)" />
          </svg>

          {/* Top-Left Terracotta Parallax Glow Blob (#E87A5D) */}
          <div
            style={{
              transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
            }}
            className="absolute -top-28 -left-28 w-[420px] h-[420px] rounded-full bg-[#E87A5D]/25 blur-[110px] transition-transform duration-700 ease-out"
          />

          {/* Bottom-Right Warm Walnut Parallax Glow Blob (#7B4B2A) shifting in opposite direction */}
          <div
            style={{
              transform: `translate3d(${-mouseOffset.x}px, ${-mouseOffset.y}px, 0)`,
            }}
            className="absolute -bottom-32 -right-28 w-[480px] h-[480px] rounded-full bg-[#7B4B2A]/35 blur-[110px] transition-transform duration-700 ease-out"
          />
        </div>

        {/* Overlay Content Container */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 pt-24 pb-10 min-h-screen flex flex-col justify-between">
          {/* Main 12-Column Navigation & Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto py-6">
            {/* Left Column (7 cols) — Staggered Editorial Navigation Links */}
            <nav
              aria-label="Primary Cinematic Navigation"
              className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-4"
            >
              {OVERLAY_NAV_ITEMS.map((item, idx) => {
                const isHovered = hoveredIdx === idx;
                const delayMs = 90 + idx * 70;

                return (
                  <div
                    key={item.index}
                    style={{
                      transitionDelay: isOpen ? `${delayMs}ms` : '0ms',
                      transitionDuration: '550ms',
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    className={`transition-all ${
                      isOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <a
                      href={item.href}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onFocus={() => setHoveredIdx(idx)}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToTarget(item, idx);
                      }}
                      className="group inline-flex flex-col items-start text-left focus:outline-none py-1"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-5 transition-transform duration-300 ease-out group-hover:translate-x-[14px]">
                        {/* Small gold tabular index number (01–05 in #FCD34D) */}
                        <span className="font-mono-tabular text-xs sm:text-sm font-medium text-[#FCD34D] tracking-[0.2em]">
                          {item.index}
                        </span>

                        {/* Large bold uppercase display type */}
                        <span
                          style={{
                            fontSize: 'clamp(2.2rem, 6vw, 4.75rem)',
                          }}
                          className={`font-serif-display font-bold uppercase leading-[1.02] tracking-tight transition-all duration-300 ${
                            isHovered
                              ? 'text-[#E87A5D] drop-shadow-[0_0_24px_rgba(232,122,93,0.4)]'
                              : 'text-[#FDFBF7]'
                          }`}
                        >
                          {item.label}
                        </span>

                        {/* Subtle tagline beside or below on desktop */}
                        <span className="hidden sm:inline-block text-xs tracking-[0.14em] text-[#C8BFA8]/75 font-light group-hover:text-[#FDFBF7] transition-colors">
                          {item.tagline}
                        </span>
                      </div>

                      {/* Animated left-to-right gradient underline (from-[#E87A5D] to-[#FCD34D]) */}
                      <span className="mt-1.5 ml-8 sm:ml-10 h-[2px] w-full max-w-md bg-gradient-to-r from-[#E87A5D] to-[#FCD34D] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-full" />
                    </a>
                  </div>
                );
              })}
            </nav>

            {/* Right Column (5 cols, desktop) — Floating Hover Preview Card */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
              <div className="rotate-2 w-[300px] rounded-[2rem] border-4 border-[#FDFBF7]/15 bg-[#24140E] p-2.5 shadow-[0_28px_70px_rgba(0,0,0,0.65)] transition-transform duration-500 hover:rotate-0">
                <div className="relative aspect-[3/4] w-full rounded-[1.5rem] overflow-hidden bg-[#160C08]">
                  {OVERLAY_NAV_ITEMS.map((item, idx) => {
                    const active = idx === hoveredIdx;
                    return (
                      <img
                        key={item.index}
                        src={item.previewImage}
                        alt={item.label}
                        referrerPolicy="no-referrer"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                          active
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                      />
                    );
                  })}

                  {/* Measured dark gradient scrim at bottom of 3:4 preview */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160C08] via-[#160C08]/30 to-transparent" />

                  {/* Top index pill inside preview */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="font-mono-tabular text-xs font-semibold tracking-[0.22em] text-[#FCD34D] bg-[#160C08]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#FDFBF7]/15">
                      {activePreview.index} / 05
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#FDFBF7]/80">
                      {siteContent.brand.name}
                    </span>
                  </div>

                  {/* Bottom tagline & section label */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[10px] tracking-[0.24em] uppercase text-[#E87A5D] font-medium mb-1">
                      {activePreview.label}
                    </p>
                    <p className="font-serif-display text-xl text-[#FDFBF7] leading-snug">
                      {activePreview.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar — Quick Actions & Section Counter */}
          <div className="border-t border-[#FDFBF7]/14 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left side: QUICK ACTIONS eyebrow + 2 interactive action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="text-[11px] tracking-[0.26em] uppercase font-semibold text-[#E87A5D]">
                QUICK ACTIONS
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCart();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#24140E] border border-[#FDFBF7]/15 text-xs tracking-[0.16em] uppercase text-[#FDFBF7] hover:bg-[#E87A5D] hover:border-[#E87A5D] transition-colors cursor-pointer"
                >
                  <span>Order pickup</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenRecipeModal?.();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#24140E] border border-[#FDFBF7]/15 text-xs tracking-[0.16em] uppercase text-[#FDFBF7] hover:bg-[#E87A5D] hover:border-[#E87A5D] transition-colors cursor-pointer"
                >
                  <span>5-ingredient recipe</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right side: Active section progress indicator ([active index] ——— 05) */}
            <div className="flex items-center gap-3 font-mono-tabular text-xs sm:text-sm tracking-[0.22em] text-[#FDFBF7]/90">
              <span className="text-[#FCD34D] font-semibold">
                {OVERLAY_NAV_ITEMS[activeSectionIdx]?.index || '01'}
              </span>
              <span className="text-[#FDFBF7]/35 select-none">———</span>
              <span>05</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
