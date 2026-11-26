import React from 'react';
import { ScrollHero } from '../components/ScrollHero';
import { MarqueeStrip } from '../components/MarqueeStrip';
import { ActivitiesSection } from '../components/ActivitiesSection';
import { Bestsellers } from '../components/Bestsellers';
import { CampSection } from '../components/CampSection';
import { PostcardsSection } from '../components/PostcardsSection';
import { ReelsSection } from '../components/ReelsSection';
import { CartItem } from '../components/CartDrawer';

interface HomeProps {
  cart: CartItem[];
  onAddToCart: (item: { id: string; name: string; price: number; image: string }) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onOpenCart: () => void;
  selectedCampOptionId: string;
  onOpenCampBooking: (optionId?: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
  selectedCampOptionId,
  onOpenCampBooking,
}) => {
  return (
    <main className="relative">
      {/* 1. OPENING SCROLL HERO */}
      <ScrollHero onOpenCampBooking={() => onOpenCampBooking()} />

      {/* SCROLLING WORDS STRIP */}
      <MarqueeStrip />

      {/* 2. ACTIVITIES SECTION (Trekking, Bonfire Nights, Outdoor Games, Music & Evening Gathering) */}
      <ActivitiesSection onOpenCampBooking={onOpenCampBooking} />

      {/* 3. SIGNATURE BESTSELLERS (6 Signature Highlights + Full Menu Page CTA) */}
      <Bestsellers
        cart={cart}
        onAddToCart={onAddToCart}
        onUpdateQuantity={onUpdateQuantity}
        onOpenCart={onOpenCart}
      />

      {/* 4. CAMP EXPERIENCES */}
      <CampSection
        selectedOptionId={selectedCampOptionId}
        onOpenBooking={(optionId) => onOpenCampBooking(optionId)}
      />

      {/* 5. POSTCARDS */}
      <PostcardsSection />

      {/* 6. MOUNTAIN REELS & INTERACTIVE BENTO GALLERY */}
      <ReelsSection />
    </main>
  );
};
