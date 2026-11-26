import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowUpRight, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { siteContent } from '../data/content.js';

interface FooterProps {
  onOpenCampBooking?: () => void;
  onOpenAdminPortal?: () => void;
}

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  dx: number;
  dy: number;
  color: string;
}

export const GoogleMapsLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M24 3C14.61 3 7 10.61 7 20C7 31.65 21.45 43.47 22.92 44.65C23.56 45.16 24.44 45.16 25.08 44.65C26.55 43.47 41 31.65 41 20C41 10.61 33.39 3 24 3Z"
      fill="#34A853"
    />
    <path
      d="M24 3C18.21 3 13.09 5.89 10.02 10.31L20.14 18.82L30.89 4.46C28.75 3.52 26.44 3 24 3Z"
      fill="#1A73E8"
    />
    <path
      d="M10.02 10.31C8.11 13.05 7 16.4 7 20C7 23.43 8.07 26.86 9.93 30.14L21.52 16.34L10.02 10.31Z"
      fill="#EA4335"
    />
    <path
      d="M30.89 4.46L17.9 19.95L28.4 28.81L38.94 16.25C37.54 10.91 34.68 6.66 30.89 4.46Z"
      fill="#4285F4"
    />
    <path
      d="M9.93 30.14C12.01 33.81 14.84 37.34 17.61 40.1L30.82 24.37L20.11 16.32L9.93 30.14Z"
      fill="#FBBC04"
    />
    <path
      d="M38.94 16.25L17.61 40.1C20.18 42.65 22.36 44.2 22.92 44.65C23.56 45.16 24.44 45.16 25.08 44.65C26.55 43.47 41 31.65 41 20C41 18.71 40.86 17.46 40.58 16.25H38.94Z"
      fill="#34A853"
    />
    <circle cx="24" cy="19.5" r="6.8" fill="#FFFFFF" />
  </svg>
);

export const InstagramLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="ig_footer_grad1" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#FDF497" />
        <stop offset="5%" stopColor="#FDF497" />
        <stop offset="45%" stopColor="#FD5949" />
        <stop offset="60%" stopColor="#D6249F" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="3" y="3" width="42" height="42" rx="11" fill="url(#ig_footer_grad1)" />
    <rect x="11" y="11" width="26" height="26" rx="7.5" stroke="#FFFFFF" strokeWidth="3.4" />
    <circle cx="24" cy="24" r="6.2" stroke="#FFFFFF" strokeWidth="3.4" />
    <circle cx="31.8" cy="16.2" r="2" fill="#FFFFFF" />
  </svg>
);

