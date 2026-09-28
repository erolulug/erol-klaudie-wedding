'use client';

import { withBasePath } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

export default function Scene6DressCode({ isActive }: SceneProps) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate consistent positions for floating elements (from Scene2)
  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    x: (i * 67 + 50) % 400,
    y: (i * 89 + 100) % 600,
    duration: 4 + (i % 3),
    delay: i * 0.3,
    symbol: ['💙', '✨', '🌸', '💫', '🤍', '🌟'][i],
  }));

  const colorSwatches = [
    { name: 'Dusty Blue', color: '#A3BFD9', textColor: 'text-white' },
    { name: 'Pure White', color: '#FFFFFF', textColor: 'text-gray-700', border: true },
    { name: 'Silver', color: '#C5C6C7', textColor: 'text-gray-700' },
    { name: 'Soft Beige', color: '#EAE6E1', textColor: 'text-gray-700' },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-white to-beige">
      {/* Watercolor border effect (from Scene2) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-dusty-blue/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-dusty-blue/10 to-transparent" />
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-dusty-blue/10 to-transparent" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-dusty-blue/10 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-start min-h-full px-8 pt-16 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-lg"
        >
          {/* Header with flower illustration (from Scene2) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="mb-4 flex justify-center">
              <img 
                src={withBasePath("/images/illustrations/Married Couple Wedding.png")} 
                alt="Decorative flower illustration"
                className="w-42 h-42 object-contain"
              />
            </div>
            <h2 className="typography-heading text-dusty-blue mb-2">
              {t.dressCode.heading}
            </h2>
            <div className="w-16 h-px bg-dusty-blue mx-auto" />
          </motion.div>

          {/* Theme Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="typography-subheading text-gray-800 mb-2">{t.dressCode.themeTitle}</h3>
            <p className="typography-body text-dusty-blue mb-2">{t.dressCode.theme}</p>
            <p className="typography-caption text-gray-600 italic mb-6">{t.dressCode.themeTagline}</p>
            
            {/* Theme color swatches */}
            <div className="flex justify-center space-x-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-dusty-blue shadow-lg border-2 border-white" />
                <span className="text-xs font-body text-gray-600 mt-2">{t.dressCode.dustyBlue}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg border-2 border-dusty-blue/30" />
                <span className="text-xs font-body text-gray-600 mt-2">{t.dressCode.white}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-silver shadow-lg border-2 border-white" />
                <span className="text-xs font-body text-gray-600 mt-2">{t.dressCode.silver}</span>
              </div>
            </div>
            
            <div className="w-16 h-px bg-dusty-blue mx-auto mb-6" />
        
          </motion.div>


          {/* Matsela Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-8"
          >
            {/* Matsela Header */}
            <div className="text-center mb-8">
              <motion.h3
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="typography-subheading text-gray-800 mb-2"
              >
             {t.dressCode.dressCode}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="typography-body text-dusty-blue mb-2"
              >
                {t.dressCode.matsela}
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '4rem' }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="h-px bg-dusty-blue mx-auto mb-4"
              />
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="typography-body text-gray-600 text-sm italic"
              >
                {t.dressCode.fabrics}
              </motion.p>
            </div>
            
            {/* Cloth Images Display */}
            <div className="flex flex-col items-center space-y-8">
              {/* Bride's Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="text-center"
              >
                <img 
                  src={withBasePath("/images/Cloths/Bride Cloth.png")} 
                  alt="Bride Family Traditional Cloth"
                  className="w-64 h-40 object-cover rounded-xl shadow-lg mb-4 mx-auto"
                />
                <h5 className="typography-formal text-lg font-semibold text-dusty-blue mb-2">
                  {t.dressCode.bridesSide}
                </h5>
                <div className="w-12 h-px bg-dusty-blue mx-auto mb-2" />
                <p className="typography-caption text-dusty-blue text-sm">
                  {t.dressCode.forBride}
                </p>
              </motion.div>

              {/* Groom's Side */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-center"
              >
                <img 
                  src={withBasePath("/images/Cloths/Groom Cloth.png")} 
                  alt="Groom Family Traditional Cloth"
                  className="w-64 h-40 object-cover rounded-xl shadow-lg mb-4 mx-auto"
                />
                <h5 className="typography-formal text-lg font-semibold text-dusty-blue mb-2">
                  {t.dressCode.groomsSide}
                </h5>
                <div className="w-12 h-px bg-dusty-blue mx-auto mb-2" />
                <p className="typography-caption text-dusty-blue text-sm">
                  {t.dressCode.forGroom}
                </p>
              </motion.div>
            </div>
          </motion.div>


          {/* Bottom message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-8"
          >
            <p className="typography-caption text-gray-500 italic">
              {t.dressCode.closing}
            </p>
          </motion.div>
        </motion.div>

        {/* Floating elements - matching Scene2 style */}
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
    </div>
  );
}
