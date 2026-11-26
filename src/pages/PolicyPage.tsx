import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, ArrowLeft } from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from '../components/StarText';

interface PolicyPageProps {
  type: 'booking' | 'payment' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const data =
    type === 'booking'
      ? siteContent.pages.bookingPolicy
      : type === 'payment'
      ? siteContent.pages.paymentPolicy
      : siteContent.pages.terms;

  return (
    <main className="pt-28 pb-24 px-5 sm:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C8BFA8] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Walnut Garden</span>
        </Link>
      </div>

      {/* Policy Header */}
      <div className="pb-10 mb-12 border-b border-[#F5EFE6]/10">
        <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3">
          {data.kicker}
        </p>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-normal text-[#F5EFE6] tracking-tight mb-4">
          <StarText text={data.heading} />
        </h1>
        <p className="text-xs tracking-[0.2em] uppercase text-[#C8BFA8]/70">
          {data.updated}
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-10 mb-14">
        {data.sections.map((sec, idx) => (
          <section
            key={idx}
            className="p-6 sm:p-8 rounded-xl bg-[#14110F] border border-[#F5EFE6]/10"
          >
            <h2 className="font-serif-display text-2xl sm:text-3xl text-[#F5EFE6] font-normal mb-3">
              {sec.title}
            </h2>
            <p className="text-sm sm:text-base text-[#C8BFA8]/90 font-light leading-relaxed">
              {sec.body}
            </p>
          </section>
        ))}
      </div>

      {/* Dedicated Payment Gateway Placeholder Section on Payment Policy Page */}
      {type === 'payment' && (
        <div
          id="policy-payment-gateway-placeholder"
          data-payment-gateway="owner-config-slot"
          className="p-7 sm:p-9 rounded-xl bg-[#171310] border border-dashed border-[#D4AF37]/50 space-y-4 mb-14"
        >
          <div className="flex items-center gap-3 text-[#D4AF37]">
            <CreditCard className="w-5 h-5" />
            <span className="text-xs tracking-[0.24em] uppercase font-medium">
              DEVELOPER SLOT · PAYMENT GATEWAY INTEGRATION
            </span>
          </div>
          <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
            Ready for Razorpay / Stripe / PayU Live Keys
          </h3>
          <p className="text-xs sm:text-sm text-[#C8BFA8]/85 font-light leading-relaxed">
            When you are ready to collect online payments directly on the website, add your Merchant Key ID in <code className="text-[#D4AF37]">src/data/content.js</code> and hook your checkout handler into the <code className="text-[#D4AF37]">#camp-payment-gateway-slot</code> and <code className="text-[#D4AF37]">#cart-payment-gateway-slot</code> containers.
          </p>
        </div>
      )}

      {/* Quick switcher between the 3 policy pages */}
      <div className="pt-8 border-t border-[#F5EFE6]/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#C8BFA8]/70">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>{siteContent.brand.buildingSign}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs tracking-[0.18em] uppercase">
          <Link
            to="/booking-policy"
            className={type === 'booking' ? 'text-[#D4AF37]' : 'text-[#C8BFA8] hover:text-[#F5EFE6]'}
          >
            Booking Policy
          </Link>
          <span aria-hidden="true" className="text-[#C8BFA8]/30">·</span>
          <Link
            to="/payment-policy"
            className={type === 'payment' ? 'text-[#D4AF37]' : 'text-[#C8BFA8] hover:text-[#F5EFE6]'}
          >
            Payment Policy
          </Link>
          <span aria-hidden="true" className="text-[#C8BFA8]/30">·</span>
          <Link
            to="/terms"
            className={type === 'terms' ? 'text-[#D4AF37]' : 'text-[#C8BFA8] hover:text-[#F5EFE6]'}
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </main>
  );
};
