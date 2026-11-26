import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, X, Send, UtensilsCrossed } from 'lucide-react';
import { siteContent } from '../data/content.js';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onShowToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  cart,
  onUpdateQuantity,
  onClearCart,
  isCartOpen,
  setIsCartOpen,
  onShowToast,
}) => {
  const [tableOrName, setTableOrName] = useState('');
  const [notes, setNotes] = useState('');
  const [orderSentUrl, setOrderSentUrl] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const lines = [
      `*WALNUT GARDEN (CAFE & CAMPING) — NEW ORDER*`,
      `----------------------------------`,
      ...cart.map(
        (item, idx) =>
          `${idx + 1}. ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`
      ),
      `----------------------------------`,
      `*Total Payable:* ₹${subtotal}`,
      tableOrName ? `*Guest / Table:* ${tableOrName}` : `*Guest / Table:* Walk-in / Dine-in`,
      notes ? `*Kitchen Notes:* ${notes}` : '',
      `Location: ${siteContent.brand.locationShort}`,
    ].filter(Boolean);

    const encoded = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://wa.me/${siteContent.contact.whatsappNumber}?text=${encoded}`;
    setOrderSentUrl(waUrl);
    onShowToast('Order formatted for WhatsApp — click Send Order on WhatsApp below.');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-[#120F0D] border-l border-[#F5EFE6]/15 h-full flex flex-col justify-between p-6 overflow-y-auto"
            aria-label="Order Cart"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#F5EFE6]/10 pb-4 mb-6">
                <div>
                  <p className="text-[10px] tracking-[0.26em] uppercase text-[#D4AF37]">
                    WALNUT GARDEN KITCHEN
                  </p>
                  <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                    Your Cafe Order
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close order cart"
                  className="p-2 text-[#C8BFA8] hover:text-[#F5EFE6] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <UtensilsCrossed className="w-8 h-8 text-[#D4AF37]/50 mx-auto mb-3" />
                  <p className="font-serif-display text-2xl text-[#F5EFE6] mb-2">
                    Your tray is empty
                  </p>
                  <p className="text-xs text-[#C8BFA8]/70 max-w-xs mx-auto leading-relaxed">
                    Add Sepu Badi, Aloo Palda, Desi Aalu Parantha, or Honey Masala Tea from our menu.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-3 border-b border-[#F5EFE6]/10"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif-display text-lg text-[#F5EFE6] truncate">
                          {item.name}
                        </h4>
                        <p className="font-mono-tabular text-xs text-[#D4AF37]">
                          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#1B1714] border border-[#F5EFE6]/15 rounded px-2 py-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-[#C8BFA8] hover:text-[#D4AF37] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono-tabular text-xs px-1.5 text-[#F5EFE6]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-[#C8BFA8] hover:text-[#D4AF37] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClearCart();
                        setOrderSentUrl(null);
                      }}
                      className="text-[11px] tracking-[0.18em] uppercase text-[#C8BFA8]/60 hover:text-[#D4AF37] transition-colors cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <form onSubmit={handleCheckoutWhatsApp} className="border-t border-[#F5EFE6]/15 pt-5 mt-6 space-y-4">
                <div>
                  <label className="block text-[10px] tracking-[0.22em] uppercase text-[#C8BFA8] mb-1.5">
                    Your Name or Table / Tent Number
                  </label>
                  <input
                    type="text"
                    value={tableOrName}
                    onChange={(e) => setTableOrName(e.target.value)}
                    placeholder="e.g. Aarav · Booth 2 / Lawn Tent"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#1A1614] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] placeholder-[#C8BFA8]/40 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.22em] uppercase text-[#C8BFA8] mb-1.5">
                    Special Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Less sugar in chai, extra green chutney"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#1A1614] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] placeholder-[#C8BFA8]/40 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Clearly Marked Payment Gateway Integration Slot */}
                <div
                  id="cart-payment-gateway-slot"
                  data-payment-gateway="placeholder"
                  className="p-3 rounded bg-[#181412] border border-dashed border-[#D4AF37]/35 text-[11px] text-[#C8BFA8]/85 leading-relaxed"
                >
                  <span className="text-[#D4AF37] uppercase tracking-[0.18em] block font-medium mb-0.5">
                    Payment Mode · WhatsApp Counter / Future Gateway
                  </span>
                  {/* TODO: [PAYMENT_GATEWAY_INTEGRATION] Plug in Razorpay / Stripe Checkout SDK trigger here */}
                  Instant online UPI/Card gateway slot ready. Currently sends a pre-filled WhatsApp order directly to the Walnut Garden counter.
                </div>

                <div className="flex items-center justify-between py-2 border-y border-[#F5EFE6]/10">
                  <span className="text-xs tracking-[0.2em] uppercase text-[#C8BFA8]">
                    Total Payable
                  </span>
                  <span className="font-mono-tabular text-xl text-[#D4AF37] font-medium">
                    ₹{subtotal}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 text-xs tracking-[0.22em] uppercase font-medium bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Prepare WhatsApp Order</span>
                </button>

                {orderSentUrl && (
                  <div className="p-3.5 rounded bg-[#1A241B] border border-[#4ADE80]/30 text-center space-y-2">
                    <p className="text-xs text-[#F5EFE6]">
                      Order message ready for <span className="font-mono-tabular">+{siteContent.contact.whatsappNumber}</span>
                    </p>
                    <a
                      href={orderSentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs tracking-[0.2em] uppercase font-medium bg-[#25D366] text-[#0C0A09] rounded hover:opacity-95 transition-opacity"
                    >
                      Send Order on WhatsApp →
                    </a>
                  </div>
                )}
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
