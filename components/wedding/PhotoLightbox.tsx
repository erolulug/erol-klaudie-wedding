'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface LightboxPhoto {
  src: string;
  alt: string;
  caption?: string;
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  index: number | null;
  onChange: (index: number | null) => void;
}

// Full-screen photo viewer. Rendered in a portal so its taps and swipes
// don't reach the story's own scene navigation.
export default function PhotoLightbox({ photos, index, onChange }: PhotoLightboxProps) {
  const { t } = useLanguage();
  const touchStartX = useRef<number | null>(null);
  const isOpen = index !== null;

  const close = () => onChange(null);
  const show = (next: number) => onChange((next + photos.length) % photos.length);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (typeof document === 'undefined') return null;

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const photo = isOpen ? photos[index] : null;

  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[70] bg-black/90 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            stop(e);
            close();
          }}
          onTouchStart={(e) => {
            stop(e);
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            stop(e);
            const startX = touchStartX.current;
            const endX = e.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (startX === null || endX === undefined) return;
            const dx = endX - startX;
            if (Math.abs(dx) > 50) {
              e.preventDefault(); // a swipe, not a tap - don't close
              show(dx < 0 ? index! + 1 : index! - 1);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              className="max-w-[92vw] max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={stop}
              draggable={false}
            />
          </AnimatePresence>

          <p className="mt-4 px-6 text-center text-white/90 font-serif italic text-sm">
            {photo.caption}
            <span className="ml-3 not-italic text-white/50 text-xs">
              {index! + 1} / {photos.length}
            </span>
          </p>

          <button
            onClick={(e) => {
              stop(e);
              close();
            }}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            title={t.gallery.close}
            aria-label={t.gallery.close}
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              stop(e);
              show(index! - 1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            title={t.story.back}
            aria-label={t.story.back}
          >
            <ChevronLeft size={26} />
          </button>

          <button
            onClick={(e) => {
              stop(e);
              show(index! + 1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            title={t.story.next}
            aria-label={t.story.next}
          >
            <ChevronRight size={26} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
