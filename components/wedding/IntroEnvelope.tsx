'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { withBasePath } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

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
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={withBasePath('/intro/envelope.mp4')}
        poster={withBasePath('/intro/envelope-poster.jpg')}
        muted
        playsInline
        preload="auto"
        onEnded={finish}
      />

      <LanguageSwitcher className="absolute top-8 left-4" />

      {!isOpening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.button
            className="pointer-events-auto px-8 py-3.5 rounded-full bg-white/75 backdrop-blur-md border border-[#d4bb98]/80 text-[#4a3e35] font-serif text-lg tracking-wider shadow-xl whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1, 1.05, 1] }}
            transition={{
              opacity: { duration: 0.6 },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
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
