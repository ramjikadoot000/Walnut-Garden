import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Check, Calendar, Users, Phone, User, X } from 'lucide-react';
import { siteContent } from '../data/content.js';
import { StarText } from './StarText';

interface CampBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const CampBookingModal: React.FC<CampBookingModalProps> = ({
  isOpen,
  onClose,
  selectedOptionId,
  onSelectOption,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [specialRequest, setSpecialRequest] = useState('');
  const [confirmedWhatsAppUrl, setConfirmedWhatsAppUrl] = useState<string | null>(null);

  const selectedOption =
    siteContent.camp.options.find((o) => o.id === selectedOptionId) ||
    siteContent.camp.options[0];

  const guestCount = Math.max(1, parseInt(guests || '1', 10));
  const estimatedTotal = selectedOption.price * guestCount;

  // Reset confirmation view whenever modal opens with a newly clicked package
  useEffect(() => {
    if (isOpen) {
      setConfirmedWhatsAppUrl(null);
    }
  }, [isOpen, selectedOptionId]);

  // Escape key & background scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date.trim()) {
      onShowToast('Please fill in your name, phone number, and check-in date.');
      return;
    }

    const messageLines = [
      `*WALNUT GARDEN (CAFE & CAMPING) — CAMP BOOKING REQUEST*`,
      `----------------------------------`,
      `*Experience:* ${selectedOption.name}`,
      `*Guest Name:* ${name.trim()}`,
      `*Phone:* ${phone.trim()}`,
      `*Date:* ${date}`,
      `*Number of Guests:* ${guestCount}`,
      `*Estimated Total:* ₹${estimatedTotal} (₹${selectedOption.price} × ${guestCount})`,
      specialRequest.trim() ? `*Notes:* ${specialRequest.trim()}` : '',
      `----------------------------------`,
      `Please confirm availability for our visit to Palampur.`,
    ].filter(Boolean);

    const encoded = encodeURIComponent(messageLines.join('\n'));
    const waUrl = `https://wa.me/${siteContent.contact.whatsappNumber}?text=${encoded}`;
    setConfirmedWhatsAppUrl(waUrl);
    onShowToast('Camp booking request confirmed! Send via WhatsApp below.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="camp-book-modal-title"
        >
          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Booking Card (#camp-book) */}
          <motion.div
            id="camp-book"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-5xl bg-[#14110F] border border-[#D4AF37]/35 rounded-xl p-6 sm:p-10 lg:p-12 shadow-[0_28px_90px_rgba(0,0,0,0.9)] my-auto max-h-[92vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close booking dialog"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-[#1C1815] border border-[#F5EFE6]/15 flex items-center justify-center text-[#C8BFA8] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Selected Package Summary & Payment Gateway Slot */}
              <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#F5EFE6]/10 pb-8 lg:pb-0 lg:pr-10">
                <div>
                  <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3 pr-10">
                    {siteContent.camp.bookingForm.kicker}
                  </p>
                  <h3
                    id="camp-book-modal-title"
                    className="font-serif-display text-3xl sm:text-4xl text-[#F5EFE6] font-normal mb-4"
                  >
                    <StarText text={siteContent.camp.bookingForm.heading} />
                  </h3>
                  <p className="text-sm text-[#C8BFA8]/85 font-light leading-relaxed mb-8">
                    {siteContent.camp.bookingForm.subtext}
                  </p>

                  {/* Active Package Card */}
                  <div className="p-5 rounded-lg bg-[#1A1613] border border-[#D4AF37]/35 mb-6">
                    <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#D4AF37] mb-1">
                      <span>SELECTED EXPERIENCE</span>
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <p className="font-serif-display text-2xl text-[#F5EFE6] mb-1">
                      {selectedOption.name}
                    </p>
                    <p className="text-xs text-[#C8BFA8]/70 mb-4">
                      {selectedOption.subtitle}
                    </p>
                    <div className="flex items-baseline justify-between pt-3 border-t border-[#F5EFE6]/10">
                      <span className="text-xs uppercase tracking-[0.18em] text-[#C8BFA8]">
                        Estimated Total ({guestCount} {guestCount === 1 ? 'Guest' : 'Guests'})
                      </span>
                      <span className="font-mono-tabular text-xl text-[#D4AF37] font-medium">
                        ₹{estimatedTotal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clearly Marked Payment Gateway Placeholder for Owner */}
                <div
                  id="camp-payment-gateway-slot"
                  data-payment-gateway="razorpay-stripe-slot"
                  className="p-4 rounded-lg bg-[#181411] border border-dashed border-[#D4AF37]/40"
                >
                  <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#D4AF37] mb-1">
                    <span>PAYMENT GATEWAY SLOT (READY)</span>
                    <span className="font-mono-tabular">INR ₹</span>
                  </div>
                  <p className="text-xs text-[#C8BFA8]/80 font-light leading-relaxed">
                    No advance is charged online right now. Submitting this form formats a pre-filled WhatsApp reservation directly to our Palampur camp host (<span className="font-mono-tabular">{siteContent.contact.phoneDisplay}</span>).
                  </p>
                </div>
              </div>

              {/* Right Column: Booking Form or Confirmation Message */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                {!confirmedWhatsAppUrl ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    {/* Experience selector */}
                    <div>
                      <label className="block text-[10px] tracking-[0.24em] uppercase text-[#C8BFA8] mb-2">
                        Choose Camp Option
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {siteContent.camp.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => onSelectOption(opt.id)}
                            className={`p-3 rounded text-left border transition-colors cursor-pointer ${
                              selectedOptionId === opt.id
                                ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#F5EFE6]'
                                : 'bg-[#1A1614] border-[#F5EFE6]/10 text-[#C8BFA8] hover:border-[#F5EFE6]/30'
                            }`}
                          >
                            <span className="block text-xs font-medium truncate">
                              {opt.name}
                            </span>
                            <span className="font-mono-tabular text-[11px] text-[#D4AF37]">
                              ₹{opt.price}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="camp-modal-name"
                          className="block text-[10px] tracking-[0.24em] uppercase text-[#C8BFA8] mb-2"
                        >
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#C8BFA8]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="camp-modal-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Kabir Sharma"
                            className="w-full pl-10 pr-4 py-3 text-sm bg-[#1A1614] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] placeholder-[#C8BFA8]/40 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="camp-modal-phone"
                          className="block text-[10px] tracking-[0.24em] uppercase text-[#C8BFA8] mb-2"
                        >
                          Phone / WhatsApp Number *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#C8BFA8]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="camp-modal-phone"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full pl-10 pr-4 py-3 text-sm bg-[#1A1614] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] placeholder-[#C8BFA8]/40 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="camp-modal-date"
                          className="block text-[10px] tracking-[0.24em] uppercase text-[#C8BFA8] mb-2"
                        >
                          Date of Visit / Check-In *
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-[#C8BFA8]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="camp-modal-date"
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 text-sm bg-[#1A1614] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="camp-modal-guests"
                          className="block text-[10px] tracking-[0.24em] uppercase text-[#C8BFA8] mb-2"
                        >
                          Number of Guests *
                        </label>
                        <div className="relative">
                          <Users className="w-4 h-4 text-[#C8BFA8]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <select
                            id="camp-modal-guests"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 text-sm bg-[#1A1614] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                          >
                            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                              <option key={num} value={num} className="bg-[#14110F]">
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="camp-modal-notes"
                        className="block text-[10px] tracking-[0.24em] uppercase text-[#C8BFA8] mb-2"
                      >
                        Special Requests (Optional)
                      </label>
                      <input
                        id="camp-modal-notes"
                        type="text"
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        placeholder="e.g. Ridge-facing tent, birthday bonfire cake, extra sleeping bag"
                        className="w-full px-4 py-3 text-sm bg-[#1A1614] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] placeholder-[#C8BFA8]/40 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 px-6 text-xs tracking-[0.24em] uppercase font-medium bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer"
                    >
                      Confirm & Send Booking via WhatsApp
                    </button>
                  </form>
                ) : (
                  /* Confirmation State */
                  <div className="p-8 rounded-lg bg-[#1A1714] border border-[#D4AF37]/50 text-center space-y-5">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                      <Check className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-[10px] tracking-[0.28em] uppercase text-[#D4AF37] mb-2">
                        BOOKING SUMMARY READY
                      </p>
                      <h4 className="font-serif-display text-3xl text-[#F5EFE6]">
                        <StarText text={siteContent.camp.bookingForm.confirmationTitle} />
                      </h4>
                    </div>

                    <div className="text-left bg-[#120F0D] border border-[#F5EFE6]/10 rounded p-4 text-xs space-y-1.5 text-[#C8BFA8]">
                      <p>
                        <span className="text-[#F5EFE6]">Experience:</span> {selectedOption.name}
                      </p>
                      <p>
                        <span className="text-[#F5EFE6]">Guest:</span> {name} ({phone})
                      </p>
                      <p>
                        <span className="text-[#F5EFE6]">Date & Guests:</span> {date} · {guestCount}{' '}
                        {guestCount === 1 ? 'Guest' : 'Guests'}
                      </p>
                      <p>
                        <span className="text-[#F5EFE6]">Estimated Total:</span>{' '}
                        <span className="font-mono-tabular text-[#D4AF37]">₹{estimatedTotal}</span>
                      </p>
                    </div>

                    <p className="text-xs text-[#C8BFA8]/80 max-w-md mx-auto leading-relaxed">
                      {siteContent.camp.bookingForm.confirmationMessage}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <a
                        href={confirmedWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3.5 text-xs tracking-[0.22em] uppercase font-medium bg-[#25D366] text-[#0C0A09] rounded hover:opacity-95 transition-opacity text-center"
                      >
                        Open WhatsApp to Send →
                      </a>
                      <button
                        type="button"
                        onClick={() => setConfirmedWhatsAppUrl(null)}
                        className="w-full sm:w-auto px-5 py-3.5 text-xs tracking-[0.2em] uppercase border border-[#F5EFE6]/20 text-[#C8BFA8] rounded hover:border-[#D4AF37] hover:text-[#F5EFE6] transition-colors cursor-pointer"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
