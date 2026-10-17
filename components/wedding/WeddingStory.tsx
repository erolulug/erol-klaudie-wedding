'use client';

import { withBasePath } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import useSound from 'use-sound';
import { useLanguage } from '@/lib/i18n';
import IntroEnvelope from './IntroEnvelope';
import LanguageSwitcher from './LanguageSwitcher';

// Import scene components
import Scene1Envelope from './scenes/Scene1Envelope';
import Scene2Blessing from './scenes/Scene2Blessing';
import Scene3DateTheme from './scenes/Scene3DateTheme';
import Scene6DressCode from './scenes/Scene6DressCode';
import Scene7Scripture from './scenes/Scene8Scripture';
import Scene9Extras from './scenes/Scene10Extras';
import Scene10RSVP from './scenes/Scene11RSVP';

const scenes = [
  Scene1Envelope,
  Scene2Blessing,
  Scene3DateTheme,
  Scene6DressCode,
  Scene7Scripture,
  Scene9Extras,
  Scene10RSVP,
];

interface WeddingStoryProps {
  onComplete?: () => void;
}

export default function WeddingStory({ onComplete }: WeddingStoryProps) {
  const { t } = useLanguage();
  const [currentScene, setCurrentScene] = useState(0);
  // The story starts behind the envelope intro; music waits until it's opened
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  // "E & K" bursts that float up from a heart button when it's tapped
  const [bursts, setBursts] = useState<{ id: number; side: 'left' | 'right' }[]>([]);

  const celebrate = (side: 'left' | 'right') => {
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, side }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 1600);
  };
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isAudioError, setIsAudioError] = useState(false);

  // Background music - add your wedding music file to public/audio/
  const [play, { stop, pause, sound }] = useSound(withBasePath('/audio/wedding-music-v3.mp3'), {
    loop: true,
    volume: 0.3,
    preload: true, // Preload the audio file
    onload: () => {
      console.log('Wedding music loaded successfully');
      setIsAudioLoaded(true);
      setIsAudioError(false);
    },
    onloaderror: (error: any) => {
      console.log('Could not load wedding music. Please add wedding-music-v3.mp3 to public/audio/', error);
      setIsAudioLoaded(false);
      setIsAudioError(true);
    }
  });

  const nextScene = useCallback(() => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentScene, onComplete]);

  // Audio control - only play when audio is loaded
  useEffect(() => {
    if (!isAudioLoaded || isAudioError) {
      console.log('Audio not ready yet, waiting...', { isAudioLoaded, isAudioError });
      return;
    }

    if (!isMuted && isPlaying && isEnvelopeOpened) {
      console.log('Starting music playback');
      play();
    } else {
      console.log('Pausing music playback');
      pause();
    }

    return () => {
      // Cleanup on component unmount
      if (sound) {
        stop();
      }
    };
  }, [isMuted, isPlaying, isEnvelopeOpened, isAudioLoaded, isAudioError, play, pause, sound, stop]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (sound) {
        stop();
      }
    };
  }, [sound, stop]);


  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  const restart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const CurrentSceneComponent = scenes[currentScene];

  return (
    <>
    <AnimatePresence>
      {!isEnvelopeOpened && <IntroEnvelope onOpen={() => setIsEnvelopeOpened(true)} />}
    </AnimatePresence>

    {/* Pages change only with the Back / Next heart buttons */}
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Progress bars (display only) */}
      <div className="absolute top-4 left-4 right-4 z-50 flex gap-1 drop-shadow-[0_0_2px_rgba(0,0,0,0.35)] pointer-events-none">
        {scenes.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: index <= currentScene ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Audio control */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        title={
          !isAudioLoaded && !isAudioError ? t.story.musicLoading :
          isAudioError ? t.story.musicError :
          isMuted ? t.story.unmute : t.story.mute
        }
      >
        {!isAudioLoaded && !isAudioError ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : isAudioError ? (
          <VolumeX size={20} className="text-red-400" />
        ) : isMuted ? (
          <VolumeX size={20} />
        ) : (
          <Volume2 size={20} />
        )}
      </button>

      {/* Language switcher */}
      <LanguageSwitcher className="absolute top-8 left-4 z-50" />

      {/* Restart button (shown on last scene) */}
      {currentScene === scenes.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            restart();
          }}
          className="absolute top-4 right-16 z-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      )}

      {/* Scene content - only mounted once the envelope is opened, so page 1's
          animation starts when guests can actually see it */}
      <AnimatePresence mode="wait">
        {isEnvelopeOpened && (
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          <CurrentSceneComponent 
            onNext={nextScene}
            onPrev={prevScene}
            isActive={true}
          />
        </motion.div>
        )}
      </AnimatePresence>


      {/* Initials floating up from the heart that was tapped */}
      {bursts.map(({ id, side }) => (
        <div
          key={id}
          className="absolute top-1/2 z-50 w-14 -mt-7 flex justify-center pointer-events-none"
          style={side === 'left' ? { left: '0.5rem' } : { right: '0.5rem' }}
        >
          <motion.span
            className="absolute font-script text-3xl text-white whitespace-nowrap [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]"
            // Nudge toward the middle so the text isn't cut off at the screen edge
            initial={{ x: side === 'left' ? 24 : -24, y: 0, opacity: 0, scale: 0.6 }}
            animate={{ x: side === 'left' ? 24 : -24, y: -90, opacity: [0, 1, 1, 0], scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            E &amp; K
          </motion.span>
          {[-18, 0, 18].map((dx, i) => (
            <motion.span
              key={i}
              className="absolute text-rose-500"
              initial={{ x: 0, y: 10, opacity: 0, scale: 0.5 }}
              animate={{ x: dx, y: -55 - i * 12, opacity: [0, 1, 0], scale: 1 }}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
            >
              <Heart size={12} fill="currentColor" strokeWidth={0} />
            </motion.span>
          ))}
        </div>
      ))}

      {/* Back / Next buttons, vertically centred on the sides */}
      {currentScene > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            celebrate('left');
            prevScene();
          }}
          onTouchEnd={(e) => e.stopPropagation()}
          className="group absolute left-2 top-1/2 -translate-y-1/2 z-50 w-14 h-14 flex items-center justify-center text-white drop-shadow-lg transition-transform hover:scale-110"
          title={t.story.back}
          aria-label={t.story.back}
        >
          <Heart
            className="absolute inset-0 w-full h-full text-white/80 fill-rose-500/50 group-hover:fill-rose-500/80 transition-colors"
            strokeWidth={1.5}
          />
          <ChevronLeft size={22} strokeWidth={2.5} className="relative -mt-1" />
        </button>
      )}

      {currentScene < scenes.length - 1 && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            celebrate('right');
            nextScene();
          }}
          onTouchEnd={(e) => e.stopPropagation()}
          className="group absolute right-2 top-1/2 z-50 w-14 h-14 -mt-7 flex items-center justify-center text-white drop-shadow-lg"
          title={t.story.next}
          aria-label={t.story.next}
          // Gentle heartbeat so guests notice where to go next
          animate={{ scale: [1, 1.12, 1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
          whileHover={{ scale: 1.15 }}
        >
          <Heart
            className="absolute inset-0 w-full h-full text-white fill-rose-500 group-hover:fill-rose-600 transition-colors"
            strokeWidth={1.5}
          />
          <ChevronRight size={22} strokeWidth={2.5} className="relative -mt-1" />
        </motion.button>
      )}

      {/* Page counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-black/40 rounded-full text-white/90 text-xs font-medium pointer-events-none">
        {currentScene + 1} / {scenes.length}
      </div>
    </div>
    </>
  );
}
