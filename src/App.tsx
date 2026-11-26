/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { RecipeModal } from './components/RecipeModal';
import { CampBookingModal } from './components/CampBookingModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { siteContent } from './data/content.js';
import { Home } from './pages/Home';
import { MenuPage } from './pages/MenuPage';
import { StoryPage } from './pages/StoryPage';
import { GalleryPage } from './pages/GalleryPage';
import { PolicyPage } from './pages/PolicyPage';

interface ScrollHandlerProps {
  onOpenCampBooking: () => void;
}

const ScrollToTopOnRouteChange: React.FC<ScrollHandlerProps> = ({ onOpenCampBooking }) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash === '#camp-book') {
      onOpenCampBooking();
    } else if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash, onOpenCampBooking]);

  return null;
};

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isCampBookingOpen, setIsCampBookingOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [, setContentVersion] = useState(0);
  const [selectedCampOptionId, setSelectedCampOptionId] = useState<string>(
    siteContent.camp.options[0].id
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Re-render all components immediately whenever Admin Portal saves or resets content
  useEffect(() => {
    const handleContentUpdate = () => {
      setContentVersion((v) => v + 1);
    };
    window.addEventListener('site-content-updated', handleContentUpdate);
    return () =>
      window.removeEventListener('site-content-updated', handleContentUpdate);
  }, []);

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scrolling on all pages
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Stop Lenis and lock background page scroll whenever Admin Portal or any modal is open
  const isAnyModalOpen =
    isAdminPortalOpen || isCartOpen || isCampBookingOpen || isRecipeModalOpen;

  useEffect(() => {
    if (isAnyModalOpen) {
      lenisRef.current?.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      lenisRef.current?.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  const showToast = useCallback((text: string) => {
    const id = String(Date.now());
    setToast({ id, text });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3400);
  }, []);

  const handleAddToCart = useCallback(
    (item: { id: string; name: string; price: number; image: string }) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      showToast(`Added ${item.name} (₹${item.price}) to your order`);
    },
    [showToast]
  );

  const handleUpdateQuantity = useCallback(
    (id: string, delta: number) => {
      setCart((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + delta } : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  const handleClearCart = useCallback(() => {
    setCart([]);
    showToast('Order cart cleared');
  }, [showToast]);

  const handleOpenCampBooking = useCallback((optionId?: string) => {
    if (optionId) {
      setSelectedCampOptionId(optionId);
    }
    setIsCampBookingOpen(true);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange onOpenCampBooking={() => handleOpenCampBooking()} />

      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <div className="relative min-h-screen bg-[#0C0A09] text-[#F5EFE6] flex flex-col justify-between">
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenRecipeModal={() => setIsRecipeModalOpen(true)}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                onOpenCart={() => setIsCartOpen(true)}
                selectedCampOptionId={selectedCampOptionId}
                onOpenCampBooking={handleOpenCampBooking}
              />
            }
          />
          <Route
            path="/menu"
            element={
              <MenuPage
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                onOpenCart={() => setIsCartOpen(true)}
              />
            }
          />
          <Route
            path="/story"
            element={<StoryPage onOpenCampBooking={() => handleOpenCampBooking()} />}
          />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route
            path="/booking-policy"
            element={<PolicyPage type="booking" />}
          />
          <Route
            path="/payment-policy"
            element={<PolicyPage type="payment" />}
          />
          <Route path="/terms" element={<PolicyPage type="terms" />} />
        </Routes>

        <Footer
          onOpenCampBooking={() => handleOpenCampBooking()}
          onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        />
      </div>

      {/* Global Order Pickup Cart Drawer */}
      <CartDrawer
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onShowToast={showToast}
      />

      {/* Camp & Bonfire Booking Modal (triggered by Book actions across the site) */}
      <CampBookingModal
        isOpen={isCampBookingOpen}
        onClose={() => setIsCampBookingOpen(false)}
        selectedOptionId={selectedCampOptionId}
        onSelectOption={setSelectedCampOptionId}
        onShowToast={showToast}
      />

      {/* 5-Ingredient Recipe Modal */}
      <RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onOrderNow={() => setIsCartOpen(true)}
      />

      {/* Admin Portal Modal (triggered by the lock icon at the bottom of the website) */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        onShowToast={showToast}
      />

      {/* Dark toast notifications at bottom-centre */}
      <Toast toast={toast} />
    </BrowserRouter>
  );
}
