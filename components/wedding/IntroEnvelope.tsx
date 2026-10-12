'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { withBasePath } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';
import WaxSeal from './WaxSeal';

interface IntroEnvelopeProps {
  onOpen: () => void;
}

// Full-screen closed envelope shown before the story; tapping plays the opening video
export default function IntroEnvelope({ onOpen }: IntroEnvelopeProps) {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpening, setIsOpening] = useState(false);
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onOpen();
  };

  const open = () => {
    if (isOpening) return;
    setIsOpening(true);

    const video = videoRef.current;
    if (!video) return finish();
    video.currentTime = 0;
    // If the browser refuses to play the video, go straight to the invitation
    video.play().catch(finish);
  };

  // Never leave guests stuck on the envelope if the video stalls
  useEffect(() => {
    if (!isOpening) return;
    const timeout = setTimeout(finish, 8000);
    return () => clearTimeout(timeout);
  }, [isOpening]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-[#e8dcd2] cursor-pointer"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onClick={open}
    >
      {/* Soft blurred envelope fills the sides on wide screens */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-80"
        style={{ backgroundImage: `url('${withBasePath('/intro/envelope-poster.jpg')}')` }}
      />

      {/* The video is portrait and low-res, so on wide screens show it upright instead of stretching it */}
      <video
        ref={videoRef}
        className="relative w-full h-full object-cover landscape:object-contain"
        src={withBasePath('/intro/envelope.mp4')}
        poster={withBasePath('/intro/envelope-poster.jpg')}
        muted
        playsInline
        preload="auto"
        onEnded={finish}
      />

      <LanguageSwitcher className="absolute top-8 left-4" />

      {/* Champagne wax seal where the flaps meet (centre of the envelope); it lifts away when opened */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-[50.7%]"
          style={{ width: 'min(30vw, 17vh)', aspectRatio: '1', marginLeft: 'calc(min(30vw, 17vh) / -2)', marginTop: 'calc(min(30vw, 17vh) / -2)' }}
          initial={{ opacity: 0, scale: 1.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.3, 1.4, 0.5, 1], delay: 0.3 }}
        >
          <WaxSeal lifted={isOpening} className="w-full h-full" />
        </motion.div>
      </div>

      {!isOpening && (
        <div className="absolute inset-x-0 top-[50.7%] flex justify-center pointer-events-none" style={{ marginTop: 'calc(min(30vw, 17vh) / 2 + 1.75rem)' }}>
          <motion.button
            className="pointer-events-auto px-7 py-3 rounded-full bg-white/75 backdrop-blur-md border border-[#d4bb98]/80 text-[#4a3e35] font-serif text-lg tracking-wider shadow-xl whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.04, 1] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.8 },
              y: { duration: 0.6, delay: 0.8 },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
            }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            {t.intro.open}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
