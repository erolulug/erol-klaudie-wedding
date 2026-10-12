'use client';

import { withBasePath } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

export default function Scene1Envelope({ onNext }: SceneProps) {
  const { t } = useLanguage();
  const [isOpened, setIsOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCardClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent container
    
    if (isProcessing || isOpened) return; // Prevent double clicks
    
    setIsProcessing(true);
    setIsOpened(true);
    
    // Proceed to next scene after opening animation completes
    setTimeout(() => {
      onNext();
    }, 3000);
  };

  // Falling hearts, spread across the full width (deterministic to avoid hydration mismatch)
  const hearts = Array.from({ length: 22 }, (_, i) => ({
    left: (i * 37 + 7) % 100, // % of screen width
    size: 10 + ((i * 7) % 4) * 4, // 10-22px
    sway: i % 2 === 0 ? 20 : -20,
    delay: (i * 0.45) % 6,
    duration: 6 + (i % 4),
    color: ['text-rose-400', 'text-pink-300', 'text-rose-500', 'text-red-400'][i % 4],
    opacity: 0.55 + (i % 3) * 0.15,
  }));

  const handleBackgroundClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent parent navigation when clicking on background
    e.stopPropagation();
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: `url('${withBasePath('/images/IMG_3760.jpg')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onClick={handleBackgroundClick}
      onTouchEnd={handleBackgroundClick}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Falling hearts - only render after mount to avoid hydration mismatch */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none">
          {hearts.map((heart, i) => (
            <motion.div
              key={i}
              className={`absolute top-0 ${heart.color}`}
              style={{ left: `${heart.left}%`, opacity: heart.opacity }}
              initial={{ y: -30, x: 0, rotate: -15 }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 30,
                x: [0, heart.sway, 0, -heart.sway, 0],
                rotate: [-15, 15, -15],
              }}
              transition={{
                duration: heart.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: heart.delay,
              }}
            >
              <Heart size={heart.size} fill="currentColor" strokeWidth={0} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
        {!isOpened ? (
          /* Closed Invitation Card */
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 0 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCardClick}
            onTouchEnd={handleCardClick}
            style={{ perspective: '1000px' }}
          >
            {/* Invitation Card - Closed State */}
            <motion.div
              className="w-80 h-96 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-2xl relative overflow-hidden border border-gray-200"
              animate={isOpened ? { rotateY: -180 } : { rotateY: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of the card */}
              <div className="absolute inset-0 backface-hidden">
                {/* Decorative border */}
                <div className="absolute inset-4 border-2 border-dusty-blue/30 rounded-lg">
                  <div className="absolute inset-2 border border-dusty-blue/20 rounded-lg"></div>
                </div>
                
                {/* Card content */}
                <div className="flex flex-col items-center justify-center h-full p-8 text-dusty-blue">
                  
                  <h1 className="typography-romantic text-4xl text-center mb-4 text-dusty-blue">
                    {t.envelope.title}
                  </h1>
                  
                  <div className="w-16 h-px bg-dusty-blue/40 mb-6"></div>
                  
                  <p className="typography-body text-xl text-center mb-6 text-dusty-blue/80">
                    {t.envelope.invited}
                  </p>
                  
                  <div className="text-center space-y-2">
                    <h2 className="typography-romantic text-4xl text-dusty-blue">
                      Erol & Klaudie
                    </h2>
                    <p className="typography-formal text-lg text-dusty-blue/70">
                      {t.envelope.date}
                    </p>
                  </div>
                  
                  <motion.div
                    className="mt-8 text-dusty-blue/60 text-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {t.envelope.tapToOpen}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Opening Animation */
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-center text-white"
          >
     
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="typography-heading text-3xl mb-4">{t.envelope.welcome}</h2>
              <p className="typography-body opacity-90">{t.envelope.unfold}</p>
            </motion.div>
            
            {/* Sparkle effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ 
                    x: 200, 
                    y: 200, 
                    scale: 0, 
                    opacity: 0 
                  }}
                  animate={{ 
                    x: 200 + (Math.cos(i * 45 * Math.PI / 180) * 150),
                    y: 200 + (Math.sin(i * 45 * Math.PI / 180) * 150),
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: 0.5 + (i * 0.1),
                    ease: 'easeOut'
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
