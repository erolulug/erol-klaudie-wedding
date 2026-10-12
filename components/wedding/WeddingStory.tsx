'use client';

import { withBasePath } from '@/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const touchStartRef = useRef<number>(0);
  const lastInteractionRef = useRef<number>(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isAudioError, setIsAudioError] = useState(false);

  // Background music - add your wedding music file to public/audio/
  const [play, { stop, pause, sound }] = useSound(withBasePath('/audio/wedding-music-v2.mp3'), {
    loop: true,
    volume: 0.3,
    preload: true, // Preload the audio file
    onload: () => {
      console.log('Wedding music loaded successfully');
      setIsAudioLoaded(true);
      setIsAudioError(false);
    },
    onloaderror: (error: any) => {
      console.log('Could not load wedding music. Please add wedding-music-v2.mp3 to public/audio/', error);
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

  const goToScene = (index: number) => {
    setCurrentScene(index);
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

  // Touch handlers for navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    const touchDuration = now - touchStartRef.current;
    const touch = e.changedTouches[0];
    
    if (!touch) return; // Safety check
    
    // Prevent double triggering within 500ms
    if (now - lastInteractionRef.current < 500) {
      console.log('Interaction too soon, ignoring');
      return;
    }
    
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    const tapX = touch.clientX;

    // Quick tap detection (less than 300ms)
    if (touchDuration < 300) {
      console.log('Tap detected at:', tapX, 'Screen width:', screenWidth);
      lastInteractionRef.current = now;
      
      if (tapX < screenWidth / 2) {
        console.log('Previous scene');
        prevScene(); // Left half - previous
      } else {
        console.log('Next scene');
        nextScene(); // Right half - next
      }
    }
  };

  // Click handlers for desktop
  const handleClick = (e: React.MouseEvent) => {
    const now = Date.now();
    
    // Prevent double triggering within 500ms
    if (now - lastInteractionRef.current < 500) {
      console.log('Click too soon, ignoring');
      return;
    }
    
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    const clickX = e.clientX;
    
    lastInteractionRef.current = now;
    
    if (clickX < screenWidth / 2) {
      prevScene(); // Left half - previous
    } else {
      nextScene(); // Right half - next
    }
  };

  // Swipe handlers with debouncing
  const handleSwipeLeft = () => {
    const now = Date.now();
    if (now - lastInteractionRef.current < 500) {
      console.log('Swipe left too soon, ignoring');
      return;
    }
    lastInteractionRef.current = now;
    console.log('Swipe left detected');
    nextScene();
  };

  const handleSwipeRight = () => {
    const now = Date.now();
    if (now - lastInteractionRef.current < 500) {
      console.log('Swipe right too soon, ignoring');
      return;
    }
    lastInteractionRef.current = now;
    console.log('Swipe right detected');
    prevScene();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventScrollOnSwipe: true,
    trackMouse: false, // Disable mouse tracking to prevent conflicts
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  });

  const CurrentSceneComponent = scenes[currentScene];

  return (
    <>
    <AnimatePresence>
      {!isEnvelopeOpened && <IntroEnvelope onOpen={() => setIsEnvelopeOpened(true)} />}
    </AnimatePresence>

    <div 
      className="relative w-full h-screen bg-black overflow-hidden"
      {...swipeHandlers}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
        {scenes.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              goToScene(index);
            }}
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

      {/* Scene content */}
      <AnimatePresence mode="wait">
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
      </AnimatePresence>


      {/* Back / Next buttons, vertically centred on the sides */}
      {currentScene > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
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
