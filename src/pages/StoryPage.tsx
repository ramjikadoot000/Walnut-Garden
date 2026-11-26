import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from '../components/StarText';

interface StoryPageProps {
  onOpenCampBooking?: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ onOpenCampBooking }) => {
  const story = siteContent.pages.story;

  return (
    <main className="pt-28 pb-24 px-5 sm:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-14">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3">
          {story.kicker}
        </p>
        <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-normal text-[#F5EFE6] tracking-tight mb-6 [text-wrap:balance]">
          <StarText text={story.heading} />
        </h1>
        <p className="text-base sm:text-lg text-[#C8BFA8] font-light leading-relaxed">
          {story.lead}
        </p>
      </div>

      {/* Hero Photo Banner */}
      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#14110F] border border-[#F5EFE6]/10 mb-20">
        <img
          src={story.heroImage}
          alt="Walnut Cafe cottage and prayer flags in Palampur"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-transparent to-transparent opacity-70" />
        <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[10px] tracking-[0.24em] uppercase text-[#F5EFE6]/90">
          <span>{siteContent.brand.buildingSign}</span>
          <span className="text-[#D4AF37]">{siteContent.brand.elevation}</span>
        </div>
      </div>

      {/* Editorial Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        <div className="lg:col-span-7 space-y-12">
          {story.chapters.map((ch) => (
            <div
              key={ch.number}
              className="pb-10 border-b border-[#F5EFE6]/10 last:border-b-0"
            >
              <span className="font-mono-tabular text-xs tracking-[0.24em] text-[#D4AF37] block mb-2">
                CHAPTER {ch.number}
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-[#F5EFE6] font-normal mb-4">
                {ch.title}
              </h2>
              <p className="text-sm sm:text-base text-[#C8BFA8]/90 font-light leading-relaxed">
                {ch.body}
              </p>
            </div>
          ))}
        </div>

        {/* Right Side Interior Showcase Card */}
        <div className="lg:col-span-5 bg-[#14110F] border border-[#F5EFE6]/10 rounded-xl overflow-hidden">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={story.secondaryImage}
              alt="Inside the pine-wood dining booths at Walnut Cafe"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#D4AF37]">
              THE PINE-WOOD DINING ROOM
            </p>
            <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
              Crafted for unhurried conversations
            </h3>
            <p className="text-xs sm:text-sm text-[#C8BFA8]/85 font-light leading-relaxed">
              Whether you come for a morning kulhad chai by the window or an overnight tent under the Dhauladhar ridge, our doors are open every day from 9:00 AM to 10:30 PM.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpenCampBooking?.()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer"
              >
                <span>Reserve Your Stay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.2em] uppercase border border-[#F5EFE6]/20 text-[#F5EFE6] rounded hover:border-[#D4AF37] transition-colors"
              >
                <span>View Gallery</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
