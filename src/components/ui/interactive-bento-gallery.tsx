"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ArrowUpRight, Instagram } from 'lucide-react';


// MediaItemType defines the structure of a media item
export interface MediaItemType {
    id: number;
    type: string;
    title: string;
    desc: string;
    url: string;
    span: string;
    instagramUrl?: string;
}
// MediaItem component renders either a video or image based on item.type
const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Reference for video element
    const [isInView, setIsInView] = useState(false); // To track if video is in the viewport
    const [isBuffering, setIsBuffering] = useState(true);  // To track if video is buffering

    // Intersection Observer to detect if video is in view and play/pause accordingly
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setIsInView(entry.isIntersecting); // Set isInView to true if the video is in view
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current); // Start observing the video element
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current); // Clean up observer when component unmounts
            }
        };
    }, []);
    // Handle video play/pause based on whether the video is in view or not
    useEffect(() => {
        let mounted = true;

        const handleVideoPlay = async () => {
            if (!videoRef.current || !isInView || !mounted) return; // Don't play if video is not in view or component is unmounted

            try {
                if (videoRef.current.readyState >= 3) {
                    setIsBuffering(false);
                    await videoRef.current.play(); // Play the video if it's ready
                } else {
                    setIsBuffering(true);
                    await new Promise((resolve) => {
                        if (videoRef.current) {
                            videoRef.current.oncanplay = resolve; // Wait until the video can start playing
                        }
                    });
                    if (mounted) {
                        setIsBuffering(false);
                        await videoRef.current.play();
                    }
                }
            } catch (error) {
                console.warn("Video playback failed:", error);
            }
        };

        if (isInView) {
            handleVideoPlay();
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

        return () => {
            mounted = false;
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        };
    }, [isInView]);

    // Render either a video or image based on item.type

    if (item.type === 'video') {
        return (
            <div className={`${className} relative overflow-hidden`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onClick={onClick}
                    playsInline
                    muted
                    loop
                    preload="auto"
                    style={{
                        opacity: isBuffering ? 0.8 : 1,
                        transition: 'opacity 0.2s',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                    }}
                >
                    <source src={item.url} type="video/mp4" />
                </video>
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <img
            src={item.url} // Image source URL
            alt={item.title} // Alt text for the image
            referrerPolicy="no-referrer"
            className={`${className} object-cover cursor-pointer`} // Style the image
            onClick={onClick} // Trigger onClick when the image is clicked
            loading="lazy" // Lazy load the image for performance
            decoding="async" // Decode the image asynchronously
        />
    );
};



// GalleryModal component displays the selected media item in a modal
interface GalleryModalProps {
    selectedItem: MediaItemType;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: MediaItemType | null) => void;
    mediaItems: MediaItemType[]; // List of media items to display in the modal
}
const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
    const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });  // Track the position of the dockable panel

    if (!isOpen) return null; // Return null if the modal is not open

    return (
        <>
            {/* Main Modal */}
            <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="fixed inset-0 w-full min-h-screen bg-[#0C0A09]/92 backdrop-blur-xl 
                          rounded-none overflow-hidden z-50 flex flex-col justify-center"

            >
                {/* Main Content */}
                <div className="h-full flex flex-col">
                    <div className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedItem.id}
                                className="relative w-full aspect-[16/9] max-w-[95%] sm:max-w-[85%] md:max-w-4xl 
                                         h-auto max-h-[75vh] rounded-xl overflow-hidden shadow-2xl border border-[#D4AF37]/35 bg-[#14110F]"
                                initial={{ y: 20, scale: 0.97 }}
                                animate={{
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                        mass: 0.5
                                    }
                                }}
                                exit={{
                                    y: 20,
                                    scale: 0.97,
                                    transition: { duration: 0.15 }
                                }}
                                onClick={onClose}
                            >
                                <MediaItem item={selectedItem} className="w-full h-full object-contain bg-[#0C0A09]" onClick={onClose} />
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 
                                              bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/70 to-transparent flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                    <div>
                                        <h3 className="font-serif-display text-[#F5EFE6] text-xl sm:text-2xl md:text-3xl font-normal">
                                            {selectedItem.title}
                                        </h3>
                                        <p className="text-[#C8BFA8] text-xs sm:text-sm mt-1 max-w-xl font-light">
                                            {selectedItem.desc}
                                        </p>
                                    </div>
                                    {selectedItem.instagramUrl && (
                                        <a
                                            href={selectedItem.instagramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.2em] uppercase bg-[#D4AF37] text-[#0C0A09] font-medium rounded hover:bg-[#e3be42] transition-colors shrink-0"
                                        >
                                            <Instagram className="w-3.5 h-3.5" />
                                            <span>Open Reel</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Close Button */}
                <motion.button
                    className="absolute top-5 right-5 sm:top-7 sm:right-8 
                              p-3 rounded-full bg-[#14110F] border border-[#D4AF37]/40 text-[#F5EFE6] hover:bg-[#D4AF37] hover:text-[#0C0A09] 
                              text-xs sm:text-sm backdrop-blur-sm cursor-pointer"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X className='w-4 h-4' />
                </motion.button>

            </motion.div>

            {/* Draggable Dock */}
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                initial={false}
                animate={{ x: dockPosition.x, y: dockPosition.y }}
                onDragEnd={(_, info) => {
                    setDockPosition(prev => ({
                        x: prev.x + info.offset.x,
                        y: prev.y + info.offset.y
                    }));
                }}
                className="fixed z-[60] left-1/2 bottom-6 -translate-x-1/2 touch-none"
            >
                <motion.div
                    className="relative rounded-xl bg-[#14110F]/90 backdrop-blur-xl 
                             border border-[#D4AF37]/40 shadow-2xl
                             cursor-grab active:cursor-grabbing"
                >
                    <div className="flex items-center -space-x-2 px-3.5 py-2.5">
                        {mediaItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                }}
                                style={{
                                    zIndex: selectedItem.id === item.id ? 30 : mediaItems.length - index,
                                }}
                                className={`
                                    relative group
                                    w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex-shrink-0 
                                    rounded-lg overflow-hidden 
                                    cursor-pointer hover:z-20
                                    ${selectedItem.id === item.id
                                        ? 'ring-2 ring-[#D4AF37] shadow-lg'
                                        : 'hover:ring-2 hover:ring-[#D4AF37]/50'}
                                `}
                                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                                animate={{
                                    scale: selectedItem.id === item.id ? 1.2 : 1,
                                    rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                                    y: selectedItem.id === item.id ? -8 : 0,
                                }}
                                whileHover={{
                                    scale: 1.3,
                                    rotate: 0,
                                    y: -10,
                                    transition: { type: "spring", stiffness: 400, damping: 25 }
                                }}
                            >
                                <MediaItem item={item} className="w-full h-full" onClick={() => setSelectedItem(item)} />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
                                {selectedItem.id === item.id && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute -inset-2 bg-[#D4AF37]/30 blur-xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};



// Interlocking 4-column desktop bento puzzle slot shapes (3+4+3+4+3+4+3 = 24 cells = 4x6 grid)
const BENTO_SLOT_SPANS = [
    "col-span-1 row-span-3",
    "col-span-2 row-span-2",
    "col-span-1 row-span-3",
    "col-span-2 row-span-2",
    "col-span-1 row-span-3",
    "col-span-2 row-span-2",
    "col-span-1 row-span-3",
];

interface InteractiveBentoGalleryProps {
    mediaItems: MediaItemType[]
    title?: string
    description?: string
}

const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({ mediaItems, title, description }) => {
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
    const [items, setItems] = useState(mediaItems);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setItems(mediaItems);
    }, [mediaItems]);

    return (
        <div className="w-full">
            {(title || description) && (
                <div className="mb-8 text-center">
                    {title && (
                        <motion.h3
                            className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-normal text-[#F5EFE6]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {title}
                        </motion.h3>
                    )}
                    {description && (
                        <motion.p
                            className="mt-2 text-xs sm:text-sm tracking-[0.14em] uppercase text-[#D4AF37]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {description}
                        </motion.p>
                    )}
                </div>
            )}
            <AnimatePresence mode="wait">
                {selectedItem ? (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen={true}
                        onClose={() => setSelectedItem(null)}
                        setSelectedItem={setSelectedItem}
                        mediaItems={items}
                    />
                ) : (
                    <motion.div
                        className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-3.5 auto-rows-[52px] sm:auto-rows-[68px] md:auto-rows-[76px]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.07 }
                            }
                        }}
                    >
                        {items.map((item, index) => {
                            const slotSpan = BENTO_SLOT_SPANS[index % BENTO_SLOT_SPANS.length];

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    layoutId={`media-${item.id}`}
                                    className={`group relative overflow-hidden rounded-lg sm:rounded-xl cursor-grab active:cursor-grabbing bg-[#14110F] border border-[#F5EFE6]/15 hover:border-[#D4AF37]/70 transition-colors select-none ${slotSpan}`}
                                    onClick={() => !isDragging && setSelectedItem(item)}
                                    variants={{
                                        hidden: { y: 36, scale: 0.92, opacity: 0 },
                                        visible: {
                                            y: 0,
                                            scale: 1,
                                            opacity: 1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 360,
                                                damping: 26,
                                                delay: index * 0.04
                                            }
                                        }
                                    }}
                                    whileHover={{
                                        scale: 1.025,
                                        boxShadow: "0 16px 38px rgba(0,0,0,0.75), 0 0 22px rgba(212,175,55,0.22)",
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    whileDrag={{
                                        scale: 1.08,
                                        rotate: index % 2 === 0 ? 2.5 : -2.5,
                                        zIndex: 40,
                                        boxShadow: "0 24px 54px rgba(0,0,0,0.9), 0 0 32px rgba(212,175,55,0.45)",
                                    }}
                                    transition={{
                                        layout: { type: "spring", stiffness: 380, damping: 28 }
                                    }}
                                    drag
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    dragElastic={0.85}
                                    onDragStart={() => setIsDragging(true)}
                                    onDragEnd={(_, info) => {
                                        setTimeout(() => setIsDragging(false), 60);
                                        const dx = info.offset.x;
                                        const dy = info.offset.y;
                                        const distance = Math.hypot(dx, dy);

                                        if (distance > 28) {
                                            const newItems = [...items];
                                            const draggedItem = newItems[index];
                                            // Determine directional step across the 4-column bento mosaic
                                            let step = 0;
                                            if (Math.abs(dx) >= Math.abs(dy)) {
                                                step = dx > 0 ? 1 : -1;
                                            } else {
                                                step = dy > 0 ? 2 : -2;
                                            }
                                            const targetIndex = Math.max(
                                                0,
                                                Math.min(items.length - 1, index + step)
                                            );
                                            if (targetIndex !== index) {
                                                newItems.splice(index, 1);
                                                newItems.splice(targetIndex, 0, draggedItem);
                                                setItems(newItems);
                                            }
                                        }
                                    }}
                                >
                                    <MediaItem
                                        item={item}
                                        className="absolute inset-0 w-full h-full pointer-events-none"
                                        onClick={() => !isDragging && setSelectedItem(item)}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/90 via-[#0C0A09]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />
                                    <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3.5 md:p-4 pointer-events-none">
                                        <h3 className="relative font-serif-display text-[#F5EFE6] text-[11px] sm:text-base md:text-xl font-normal leading-tight line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                                            {item.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default InteractiveBentoGallery