export const WhatsAppLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="3" width="42" height="42" rx="11" fill="#25D366" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.04 10.5C16.69 10.5 10.71 16.45 10.71 23.79C10.71 26.27 11.4 28.68 12.7 30.77L10.5 37.5L17.46 35.34C19.47 36.5 21.73 37.11 24.04 37.11C31.39 37.11 37.37 31.16 37.37 23.82C37.37 16.48 31.39 10.5 24.04 10.5ZM24.04 34.49C21.97 34.49 19.95 33.89 18.21 32.77L17.78 32.5L13.86 33.72L15.11 29.9L14.81 29.45C13.59 27.66 13.34 25.75 13.34 23.79C13.34 17.9 18.14 13.12 24.04 13.12C29.94 13.12 34.74 17.9 34.74 23.82C34.74 29.71 29.94 34.49 24.04 34.49ZM30.14 26.61C29.81 26.44 28.17 25.63 27.86 25.52C27.56 25.41 27.33 25.35 27.11 25.69C26.89 26.02 26.25 26.78 26.05 27.01C25.86 27.23 25.66 27.26 25.33 27.09C25 26.92 23.92 26.57 22.64 25.43C21.64 24.54 20.97 23.44 20.77 23.11C20.58 22.77 20.75 22.6 20.92 22.43C21.07 22.28 21.25 22.04 21.42 21.84C21.58 21.65 21.64 21.51 21.75 21.28C21.86 21.06 21.81 20.86 21.72 20.7C21.64 20.53 20.97 18.88 20.69 18.21C20.42 17.57 20.14 17.65 19.94 17.64C19.75 17.63 19.53 17.63 19.31 17.63C19.08 17.63 18.72 17.71 18.42 18.05C18.11 18.38 17.25 19.19 17.25 20.84C17.25 22.49 18.45 24.08 18.61 24.3C18.78 24.52 20.96 27.91 24.33 29.33C25.13 29.68 25.75 29.88 26.24 30.04C27.04 30.29 27.77 30.26 28.35 30.17C28.99 30.07 30.33 29.36 30.61 28.58C30.89 27.8 30.89 27.13 30.81 26.99C30.72 26.85 30.47 26.78 30.14 26.61Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({
  onOpenCampBooking,
  onOpenAdminPortal,
}) => {
  const [stars, setStars] = useState<StarParticle[]>([]);
  const [isCtaActive, setIsCtaActive] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const starIdRef = useRef(1);
  const lastMoveSpawnRef = useRef(0);

  const waDirectUrl = `https://wa.me/${siteContent.contact.whatsappNumber}?text=${encodeURIComponent(
    'Hello Walnut Garden! I would like to enquire about visiting your cafe & camp in Palampur.'
  )}`;

  const spawnInteractiveStars = useCallback((clientX?: number, clientY?: number, count = 14) => {
    const container = showcaseRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const originX =
      typeof clientX === 'number' && clientX > 0
        ? clientX - rect.left
        : rect.width * (0.25 + Math.random() * 0.5);
    const originY =
      typeof clientY === 'number' && clientY > 0
        ? clientY - rect.top
        : rect.height * (0.3 + Math.random() * 0.45);

    const palette = ['#D4AF37', '#F5EFE6', '#FDE047', '#F59E0B', '#FFFBEB'];
    const created: StarParticle[] = Array.from({ length: count }).map((_, idx) => {
      const id = starIdRef.current++;
      const angle = (Math.PI * 2 * idx) / count + (Math.random() - 0.5) * 0.65;
      const distance = 45 + Math.random() * 155;
      return {
        id,
        x: originX + (Math.random() - 0.5) * 60,
        y: originY + (Math.random() - 0.5) * 32,
        size: 13 + Math.random() * 19,
        rotation: Math.random() * 360,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 30,
        color: palette[idx % palette.length],
      };
    });

    setIsCtaActive(true);
    setStars((prev) => [...prev.slice(-34), ...created]);

    const createdIds = new Set(created.map((s) => s.id));
    window.setTimeout(() => {
      setStars((prev) => prev.filter((s) => !createdIds.has(s.id)));
    }, 1150);
  }, []);

  const handlePointerMoveStars = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const now = Date.now();
      if (now - lastMoveSpawnRef.current > 120) {
        lastMoveSpawnRef.current = now;
        spawnInteractiveStars(e.clientX, e.clientY, 5);
      }
    },
    [spawnInteractiveStars]
  );

  const handleTouchStars = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const touch = e.touches[0];
      if (touch) {
        spawnInteractiveStars(touch.clientX, touch.clientY, 16);
      } else {
        spawnInteractiveStars(undefined, undefined, 16);
      }
    },
    [spawnInteractiveStars]
  );

  return (
    <footer id="visit" className="bg-[#090807] border-t border-[#F5EFE6]/10 text-[#C8BFA8] pt-20 pb-10 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Sign Banner */}
        <div className="pb-12 mb-14 border-b border-[#F5EFE6]/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={siteContent.brand.logo}
              alt={`${siteContent.brand.name} Logo`}
              referrerPolicy="no-referrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain bg-black p-0.5 border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0"
            />
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-1">
                {siteContent.brand.buildingSign}
              </p>
              <h2 className="font-serif-display text-3xl sm:text-5xl text-[#F5EFE6] font-normal">
                {siteContent.brand.name}{' '}
                <span className="italic text-[#D4AF37]">— {siteContent.brand.tagline}</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={waDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs tracking-[0.18em] uppercase font-medium bg-[#14110F] border border-[#25D366]/40 text-[#F5EFE6] rounded-lg hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all inline-flex items-center gap-2.5 whitespace-nowrap shadow-sm"
            >
              <WhatsAppLogo className="w-5 h-5 shrink-0" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={siteContent.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs tracking-[0.18em] uppercase font-medium bg-[#14110F] border border-[#E1306C]/40 text-[#F5EFE6] rounded-lg hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-all inline-flex items-center gap-2.5 whitespace-nowrap shadow-sm"
            >
              <InstagramLogo className="w-5 h-5 shrink-0" />
              <span>Instagram</span>
            </a>
            <a
              href={siteContent.contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs tracking-[0.18em] uppercase font-medium bg-[#14110F] border border-[#4285F4]/40 text-[#F5EFE6] rounded-lg hover:border-[#4285F4] hover:bg-[#4285F4]/10 transition-all inline-flex items-center gap-2.5 whitespace-nowrap shadow-sm"
            >
              <GoogleMapsLogo className="w-5 h-5 shrink-0" />
              <span>Google Maps</span>
            </a>
          </div>
        </div>

        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-[#F5EFE6]/10">
          {/* Col 1: Address & Hours */}
          <div className="space-y-3">
            <h3 className="text-[11px] tracking-[0.26em] uppercase text-[#D4AF37]">
              Location & Hours
            </h3>
            <p className="text-sm text-[#F5EFE6]/90 font-light leading-relaxed">
              {siteContent.contact.address}
            </p>
            <p className="text-xs text-[#C8BFA8]/70 pt-1">
              {siteContent.contact.openingHours}
            </p>
            <a
              href={siteContent.contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#D4AF37] hover:underline pt-1.5"
            >
              <GoogleMapsLogo className="w-4 h-4 shrink-0" />
              <span>Get Directions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Col 2: Direct Contact */}
          <div className="space-y-3">
            <h3 className="text-[11px] tracking-[0.26em] uppercase text-[#D4AF37]">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <a
                  href={`tel:${siteContent.contact.phoneDisplay.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2.5 hover:text-[#D4AF37] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-mono-tabular">{siteContent.contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={waDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#D4AF37] transition-colors"
                >
                  <WhatsAppLogo className="w-4 h-4 shrink-0" />
                  <span>WhatsApp Concierge</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteContent.contact.email}`}
                  className="flex items-center gap-2.5 hover:text-[#D4AF37] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{siteContent.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteContent.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#D4AF37] transition-colors"
                >
                  <InstagramLogo className="w-4 h-4 shrink-0" />
                  <span>{siteContent.contact.instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Explore Links */}
          <div className="space-y-3">
            <h3 className="text-[11px] tracking-[0.26em] uppercase text-[#D4AF37]">
              Explore
            </h3>
            <ul className="space-y-2 text-sm font-light">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                  Home & Scroll Story
                </Link>
              </li>
              <li>
                <Link to="/story" className="hover:text-[#D4AF37] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#D4AF37] transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#D4AF37] transition-colors">
                  Full Menu & Dishes
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenCampBooking?.()}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Book Tent & Bonfire
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Policies & Legal */}
          <div className="space-y-3">
            <h3 className="text-[11px] tracking-[0.26em] uppercase text-[#D4AF37]">
              Guest Policies
            </h3>
            <ul className="space-y-2 text-sm font-light">
              <li>
                <Link to="/booking-policy" className="hover:text-[#D4AF37] transition-colors">
                  Booking & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/payment-policy" className="hover:text-[#D4AF37] transition-colors">
                  Payment & Gateway Info
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Official Platform Badges & Interactive Star Bottom Showcase */}
        <div
          ref={showcaseRef}
          onMouseMove={handlePointerMoveStars}
          onTouchStart={handleTouchStars}
          onMouseLeave={() => setIsCtaActive(false)}
          className="relative pt-14 pb-10 border-b border-[#F5EFE6]/10 select-none"
        >
          {/* Floating Interactive Star Particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
            <AnimatePresence>
              {stars.map((star) => (
                <motion.div
                  key={star.id}
                  initial={{
                    opacity: 1,
                    scale: 0.2,
                    x: star.x,
                    y: star.y,
                    rotate: star.rotation,
                  }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0.3, 1.35, 0.4],
                    x: star.x + star.dx,
                    y: star.y + star.dy,
                    rotate: star.rotation + 140,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: star.size,
                    height: star.size,
                    color: star.color,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_12px_rgba(212,175,55,0.95)]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 1L14.85 9.15L23 12L14.85 14.85L12 23L9.15 14.85L1 12L9.15 9.15L12 1Z" />
                  </svg>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 3 Official Brand Logo Cards + Interactive Bottom CTAs */}
          <div className="relative z-10 flex flex-col items-center text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-[#D4AF37] mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect, Navigate & Experience Under The Stars</span>
              <Sparkles className="w-3.5 h-3.5" />
            </span>

            {/* Official Colored Logos Dock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl mb-8">
              <a
                href={siteContent.contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => spawnInteractiveStars(e.clientX, e.clientY, 14)}
                onTouchStart={handleTouchStars}
                className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-[#12100E] border border-[#F5EFE6]/10 hover:border-[#34A853]/60 hover:bg-[#171412] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <GoogleMapsLogo className="w-7 h-7" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[#C8BFA8]/70">
                    Google Maps
                  </p>
                  <p className="text-sm font-medium text-[#F5EFE6] truncate group-hover:text-[#D4AF37] transition-colors">
                    Navigate to Palampur
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#C8BFA8]/50 group-hover:text-[#D4AF37] ml-auto shrink-0 transition-colors" />
              </a>

              <a
                href={siteContent.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => spawnInteractiveStars(e.clientX, e.clientY, 14)}
                onTouchStart={handleTouchStars}
                className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-[#12100E] border border-[#F5EFE6]/10 hover:border-[#E1306C]/60 hover:bg-[#171412] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <InstagramLogo className="w-8 h-8" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[#C8BFA8]/70">
                    Instagram
                  </p>
                  <p className="text-sm font-medium text-[#F5EFE6] truncate group-hover:text-[#D4AF37] transition-colors">
                    {siteContent.contact.instagramHandle}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#C8BFA8]/50 group-hover:text-[#D4AF37] ml-auto shrink-0 transition-colors" />
              </a>

              <a
                href={waDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => spawnInteractiveStars(e.clientX, e.clientY, 14)}
                onTouchStart={handleTouchStars}
                className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-[#12100E] border border-[#F5EFE6]/10 hover:border-[#25D366]/60 hover:bg-[#171412] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <WhatsAppLogo className="w-8 h-8" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[#C8BFA8]/70">
                    WhatsApp
                  </p>
                  <p className="text-sm font-medium text-[#F5EFE6] truncate group-hover:text-[#D4AF37] transition-colors">
                    Instant Table & Camp Desk
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#C8BFA8]/50 group-hover:text-[#D4AF37] ml-auto shrink-0 transition-colors" />
              </a>
            </div>

            {/* Interactive Star Bottom CTA Button */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onMouseEnter={(e) => spawnInteractiveStars(e.clientX, e.clientY, 18)}
                onTouchStart={handleTouchStars}
                onClick={(e) => {
                  spawnInteractiveStars(e.clientX, e.clientY, 22);
                  onOpenCampBooking?.();
                }}
                className="group relative px-7 py-4 rounded-xl bg-[#D4AF37] text-[#0C0A09] font-semibold text-xs sm:text-sm tracking-[0.24em] uppercase shadow-[0_0_35px_rgba(212,175,55,0.35)] hover:shadow-[0_0_55px_rgba(212,175,55,0.65)] hover:bg-[#e5c247] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-3"
              >
                <Sparkles className="w-4 h-4 text-[#0C0A09] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
                <span>Reserve Table & Starlit Camp</span>
                <Sparkles className="w-4 h-4 text-[#0C0A09] transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110" />
              </button>

              <button
                type="button"
                onMouseEnter={(e) => spawnInteractiveStars(e.clientX, e.clientY, 16)}
                onTouchStart={handleTouchStars}
                onClick={(e) => spawnInteractiveStars(e.clientX, e.clientY, 24)}
                className="px-5 py-4 rounded-xl border border-[#D4AF37]/40 bg-[#14110F]/90 text-[#F5EFE6] hover:border-[#D4AF37] hover:text-[#D4AF37] text-xs tracking-[0.22em] uppercase transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>✦ Touch for Mountain Stars</span>
              </button>
            </div>
          </div>

          {/* Monumental Bottom WALNUT GARDEN Brand Signature with Ambient Twinkling Stars */}
          <div
            onClick={(e) => spawnInteractiveStars(e.clientX, e.clientY, 22)}
            onTouchStart={handleTouchStars}
            className="relative z-10 pt-4 cursor-pointer group text-center"
          >
            {/* Ambient background glow when active */}
            <div
              className={`pointer-events-none absolute inset-x-10 -top-4 -bottom-4 rounded-full blur-3xl transition-opacity duration-500 ${
                isCtaActive ? 'opacity-35 bg-[#D4AF37]' : 'opacity-10 bg-[#D4AF37]'
              }`}
            />

            <p className="font-mono-tabular text-[10px] sm:text-xs tracking-[0.42em] uppercase text-[#D4AF37]/90 mb-3">
              ✦ {siteContent.brand.tagline} • Palampur, Himachal Pradesh ✦
            </p>

            <h2
              style={{ fontFamily: "'Syne', 'Space Grotesk', system-ui, sans-serif" }}
              className="font-extrabold uppercase tracking-[-0.04em] leading-[0.88] text-[12.5vw] sm:text-[10.8vw] lg:text-[8.4rem] text-transparent bg-clip-text bg-gradient-to-b from-[#F5EFE6] via-[#F5EFE6]/90 to-[#D4AF37]/45 group-hover:from-[#FFFBEB] group-hover:via-[#D4AF37] group-hover:to-[#F5EFE6]/70 transition-all duration-500 select-none"
            >
              WALNUT GARDEN
            </h2>
          </div>
        </div>

        {/* Bottom Copyright & Admin Lock Trigger */}
        <div className="pt-8 flex items-center justify-between gap-4 text-xs text-[#C8BFA8]/60">
          <p>
            © {new Date().getFullYear()} {siteContent.brand.name}, Palampur • Touch or hover above for starlit magic
          </p>
          <button
            type="button"
            onClick={() => onOpenAdminPortal?.()}
            aria-label="Open Admin Portal"
            title="Admin Portal (Manage Menu, Prices, Images & Texts)"
            className="w-8 h-8 rounded-full border border-[#F5EFE6]/15 bg-[#14110F] text-[#C8BFA8]/65 hover:text-[#D4AF37] hover:border-[#D4AF37]/60 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
