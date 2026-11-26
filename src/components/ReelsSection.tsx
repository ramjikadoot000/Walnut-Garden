import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from './StarText';
import InteractiveBentoGallery, { MediaItemType } from './ui/interactive-bento-gallery';
import { Reveal } from './Reveal';

export const ReelsSection: React.FC = () => {
  const bentoItems: MediaItemType[] = (siteContent.reels.bentoItems || []).map((item, idx) => ({
    id: typeof item.id === 'number' ? item.id : idx + 1,
    type: item.type || 'image',
    title: item.title,
    desc: item.desc,
    url: item.url,
    span: item.span,
    instagramUrl: item.instagramUrl,
  }));

  return (
    <section
      id="reels"
      className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto border-b border-[#F5EFE6]/10"
    >
      {/* Header & Instagram CTA */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-2">
              {siteContent.reels.kicker}
            </p>
            <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal text-[#F5EFE6] tracking-tight [text-wrap:balance]">
              <StarText text={siteContent.reels.heading} />
            </h2>
          </div>

          <a
            href={siteContent.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.2em] uppercase border border-[#F5EFE6]/20 text-[#F5EFE6] rounded hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <Instagram className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{siteContent.contact.instagramHandle}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </a>
        </div>
      </Reveal>

      {/* Interactive Bento Gallery Integrated in Mountain Reels & Stories Section */}
      <div>
        <InteractiveBentoGallery
          mediaItems={bentoItems}
          title=""
          description=""
        />
      </div>
    </section>
  );
};
