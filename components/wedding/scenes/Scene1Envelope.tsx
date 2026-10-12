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

// Text sizes are in cqw (% of the gold frame's width) so they scale with the frame
const textBlock = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25, delayChildren: 1.1 } },
};
const textItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
};

export default function Scene1Envelope(_props: SceneProps) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#fcfbf9]">
      {/* Soft warm glow behind the frame */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,244,228,0.9)_0%,_rgba(252,251,249,0)_65%)]" />

      {/* Corner leaves grow in from the corners, then sway gently */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: 'min(62vw, 46vh)', transformOrigin: 'top left' }}
        initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <motion.img
          src={withBasePath('/intro/leaves-top-left.webp')}
          alt=""
          className="w-full h-auto"
          style={{ transformOrigin: 'top left' }}
          animate={{ rotate: [0, 1.8, 0, -1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ width: 'min(70vw, 52vh)', transformOrigin: 'bottom right' }}
        initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
      >
        <motion.img
          src={withBasePath('/intro/leaves-bottom-right.webp')}
          alt=""
          className="w-full h-auto"
          style={{ transformOrigin: 'bottom right' }}
          animate={{ rotate: [0, -1.8, 0, 1, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false}
        />
      </motion.div>

      {/* Loose leaves drifting */}
      <motion.img
        src={withBasePath('/intro/leaf-top.webp')}
        alt=""
        className="absolute pointer-events-none"
        style={{ width: 'min(10vw, 7vh)', left: '62%', top: '8%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -10, 0], rotate: [0, 12, 0] }}
        transition={{ opacity: { duration: 1, delay: 0.8 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
        draggable={false}
      />
      <motion.img
        src={withBasePath('/intro/leaf-bottom.webp')}
        alt=""
        className="absolute pointer-events-none"
        style={{ width: 'min(11vw, 8vh)', left: '14%', bottom: '14%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0], rotate: [0, -14, 0] }}
        transition={{ opacity: { duration: 1, delay: 1 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
        draggable={false}
      />

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

      {/* Gold frame with the invitation text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
        {/* Gentle breathing once it's in place */}
        <motion.div
          className="relative"
          style={{
            width: 'min(88vw, 60vh)',
            aspectRatio: '656 / 677',
            containerType: 'inline-size',
          }}
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
        >
          <img
            src={withBasePath('/intro/frame.webp')}
            alt=""
            className="absolute inset-0 w-full h-full"
            draggable={false}
          />

          {/* Light sweeping across the gold frame and leaves */}
          <motion.div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: `url('${withBasePath('/intro/frame.webp')}')`,
              maskImage: `url('${withBasePath('/intro/frame.webp')}')`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              backgroundImage: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)',
              backgroundSize: '250% 100%',
              mixBlendMode: 'overlay',
            }}
            initial={{ backgroundPosition: '150% 0' }}
            animate={{ backgroundPosition: ['150% 0', '-50% 0'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut', delay: 2 }}
          />

          <div
            className="absolute flex flex-col items-center justify-center text-center text-[#5a5a5a]"
            style={{ left: '18%', right: '18%', top: '19%', bottom: '10%' }}
          >
              <motion.div
                className="flex flex-col items-center w-full"
                variants={textBlock}
                initial="hidden"
                animate="show"
              >
                <motion.p
                  variants={textItem}
                  className="font-body uppercase text-[#7a7a7a] leading-snug"
                  style={{ fontSize: '3.4cqw', letterSpacing: '0.16em', maxWidth: '40cqw' }}
                >
                  {t.envelope.invited}
                </motion.p>

                <motion.h2 variants={textItem} className="font-script leading-none mt-[3.7cqw]" style={{ fontSize: '16cqw' }}>
                  Erol
                </motion.h2>

                <motion.div variants={textItem} className="flex items-center w-full gap-[2.5cqw] my-[0.6cqw]">
                  <motion.span
                    className="flex-1 h-px bg-[#8a8a8a] origin-right"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1.8, ease: 'easeOut' }}
                  />
                  <span className="font-script text-[#6a6a6a]" style={{ fontSize: '6.8cqw' }}>
                    {t.envelope.and}
                  </span>
                  <motion.span
                    className="flex-1 h-px bg-[#8a8a8a] origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1.8, ease: 'easeOut' }}
                  />
                </motion.div>

                <motion.h2 variants={textItem} className="font-script leading-none" style={{ fontSize: '16cqw' }}>
                  Klaudie
                </motion.h2>

                <motion.p
                  variants={textItem}
                  className="font-serif font-bold uppercase mt-[5cqw]"
                  style={{ fontSize: '4.4cqw', letterSpacing: '0.16em' }}
                >
                  {t.envelope.date}
                </motion.p>
              </motion.div>
          </div>

        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
