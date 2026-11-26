import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  Upload,
  Image as ImageIcon,
  Utensils,
  Compass,
  Tent,
  Sparkles,
  Building2,
  BookOpen,
  Download,
  Check,
  Star,
} from 'lucide-react';
import {
  siteContent,
  saveSiteContent,
  resetSiteContent,
} from '../data/content.js';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

type AdminTab =
  | 'menu'
  | 'brand'
  | 'hero'
  | 'activities'
  | 'camp'
  | 'gallery';

const BUILT_IN_IMAGES: { label: string; path: string }[] = [
  { label: 'Sepu Badi', path: '/src/assets/images/sepu_badi_himachali_1795607023254.jpg' },
  { label: 'Aloo Palda (Himachali Kadi)', path: '/src/assets/images/aloo_palda_kadi_1795607023802.jpg' },
  { label: 'Kangri Dham Thali', path: '/src/assets/images/kangri_dham_thali_1795607025442.jpg' },
  { label: 'Chicken Biryani Handi', path: '/src/assets/images/chicken_biryani_handi_1795607024758.jpg' },
  { label: 'Desi Aloo Parantha', path: '/src/assets/images/desi_aloo_parantha_1795607022420.jpg' },
  { label: 'Veg Momos Steamer', path: '/src/assets/images/veg_momos_steamer_1795607024798.jpg' },
  { label: 'Hakka Noodles Wok', path: '/src/assets/images/hakka_noodles_wok_1795607024943.jpg' },
  { label: 'Paneer & Dal Curry', path: '/src/assets/images/indian_paneer_dal_curry_1795607029536.jpg' },
  { label: 'Kadai / Butter Chicken', path: '/src/assets/images/kadai_butter_chicken_1795607095505.jpg' },
  { label: 'Burger & Sandwich', path: '/src/assets/images/cafe_burger_sandwich_1795607037602.jpg' },
  { label: 'Cold Coffee & Shakes', path: '/src/assets/images/cold_coffee_oreo_shake_1795607131724.jpg' },
  { label: 'Fruit Chaat & Salad', path: '/src/assets/images/fresh_fruit_chaat_salad_1795607030980.jpg' },
  { label: 'Creamy Penne Pasta', path: '/src/assets/images/creamy_penne_pasta_1795607201800.jpg' },
  { label: 'Fried Rice & Tudkiya Bhath', path: '/src/assets/images/masala_fried_rice_1795607198321.jpg' },
  { label: 'Kheer Pudding', path: '/src/assets/images/kheer_pudding_1795607197472.jpg' },
  { label: 'Wood-Fired Pizza', path: '/src/assets/images/wood_fired_mountain_pizza_1795578020767.jpg' },
  { label: 'Himalayan Masala Chai', path: '/src/assets/images/himalayan_masala_chai_1795578017697.jpg' },
  { label: 'Hot Coffee / Chocolate', path: '/src/assets/images/spiced_hot_chocolate_1795578022453.jpg' },
  { label: 'Babru / Pahadi Siddu', path: '/src/assets/images/pahadi_siddu_ghee_1795578019524.jpg' },
  { label: 'Fish Fry / Trout', path: '/src/assets/images/herb_crusted_trout_panini_1795578024240.jpg' },
  { label: 'Cottage Night Exterior', path: '/assets/aistudio/made_the_time_to_night_34850f7f_2K_63170625.png' },
  { label: 'Cottage Sunset Exterior', path: '/assets/aistudio/Change_tree_to_dried_tree_a247d845_2K_6724f2bf.png' },
  { label: 'Pine-Wood Interior Lights', path: '/assets/aistudio/WhatsApp_Image_2026-11-24_at_8.05.17_PM_2faf1c54.jpeg' },
  { label: 'Stone Bonfire Circle', path: '/assets/aistudio/Gemini_Generated_Image_fjx62qfjx62qfjx6_cdd48c70.png' },
  { label: 'Alpine Tents on Ridge', path: '/assets/aistudio/WhatsApp_Image_2026-11-24_at_8.05.19_PM_c49a41b5.jpeg' },
  { label: 'Trekking & Ridge Tents', path: '/assets/aistudio/WhatsApp_Image_2026-11-24_at_3.30.08_AM_2b01e3eb.jpeg' },
  { label: 'Meadow Chess & Rugs', path: '/assets/aistudio/WhatsApp_Image_2026-11-24_at_3.20.40_AM_a978fa96.jpeg' },
  { label: 'Tree Dartboard & Flags', path: '/assets/aistudio/WhatsApp_Image_2026-11-24_at_3.20.39_AM_40533dea.jpeg' },
  { label: 'Walnut Tree Signposts', path: '/assets/aistudio/WhatsApp_Image_2026-11-24_at_3.20.37_AM_92d8b47b.jpeg' },
  { label: 'Golden Hamsa Logo', path: '/assets/aistudio/Golden_Hamsa_Ornamental_Emblem_41825533.png' },
];

const ADMIN_PIN_STORAGE_KEY = 'walnut_garden_admin_pin_v1';
const DEFAULT_ADMIN_PIN = '1850';

interface ImageFieldEditorProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
}

