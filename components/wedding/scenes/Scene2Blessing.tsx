'use client';

import { withBasePath } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useLanguage, greetings } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import SaveTheDateCalendar from '../SaveTheDateCalendar';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

export default function Scene2Blessing({ isActive }: SceneProps) {
  const { t, language } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const weddingDate = new Date('2027-08-14T00:00:00').getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // Generate consistent positions for floating elements
  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    x: (i * 67 + 50) % 400,
    y: (i * 89 + 100) % 600,
    duration: 4 + (i % 3),
    delay: i * 0.3,
    symbol: ['💙', '✨', '🌸', '💫', '🤍', '🌟'][i],
  }));

  return (
    <div
      className="relative w-full h-full bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url('${withBasePath('/intro/lake-background.jpg')}')` }}
    >
      {/* Main content - scrolls on short phones */}
      <div className="relative z-10 h-full overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center justify-center min-h-full px-4 sm:px-8 pt-16 pb-14 text-center">
        {/* See-through panel; the white glow on the text keeps it readable over the picture */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-md bg-white/35 rounded-3xl px-4 sm:px-6 py-8 border border-white/40 [text-shadow:0_0_8px_rgba(255,255,255,0.95),0_0_2px_rgba(255,255,255,0.95)]"
        >
          {/* Monogram: E ♥ K */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="mb-5 flex items-center justify-center gap-4 font-script text-6xl text-dusty-blue leading-none">
              <span>E</span>
              <motion.span
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-rose-500 drop-shadow-sm"
              >
                <Heart size={36} fill="currentColor" strokeWidth={0} />
              </motion.span>
              <span>K</span>
            </div>
            <div className="w-24 h-px bg-dusty-blue mx-auto mb-4" />
          </motion.div>

          {/* Main text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-6"
          >
            <p className="font-body text-lg sm:text-2xl text-gray-700 leading-relaxed text-justify hyphens-none">
             {t.blessing.text}
            </p>

            {/* Invitation line in the guest's language */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="border-t border-b border-dusty-blue/30 py-4 my-6"
            >
              <p className="font-body italic text-lg sm:text-xl leading-relaxed text-[#3f6189]">
                {greetings[language]}
              </p>
       
            </motion.div>

            {/* Save-the-date calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.5, ease: 'easeOut' }}
            >
              <SaveTheDateCalendar />
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.0 }}
              className="text-center mt-8"
            >
              <h3 className="typography-formal text-lg text-gray-600 mb-4">{t.blessing.seeYouIn}</h3>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
                <motion.div 
                  className="min-w-0 bg-white/80 rounded-lg px-1 py-2.5 sm:p-3 shadow-sm border border-dusty-blue/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                >
                  <div className="font-decorative font-semibold text-xl sm:text-2xl text-dusty-blue leading-tight">{timeLeft.days}</div>
                  <div className="font-body text-gray-600 text-[11px] sm:text-xs">{t.blessing.days}</div>
                </motion.div>
                <motion.div 
                  className="min-w-0 bg-white/80 rounded-lg px-1 py-2.5 sm:p-3 shadow-sm border border-dusty-blue/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
                >
                  <div className="font-decorative font-semibold text-xl sm:text-2xl text-dusty-blue leading-tight">{timeLeft.hours}</div>
                  <div className="font-body text-gray-600 text-[11px] sm:text-xs">{t.blessing.hours}</div>
                </motion.div>
                <motion.div 
                  className="min-w-0 bg-white/80 rounded-lg px-1 py-2.5 sm:p-3 shadow-sm border border-dusty-blue/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="font-decorative font-semibold text-xl sm:text-2xl text-dusty-blue leading-tight">{timeLeft.minutes}</div>
                  <div className="font-body text-gray-600 text-[11px] sm:text-xs">{t.blessing.minutes}</div>
                </motion.div>
                <motion.div 
                  className="min-w-0 bg-white/80 rounded-lg px-1 py-2.5 sm:p-3 shadow-sm border border-dusty-blue/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
                >
                  <div className="font-decorative font-semibold text-xl sm:text-2xl text-dusty-blue leading-tight">{timeLeft.seconds}</div>
                  <div className="font-body text-gray-600 text-[11px] sm:text-xs">{t.blessing.seconds}</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        </div>

        {/* Floating elements - only render after mount */}
        {isMounted && (
          <div className="absolute inset-0 pointer-events-none">
            {floatingElements.map((element, i) => (
              <motion.div
                key={i}
                className="absolute text-dusty-blue/20 text-2xl"
                initial={{
                  x: element.x,
                  y: element.y,
                  rotate: 0,
                }}
                animate={{
                  rotate: 360,
                  y: [element.y, element.y - 20, element.y],
                }}
                transition={{
                  duration: element.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: element.delay,
                }}
              >
                {element.symbol}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