const ImageFieldEditor: React.FC<ImageFieldEditorProps> = ({
  label,
  value,
  onChange,
}) => {
  const [showLibrary, setShowLibrary] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <div className="w-16 h-12 rounded-lg bg-[#0C0A09] border border-[#F5EFE6]/15 overflow-hidden shrink-0 flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt={label}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-4 h-4 text-[#C8BFA8]/40" />
          )}
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/src/assets/images/... or https://..."
          className="flex-1 px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
        />

        <label className="px-3 py-2 text-[11px] tracking-[0.14em] uppercase bg-[#1C1815] border border-[#F5EFE6]/15 text-[#F5EFE6] rounded hover:border-[#D4AF37] transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0">
          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={() => setShowLibrary((prev) => !prev)}
          className="px-3 py-2 text-[11px] tracking-[0.14em] uppercase bg-[#1C1815] border border-[#D4AF37]/35 text-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-[#0C0A09] transition-colors cursor-pointer shrink-0"
        >
          {showLibrary ? 'Hide Photos' : 'Library'}
        </button>
      </div>

      {showLibrary && (
        <div
          data-lenis-prevent
          className="p-3 rounded-lg bg-[#0C0A09] border border-[#F5EFE6]/15 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto overscroll-contain"
        >
          {BUILT_IN_IMAGES.map((img) => {
            const active = value === img.path;
            return (
              <button
                key={img.path}
                type="button"
                onClick={() => {
                  onChange(img.path);
                  setShowLibrary(false);
                }}
                className={`group text-left rounded overflow-hidden border transition-all cursor-pointer ${
                  active
                    ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                    : 'border-[#F5EFE6]/10 hover:border-[#D4AF37]/60'
                }`}
              >
                <div className="aspect-[4/3] w-full bg-[#14110F] overflow-hidden">
                  <img
                    src={img.path}
                    alt={img.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="block px-1.5 py-1 text-[9px] text-[#C8BFA8] truncate">
                  {img.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');
  const [draft, setDraft] = useState<typeof siteContent>(() =>
    JSON.parse(JSON.stringify(siteContent))
  );

  // Menu tab filters
  const [dishSearch, setDishSearch] = useState('');
  const [dishCategoryFilter, setDishCategoryFilter] = useState('All');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  // Sync draft with live siteContent whenever portal opens
  useEffect(() => {
    if (isOpen) {
      setDraft(JSON.parse(JSON.stringify(siteContent)));
      setConfirmReset(false);
      setPinError('');
    }
  }, [isOpen]);

  // Body & HTML scroll lock & Escape handler
  useEffect(() => {
    if (!isOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const getStoredPin = () => {
    if (typeof window === 'undefined') return DEFAULT_ADMIN_PIN;
    return window.localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || DEFAULT_ADMIN_PIN;
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === getStoredPin()) {
      setIsUnlocked(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect PIN. Default Walnut Garden PIN is 1850.');
    }
  };

  const handleSaveAll = () => {
    saveSiteContent(draft);
    onShowToast('All changes saved and applied to Walnut Garden live!');
  };

  const handleResetDefaults = () => {
    resetSiteContent();
    setDraft(JSON.parse(JSON.stringify(siteContent)));
    setConfirmReset(false);
    onShowToast('Restored all texts, dishes, prices, and images to defaults');
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'walnut-garden-content.json';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported siteContent JSON backup');
  };

  // Menu Dish Helpers
  const handleAddDish = () => {
    const defaultCategory =
      dishCategoryFilter !== 'All' && dishCategoryFilter !== 'Bestsellers'
        ? dishCategoryFilter
        : draft.bestsellers.categories[1] || 'Himachali Special';

    const newDish = {
      id: `dish-${Date.now()}`,
      name: 'New Mountain Dish',
      category: defaultCategory,
      price: 250,
      bestseller: true,
      tag: 'Chef Special',
      description: 'Freshly prepared in our Palampur mountain kitchen.',
      image: '/src/assets/images/sepu_badi_himachali_1795607023254.jpg',
    };

    setDraft((prev) => ({
      ...prev,
      bestsellers: {
        ...prev.bestsellers,
        items: [newDish, ...prev.bestsellers.items],
      },
    }));
    onShowToast('Added new dish at top of list — edit details & click Save');
  };

  const handleUpdateDish = (
    dishId: string,
    field: string,
    value: string | number | boolean
  ) => {
    setDraft((prev) => ({
      ...prev,
      bestsellers: {
        ...prev.bestsellers,
        items: prev.bestsellers.items.map((item) =>
          item.id === dishId ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleDeleteDish = (dishId: string) => {
    setDraft((prev) => ({
      ...prev,
      bestsellers: {
        ...prev.bestsellers,
        items: prev.bestsellers.items.filter((item) => item.id !== dishId),
      },
    }));
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (draft.bestsellers.categories.includes(trimmed)) return;
    setDraft((prev) => ({
      ...prev,
      bestsellers: {
        ...prev.bestsellers,
        categories: [...prev.bestsellers.categories, trimmed],
      },
    }));
    setNewCategoryName('');
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setDraft((prev) => ({
      ...prev,
      bestsellers: {
        ...prev.bestsellers,
        categories: prev.bestsellers.categories.filter((c) => c !== catToRemove),
      },
    }));
  };

  const filteredDishes = draft.bestsellers.items.filter((item) => {
    const matchesSearch =
      dishSearch.trim() === '' ||
      item.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(dishSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(dishSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (dishCategoryFilter === 'All') return true;
    if (dishCategoryFilter === 'Bestsellers') return Boolean(item.bestseller);
    return item.category === dishCategoryFilter;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-label="Walnut Garden Admin Portal"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-6xl h-[90vh] rounded-2xl bg-[#120F0D] border border-[#D4AF37]/40 text-[#F5EFE6] shadow-[0_32px_100px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden overscroll-contain"
          >
            {/* Top Portal Bar */}
            <div className="px-5 sm:px-7 py-4 border-b border-[#F5EFE6]/10 bg-[#161311] flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                  {isUnlocked ? (
                    <Unlock className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </span>
                <div>
                  <span className="text-[10px] tracking-[0.26em] uppercase text-[#D4AF37] block">
                    WALNUT GARDEN · CONTENT & MENU CMS
                  </span>
                  <h2 className="font-serif-display text-xl sm:text-2xl text-[#F5EFE6] font-normal">
                    Admin Management Portal
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {isUnlocked && (
                  <>
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] tracking-[0.16em] uppercase bg-[#1C1815] border border-[#F5EFE6]/15 text-[#C8BFA8] rounded hover:border-[#D4AF37] hover:text-[#F5EFE6] transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Export JSON</span>
                    </button>

                    {!confirmReset ? (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] tracking-[0.16em] uppercase bg-[#1C1815] border border-[#F5EFE6]/15 text-[#C8BFA8] rounded hover:border-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] tracking-[0.16em] uppercase bg-red-900/60 border border-red-400 text-red-100 rounded hover:bg-red-800 transition-colors cursor-pointer"
                      >
                        <span>Confirm Reset?</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.18em] uppercase font-semibold bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Apply Live</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Admin Portal"
                  className="w-9 h-9 rounded-full bg-[#1C1815] border border-[#F5EFE6]/15 flex items-center justify-center text-[#C8BFA8] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body: Lock Screen vs Unlocked CMS */}
            {!isUnlocked ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <form
                  onSubmit={handleUnlockSubmit}
                  className="max-w-md w-full p-8 rounded-2xl bg-[#161311] border border-[#D4AF37]/30 text-center space-y-5"
                >
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.26em] uppercase text-[#D4AF37] mb-1">
                      OWNER & MANAGER ACCESS
                    </p>
                    <h3 className="font-serif-display text-3xl text-[#F5EFE6]">
                      Unlock Admin Portal
                    </h3>
                    <p className="text-xs text-[#C8BFA8]/80 font-light mt-1.5">
                      Enter the manager PIN to edit menu dishes, prices, photos, hero scenes, activities, and camp packages. (Default PIN: <span className="text-[#D4AF37] font-mono-tabular">1850</span>)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="password"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Enter PIN (1850)"
                      autoFocus
                      className="w-full px-4 py-3 text-center font-mono-tabular text-lg tracking-[0.3em] bg-[#0C0A09] border border-[#F5EFE6]/20 rounded-lg text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                    />
                    {pinError && (
                      <p className="text-xs text-amber-400">{pinError}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 text-xs tracking-[0.22em] uppercase font-semibold bg-[#D4AF37] text-[#0C0A09] rounded-lg hover:bg-[#e3be42] transition-colors cursor-pointer"
                    >
                      Unlock Portal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUnlocked(true);
                        setPinError('');
                      }}
                      className="px-4 py-3 text-xs tracking-[0.18em] uppercase border border-[#D4AF37]/40 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/15 transition-colors cursor-pointer"
                    >
                      Quick Unlock
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
                {/* Sidebar Tabs */}
                <aside
                  data-lenis-prevent
                  className="lg:w-60 border-b lg:border-b-0 lg:border-r border-[#F5EFE6]/10 bg-[#14110F] p-3 sm:p-4 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto overscroll-contain shrink-0"
                >
                  {[
                    {
                      id: 'menu' as AdminTab,
                      label: `Menu & Dishes (${draft.bestsellers.items.length})`,
                      icon: Utensils,
                    },
                    {
                      id: 'brand' as AdminTab,
                      label: 'Brand & Contact',
                      icon: Building2,
                    },
                    {
                      id: 'hero' as AdminTab,
                      label: 'Hero & Marquee',
                      icon: Sparkles,
                    },
                    {
                      id: 'activities' as AdminTab,
                      label: 'Activities & Music',
                      icon: Compass,
                    },
                    {
                      id: 'camp' as AdminTab,
                      label: 'Camp & Pricing',
                      icon: Tent,
                    },
                    {
                      id: 'gallery' as AdminTab,
                      label: 'Gallery, Postcards & Story',
                      icon: BookOpen,
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs tracking-[0.14em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#D4AF37] text-[#0C0A09] font-semibold'
                            : 'text-[#C8BFA8] hover:text-[#F5EFE6] hover:bg-[#1C1815]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </aside>

                {/* Main Tab Content Area */}
                <div
                  data-lenis-prevent
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-8"
                >
                  {/* ================= TAB 1: MENU & DISHES ================= */}
                  {activeTab === 'menu' && (
                    <div className="space-y-8">
                      {/* Menu Section Headings & Notes */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Menu Headings & Kitchen Note
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Menu Kicker
                            </label>
                            <input
                              type="text"
                              value={draft.bestsellers.kicker}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  bestsellers: {
                                    ...prev.bestsellers,
                                    kicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Menu Heading (wrap *words* for gold italic)
                            </label>
                            <input
                              type="text"
                              value={draft.bestsellers.heading}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  bestsellers: {
                                    ...prev.bestsellers,
                                    heading: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                            Menu Subtext
                          </label>
                          <input
                            type="text"
                            value={draft.bestsellers.subtext}
                            onChange={(e) =>
                              setDraft((prev) => ({
                                ...prev,
                                bestsellers: {
                                  ...prev.bestsellers,
                                  subtext: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                            Weekend & Kitchen Note
                          </label>
                          <textarea
                            rows={2}
                            value={draft.bestsellers.weekendNote}
                            onChange={(e) =>
                              setDraft((prev) => ({
                                ...prev,
                                bestsellers: {
                                  ...prev.bestsellers,
                                  weekendNote: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                          />
                        </div>
                      </div>

                      {/* Menu Categories Manager */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                            Menu Categories
                          </h3>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="New category name..."
                              className="px-3 py-1.5 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                            <button
                              type="button"
                              onClick={handleAddCategory}
                              className="px-3 py-1.5 text-xs tracking-[0.16em] uppercase bg-[#D4AF37] text-[#0C0A09] font-medium rounded hover:bg-[#e3be42] cursor-pointer"
                            >
                              Add Category
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {draft.bestsellers.categories.map((cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#C8BFA8]"
                            >
                              <span>{cat}</span>
                              {cat !== 'Bestsellers' && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCategory(cat)}
                                  aria-label={`Remove ${cat}`}
                                  className="text-[#C8BFA8]/50 hover:text-red-400 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Dishes Toolbar: Search, Category Filter & Add New Dish */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3 flex-1">
                          <div className="relative w-full sm:w-64">
                            <Search className="w-3.5 h-3.5 text-[#C8BFA8]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={dishSearch}
                              onChange={(e) => setDishSearch(e.target.value)}
                              placeholder="Filter dishes by name..."
                              className="w-full pl-9 pr-3 py-2 text-xs bg-[#161311] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>

                          <select
                            value={dishCategoryFilter}
                            onChange={(e) => setDishCategoryFilter(e.target.value)}
                            className="px-3 py-2 text-xs bg-[#161311] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                          >
                            <option value="All">
                              All Categories ({draft.bestsellers.items.length})
                            </option>
                            {draft.bestsellers.categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddDish}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.18em] uppercase font-semibold bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Dish</span>
                        </button>
                      </div>

                      {/* Dishes List Editor */}
                      <div className="space-y-4">
                        {filteredDishes.map((dish) => (
                          <div
                            key={dish.id}
                            className="p-4 sm:p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 hover:border-[#D4AF37]/35 transition-colors space-y-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                              {/* Dish Name */}
                              <div className="md:col-span-4">
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                  Dish Name
                                </label>
                                <input
                                  type="text"
                                  value={dish.name}
                                  onChange={(e) =>
                                    handleUpdateDish(dish.id, 'name', e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6] font-medium"
                                />
                              </div>

                              {/* Price */}
                              <div className="md:col-span-2">
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                  Price (₹)
                                </label>
                                <input
                                  type="number"
                                  value={dish.price}
                                  onChange={(e) =>
                                    handleUpdateDish(
                                      dish.id,
                                      'price',
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-3 py-2 text-xs font-mono-tabular bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#D4AF37]"
                                />
                              </div>

                              {/* Category */}
                              <div className="md:col-span-3">
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                  Category
                                </label>
                                <select
                                  value={dish.category}
                                  onChange={(e) =>
                                    handleUpdateDish(dish.id, 'category', e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                                >
                                  {draft.bestsellers.categories
                                    .filter((c) => c !== 'Bestsellers')
                                    .map((cat) => (
                                      <option key={cat} value={cat}>
                                        {cat}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              {/* Tag & Bestseller + Delete */}
                              <div className="md:col-span-3 flex items-end gap-2">
                                <div className="flex-1">
                                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                    Badge / Tag
                                  </label>
                                  <input
                                    type="text"
                                    value={dish.tag}
                                    onChange={(e) =>
                                      handleUpdateDish(dish.id, 'tag', e.target.value)
                                    }
                                    className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateDish(
                                      dish.id,
                                      'bestseller',
                                      !dish.bestseller
                                    )
                                  }
                                  title="Toggle Bestseller highlight"
                                  className={`p-2 rounded border transition-colors cursor-pointer ${
                                    dish.bestseller
                                      ? 'bg-[#D4AF37] text-[#0C0A09] border-[#D4AF37]'
                                      : 'bg-[#0C0A09] text-[#C8BFA8]/50 border-[#F5EFE6]/15'
                                  }`}
                                >
                                  <Star className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteDish(dish.id)}
                                  title="Delete dish"
                                  className="p-2 rounded bg-[#0C0A09] border border-[#F5EFE6]/15 text-[#C8BFA8] hover:border-red-400 hover:text-red-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Dish Description (Shown on Full Menu Page)
                              </label>
                              <input
                                type="text"
                                value={dish.description}
                                onChange={(e) =>
                                  handleUpdateDish(
                                    dish.id,
                                    'description',
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#C8BFA8]"
                              />
                            </div>

                            {/* Image Picker / Upload */}
                            <ImageFieldEditor
                              label="Dish Photograph"
                              value={dish.image}
                              onChange={(newUrl) =>
                                handleUpdateDish(dish.id, 'image', newUrl)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ================= TAB 2: BRAND & CONTACT ================= */}
                  {activeTab === 'brand' && (
                    <div className="space-y-8">
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Brand Identity & Logos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Brand Name
                            </label>
                            <input
                              type="text"
                              value={draft.brand.name}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  brand: { ...prev.brand, name: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Tagline
                            </label>
                            <input
                              type="text"
                              value={draft.brand.tagline}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  brand: { ...prev.brand, tagline: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Motto
                            </label>
                            <input
                              type="text"
                              value={draft.brand.motto}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  brand: { ...prev.brand, motto: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Building Sign Banner
                            </label>
                            <input
                              type="text"
                              value={draft.brand.buildingSign}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  brand: {
                                    ...prev.brand,
                                    buildingSign: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>

                        <ImageFieldEditor
                          label="Brand Emblem Logo"
                          value={draft.brand.logo}
                          onChange={(url) =>
                            setDraft((prev) => ({
                              ...prev,
                              brand: { ...prev.brand, logo: url },
                            }))
                          }
                        />

                        <ImageFieldEditor
                          label="Printed Menu Card Scan"
                          value={draft.brand.menuCardImage}
                          onChange={(url) =>
                            setDraft((prev) => ({
                              ...prev,
                              brand: { ...prev.brand, menuCardImage: url },
                            }))
                          }
                        />
                      </div>

                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          WhatsApp, Contact & Location Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              WhatsApp Number (Country code + digits, e.g. 919876543210)
                            </label>
                            <input
                              type="text"
                              value={draft.contact.whatsappNumber}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    whatsappNumber: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs font-mono-tabular bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Display Phone Number
                            </label>
                            <input
                              type="text"
                              value={draft.contact.phoneDisplay}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    phoneDisplay: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Email Address
                            </label>
                            <input
                              type="text"
                              value={draft.contact.email}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    email: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Opening Hours
                            </label>
                            <input
                              type="text"
                              value={draft.contact.openingHours}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    openingHours: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Physical Address
                            </label>
                            <input
                              type="text"
                              value={draft.contact.address}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    address: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Instagram Handle
                            </label>
                            <input
                              type="text"
                              value={draft.contact.instagramHandle}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    instagramHandle: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Google Maps URL
                            </label>
                            <input
                              type="text"
                              value={draft.contact.mapUrl}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  contact: {
                                    ...prev.contact,
                                    mapUrl: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================= TAB 3: HERO & MARQUEE ================= */}
                  {activeTab === 'hero' && (
                    <div className="space-y-8">
                      {/* 1. Hero Keyframe Photographs */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Hero Keyframe Photographs (165-Frame Walk-In)
                        </h3>
                        <ImageFieldEditor
                          label="1st Hero Image (Outside Cottage)"
                          value={draft.hero.keyframeAnchors.landscape[0] || ''}
                          onChange={(url) =>
                            setDraft((prev) => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                keyframeAnchors: {
                                  landscape: [
                                    url,
                                    prev.hero.keyframeAnchors.landscape[1],
                                  ],
                                  portrait: [
                                    url,
                                    prev.hero.keyframeAnchors.portrait[1],
                                  ],
                                },
                              },
                            }))
                          }
                        />
                        <ImageFieldEditor
                          label="2nd Hero Image (Inside Pine-Wood Booths)"
                          value={draft.hero.keyframeAnchors.landscape[1] || ''}
                          onChange={(url) =>
                            setDraft((prev) => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                keyframeAnchors: {
                                  landscape: [
                                    prev.hero.keyframeAnchors.landscape[0],
                                    url,
                                  ],
                                  portrait: [
                                    prev.hero.keyframeAnchors.portrait[0],
                                    url,
                                  ],
                                },
                              },
                            }))
                          }
                        />
                      </div>

                      {/* 2. Opening Hero Staggered Title & Tagline */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Opening Hero Staggered Title &amp; Tagline (Appears After Intro)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Top-Left Line 1 (e.g. WALNUT)
                            </label>
                            <input
                              type="text"
                              value={draft.hero.openingTitleLine1 || 'WALNUT'}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    openingTitleLine1: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Bottom-Right Line 2 (e.g. GARDEN)
                            </label>
                            <input
                              type="text"
                              value={draft.hero.openingTitleLine2 || 'GARDEN'}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    openingTitleLine2: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Opening Tagline (e.g. Cafe &amp; Camp)
                            </label>
                            <input
                              type="text"
                              value={draft.hero.openingTagline || 'Cafe & Camp'}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    openingTagline: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Closing Hero Finale Scene (Appears at End of Scroll Inside Cafe) */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Closing Hero Finale Scene (Appears Inside Cafe at End of Scroll)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Finale Kicker
                            </label>
                            <input
                              type="text"
                              value={
                                draft.hero.finaleKicker ||
                                'WELCOME INSIDE · PALAMPUR · 1,850M'
                              }
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    finaleKicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Finale Heading (wrap *word* for gold italic)
                            </label>
                            <input
                              type="text"
                              value={
                                draft.hero.finaleHeading || 'Good Food, *Good Mood*'
                              }
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    finaleHeading: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Finale Vibe Tagline
                            </label>
                            <input
                              type="text"
                              value={
                                draft.hero.finaleSubtext ||
                                'Steaming Chai · Himachali Kitchen · Starlit Bonfires'
                              }
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    finaleSubtext: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Primary Button Label
                            </label>
                            <input
                              type="text"
                              value={
                                draft.hero.finalePrimaryCtaLabel || 'Explore Menu'
                              }
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    finalePrimaryCtaLabel: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Secondary Button Label
                            </label>
                            <input
                              type="text"
                              value={
                                draft.hero.finaleSecondaryCtaLabel ||
                                'Book Tent & Bonfire'
                              }
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    finaleSecondaryCtaLabel: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. Intro Preloader Screen Text */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Intro Preloader Screen Text
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Preloader Top Kicker
                            </label>
                            <input
                              type="text"
                              value={draft.preloader.kicker}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  preloader: {
                                    ...prev.preloader,
                                    kicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Preloader Reveal Title
                            </label>
                            <input
                              type="text"
                              value={draft.preloader.title}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  preloader: {
                                    ...prev.preloader,
                                    title: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Preloader Bottom Subtitle
                            </label>
                            <input
                              type="text"
                              value={draft.preloader.subtitle}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  preloader: {
                                    ...prev.preloader,
                                    subtitle: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 5. Scrolling Marquee Strip Words */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-3">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Scrolling Marquee Strip Words (Comma Separated)
                        </h3>
                        <input
                          type="text"
                          value={draft.marqueeWords.join(', ')}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              marqueeWords: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }))
                          }
                          className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                        />
                      </div>
                    </div>
                  )}

                  {/* ================= TAB 4: ACTIVITIES & MUSIC ================= */}
                  {activeTab === 'activities' && (
                    <div className="space-y-8">
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Activities Section Header
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Kicker
                            </label>
                            <input
                              type="text"
                              value={draft.activities.kicker}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  activities: {
                                    ...prev.activities,
                                    kicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Heading (wrap *word* for gold italic)
                            </label>
                            <input
                              type="text"
                              value={draft.activities.heading}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  activities: {
                                    ...prev.activities,
                                    heading: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>
                      </div>

                      {draft.activities.items.map((act, idx) => (
                        <div
                          key={act.id}
                          className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4"
                        >
                          <span className="text-[10px] font-mono-tabular tracking-[0.22em] uppercase text-[#D4AF37]">
                            ACTIVITY {act.number}
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={act.title}
                                onChange={(e) => {
                                  const next = [...draft.activities.items];
                                  next[idx] = { ...next[idx], title: e.target.value };
                                  setDraft((prev) => ({
                                    ...prev,
                                    activities: { ...prev.activities, items: next },
                                  }));
                                }}
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Category Subtitle
                              </label>
                              <input
                                type="text"
                                value={act.category}
                                onChange={(e) => {
                                  const next = [...draft.activities.items];
                                  next[idx] = {
                                    ...next[idx],
                                    category: e.target.value,
                                  };
                                  setDraft((prev) => ({
                                    ...prev,
                                    activities: { ...prev.activities, items: next },
                                  }));
                                }}
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Button Label
                              </label>
                              <input
                                type="text"
                                value={act.ctaLabel}
                                onChange={(e) => {
                                  const next = [...draft.activities.items];
                                  next[idx] = {
                                    ...next[idx],
                                    ctaLabel: e.target.value,
                                  };
                                  setDraft((prev) => ({
                                    ...prev,
                                    activities: { ...prev.activities, items: next },
                                  }));
                                }}
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Highlights Shown on Scroll Card (Comma Separated)
                            </label>
                            <input
                              type="text"
                              value={act.highlights.join(', ')}
                              onChange={(e) => {
                                const next = [...draft.activities.items];
                                next[idx] = {
                                  ...next[idx],
                                  highlights: e.target.value
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                };
                                setDraft((prev) => ({
                                  ...prev,
                                  activities: { ...prev.activities, items: next },
                                }));
                              }}
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>

                          <ImageFieldEditor
                            label={`${act.title} Sticky Left Image`}
                            value={act.image}
                            onChange={(url) => {
                              const next = [...draft.activities.items];
                              next[idx] = { ...next[idx], image: url };
                              setDraft((prev) => ({
                                ...prev,
                                activities: { ...prev.activities, items: next },
                              }));
                            }}
                          />
                        </div>
                      ))}

                      {/* Live Acoustic Sessions Modal Editor */}
                      {draft.activities.acousticSessions && (
                        <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                          <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                            Live Acoustic Sessions Popup Modal
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Modal Kicker
                              </label>
                              <input
                                type="text"
                                value={draft.activities.acousticSessions.kicker}
                                onChange={(e) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    activities: {
                                      ...prev.activities,
                                      acousticSessions: {
                                        ...prev.activities.acousticSessions,
                                        kicker: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Modal Title
                              </label>
                              <input
                                type="text"
                                value={draft.activities.acousticSessions.title}
                                onChange={(e) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    activities: {
                                      ...prev.activities,
                                      acousticSessions: {
                                        ...prev.activities.acousticSessions,
                                        title: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Modal Subtitle
                              </label>
                              <input
                                type="text"
                                value={draft.activities.acousticSessions.subtitle}
                                onChange={(e) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    activities: {
                                      ...prev.activities,
                                      acousticSessions: {
                                        ...prev.activities.acousticSessions,
                                        subtitle: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ================= TAB 5: CAMP & PRICING ================= */}
                  {activeTab === 'camp' && (
                    <div className="space-y-8">
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Camping Section Headings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Kicker
                            </label>
                            <input
                              type="text"
                              value={draft.camp.kicker}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  camp: { ...prev.camp, kicker: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Heading (wrap *word* for gold italic)
                            </label>
                            <input
                              type="text"
                              value={draft.camp.heading}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  camp: { ...prev.camp, heading: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>
                      </div>

                      {draft.camp.options.map((opt, idx) => (
                        <div
                          key={opt.id}
                          className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4"
                        >
                          <span className="text-[10px] font-mono-tabular tracking-[0.22em] uppercase text-[#D4AF37]">
                            CAMP PACKAGE 0{idx + 1}
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Package Name
                              </label>
                              <input
                                type="text"
                                value={opt.name}
                                onChange={(e) => {
                                  const next = [...draft.camp.options];
                                  next[idx] = { ...next[idx], name: e.target.value };
                                  setDraft((prev) => ({
                                    ...prev,
                                    camp: { ...prev.camp, options: next },
                                  }));
                                }}
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Price (₹)
                              </label>
                              <input
                                type="number"
                                value={opt.price}
                                onChange={(e) => {
                                  const next = [...draft.camp.options];
                                  next[idx] = {
                                    ...next[idx],
                                    price: Number(e.target.value) || 0,
                                  };
                                  setDraft((prev) => ({
                                    ...prev,
                                    camp: { ...prev.camp, options: next },
                                  }));
                                }}
                                className="w-full px-3 py-2 text-xs font-mono-tabular bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#D4AF37]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Price Unit
                              </label>
                              <input
                                type="text"
                                value={opt.unit}
                                onChange={(e) => {
                                  const next = [...draft.camp.options];
                                  next[idx] = { ...next[idx], unit: e.target.value };
                                  setDraft((prev) => ({
                                    ...prev,
                                    camp: { ...prev.camp, options: next },
                                  }));
                                }}
                                className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Subtitle / Timing
                            </label>
                            <input
                              type="text"
                              value={opt.subtitle}
                              onChange={(e) => {
                                const next = [...draft.camp.options];
                                next[idx] = {
                                  ...next[idx],
                                  subtitle: e.target.value,
                                };
                                setDraft((prev) => ({
                                  ...prev,
                                  camp: { ...prev.camp, options: next },
                                }));
                              }}
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Primary Card Highlight (First line shown on card)
                            </label>
                            <textarea
                              rows={3}
                              value={opt.highlights.join('\n')}
                              onChange={(e) => {
                                const next = [...draft.camp.options];
                                next[idx] = {
                                  ...next[idx],
                                  highlights: e.target.value
                                    .split('\n')
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                };
                                setDraft((prev) => ({
                                  ...prev,
                                  camp: { ...prev.camp, options: next },
                                }));
                              }}
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#C8BFA8]"
                            />
                          </div>

                          <ImageFieldEditor
                            label={`${opt.name} Photo`}
                            value={opt.image}
                            onChange={(url) => {
                              const next = [...draft.camp.options];
                              next[idx] = { ...next[idx], image: url };
                              setDraft((prev) => ({
                                ...prev,
                                camp: { ...prev.camp, options: next },
                              }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ================= TAB 6: GALLERY, POSTCARDS & STORY ================= */}
                  {activeTab === 'gallery' && (
                    <div className="space-y-8">
                      {/* 1. Interactive Bento Gallery Editor (Mountain Reels & Stories) */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Mountain Reels &amp; Interactive Bento Gallery (7 Tiles)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Section Kicker
                            </label>
                            <input
                              type="text"
                              value={draft.reels.kicker}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  reels: { ...prev.reels, kicker: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Section Heading (wrap *word* for gold italic)
                            </label>
                            <input
                              type="text"
                              value={draft.reels.heading}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  reels: { ...prev.reels, heading: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>

                        {draft.reels.bentoItems.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-lg bg-[#0C0A09] border border-[#F5EFE6]/10 space-y-3"
                          >
                            <span className="text-[10px] font-mono-tabular tracking-[0.2em] uppercase text-[#D4AF37]">
                              BENTO TILE 0{idx + 1} ({idx % 2 === 0 ? 'Tall Portrait' : 'Wide Landscape'})
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                  Tile Title
                                </label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => {
                                    const next = [...draft.reels.bentoItems];
                                    next[idx] = {
                                      ...next[idx],
                                      title: e.target.value,
                                    };
                                    setDraft((prev) => ({
                                      ...prev,
                                      reels: { ...prev.reels, bentoItems: next },
                                    }));
                                  }}
                                  className="w-full px-3 py-2 text-xs bg-[#161311] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                  Lightbox Description
                                </label>
                                <input
                                  type="text"
                                  value={item.desc}
                                  onChange={(e) => {
                                    const next = [...draft.reels.bentoItems];
                                    next[idx] = {
                                      ...next[idx],
                                      desc: e.target.value,
                                    };
                                    setDraft((prev) => ({
                                      ...prev,
                                      reels: { ...prev.reels, bentoItems: next },
                                    }));
                                  }}
                                  className="w-full px-3 py-2 text-xs bg-[#161311] border border-[#F5EFE6]/15 rounded text-[#C8BFA8]"
                                />
                              </div>
                            </div>
                            <ImageFieldEditor
                              label="Bento Tile Photo"
                              value={item.url}
                              onChange={(url) => {
                                const next = [...draft.reels.bentoItems];
                                next[idx] = { ...next[idx], url };
                                setDraft((prev) => ({
                                  ...prev,
                                  reels: { ...prev.reels, bentoItems: next },
                                }));
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* 2. Postcards Editor */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Postcards Section
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Postcards Kicker
                            </label>
                            <input
                              type="text"
                              value={draft.postcards.kicker}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  postcards: {
                                    ...prev.postcards,
                                    kicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Postcards Heading
                            </label>
                            <input
                              type="text"
                              value={draft.postcards.heading}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  postcards: {
                                    ...prev.postcards,
                                    heading: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                        </div>

                        {draft.postcards.cards.map((card, idx) => (
                          <div
                            key={card.id}
                            className="p-4 rounded-lg bg-[#0C0A09] border border-[#F5EFE6]/10 space-y-3"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                  Card Title
                                </label>
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => {
                                    const next = [...draft.postcards.cards];
                                    next[idx] = {
                                      ...next[idx],
                                      title: e.target.value,
                                    };
                                    setDraft((prev) => ({
                                      ...prev,
                                      postcards: { ...prev.postcards, cards: next },
                                    }));
                                  }}
                                  className="w-full px-3 py-2 text-xs bg-[#161311] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                  Caption
                                </label>
                                <input
                                  type="text"
                                  value={card.caption}
                                  onChange={(e) => {
                                    const next = [...draft.postcards.cards];
                                    next[idx] = {
                                      ...next[idx],
                                      caption: e.target.value,
                                    };
                                    setDraft((prev) => ({
                                      ...prev,
                                      postcards: { ...prev.postcards, cards: next },
                                    }));
                                  }}
                                  className="w-full px-3 py-2 text-xs bg-[#161311] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                                Postcard Quote Message
                              </label>
                              <input
                                type="text"
                                value={card.message}
                                onChange={(e) => {
                                  const next = [...draft.postcards.cards];
                                  next[idx] = {
                                    ...next[idx],
                                    message: e.target.value,
                                  };
                                  setDraft((prev) => ({
                                    ...prev,
                                    postcards: { ...prev.postcards, cards: next },
                                  }));
                                }}
                                className="w-full px-3 py-2 text-xs bg-[#161311] border border-[#F5EFE6]/15 rounded text-[#C8BFA8]"
                              />
                            </div>
                            <ImageFieldEditor
                              label="Postcard Front Photo"
                              value={card.image}
                              onChange={(url) => {
                                const next = [...draft.postcards.cards];
                                next[idx] = { ...next[idx], image: url };
                                setDraft((prev) => ({
                                  ...prev,
                                  postcards: { ...prev.postcards, cards: next },
                                }));
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* 3. Dedicated Our Story Page Editor */}
                      <div className="p-5 rounded-xl bg-[#161311] border border-[#F5EFE6]/10 space-y-4">
                        <h3 className="font-serif-display text-2xl text-[#F5EFE6]">
                          Our Story Page Content &amp; Photos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Story Heading
                            </label>
                            <input
                              type="text"
                              value={draft.pages.story.heading}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  pages: {
                                    ...prev.pages,
                                    story: {
                                      ...prev.pages.story,
                                      heading: e.target.value,
                                    },
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#F5EFE6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-1">
                              Story Lead Paragraph
                            </label>
                            <input
                              type="text"
                              value={draft.pages.story.lead}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  pages: {
                                    ...prev.pages,
                                    story: {
                                      ...prev.pages.story,
                                      lead: e.target.value,
                                    },
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-[#0C0A09] border border-[#F5EFE6]/15 rounded text-[#C8BFA8]"
                            />
                          </div>
                        </div>

                        <ImageFieldEditor
                          label="Story Page Hero Banner Photo"
                          value={draft.pages.story.heroImage}
                          onChange={(url) =>
                            setDraft((prev) => ({
                              ...prev,
                              pages: {
                                ...prev.pages,
                                story: { ...prev.pages.story, heroImage: url },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sticky Bottom Status Bar inside Portal */}
            {isUnlocked && (
              <div className="px-5 sm:px-7 py-3 border-t border-[#F5EFE6]/10 bg-[#161311] flex items-center justify-between gap-4 text-xs text-[#C8BFA8]/80 shrink-0">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    Edits are stored in your browser and update all pages immediately when you click Save & Apply Live.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs tracking-[0.18em] uppercase font-semibold bg-[#D4AF37] text-[#0C0A09] rounded hover:bg-[#e3be42] transition-colors cursor-pointer shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Apply Live</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
