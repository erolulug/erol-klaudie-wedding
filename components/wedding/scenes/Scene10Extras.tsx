'use client';

import { withBasePath } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { RotateCcw, Heart } from 'lucide-react';
import Image from 'next/image';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Scene10Extras({ isActive }: SceneProps) {
  const { t } = useLanguage();
  // Static engagement photos
  const photos: PhotoItem[] = [
    { id: '1', src: '/images/IMG_3760.jpg', alt: 'Erol and Klaudie together 1', size: 'large' },
    { id: '2', src: '/images/IMG_3746.jpg', alt: 'Erol and Klaudie together 2', size: 'medium' },
    { id: '3', src: '/images/IMG_4974.jpg', alt: 'Erol and Klaudie together 3', size: 'small' },
    { id: '4', src: '/images/407498.jpg', alt: 'Erol and Klaudie together 4', size: 'medium' },
    { id: '5', src: '/images/407499.jpg', alt: 'Erol and Klaudie together 5', size: 'large' },
    { id: '6', src: '/images/418388.jpg', alt: 'Erol and Klaudie together 6', size: 'medium' },
    { id: '7', src: '/images/417696.jpg', alt: 'Erol and Klaudie together 7', size: 'small' },
    { id: '8', src: '/images/416914.jpg', alt: 'Erol and Klaudie together 8', size: 'medium' },
    { id: '9', src: '/images/415481.jpg', alt: 'Erol and Klaudie together 9', size: 'large' },
    { id: '10', src: '/images/IMG_20210203_184204.jpg', alt: 'Erol and Klaudie together 10', size: 'medium' },
    { id: '11', src: '/images/IMG_20200926_183219.jpg', alt: 'Erol and Klaudie together 11', size: 'small' },
    { id: '12', src: '/images/IMG_20190709_195436.jpg', alt: 'Erol and Klaudie together 12', size: 'medium' },
    { id: '13', src: '/images/IMG_20190125_072913.jpg', alt: 'Erol and Klaudie together 13', size: 'large' },
    { id: '14', src: '/images/IMG_20180703_222016.jpg', alt: 'Erol and Klaudie together 14', size: 'medium' }
  ];

  const replayStory = () => {
    // This will be handled by the parent WeddingStory component
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-beige via-white to-dusty-blue/20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_#A3BFD9_1px,_transparent_1px),_radial-gradient(circle_at_75%_75%,_#A3BFD9_1px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-start h-full px-6 pt-16 pb-14 relative z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-7xl w-full"
        >
          {/* Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-decorative text-dusty-blue mb-2">
              {t.gallery.heading}
            </h2>
            <div className="w-16 h-px bg-dusty-blue mx-auto" />
          </motion.div>

          {/* Creative Photo Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1 * index,
                    ease: 'easeOut' 
                  }}
                  className="relative group break-inside-avoid mb-4"
                >
                  <div className={`
                    relative rounded-xl shadow-lg border border-dusty-blue/20 overflow-hidden bg-white
                    ${photo.size === 'small' ? 'h-48' : photo.size === 'medium' ? 'h-64' : 'h-80'}
                  `}>
                    <Image 
                      src={withBasePath(photo.src)}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={index < 2}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />

                    {/* Photo caption */}
                    {t.gallery.captions[index] && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4"
                      >
                        <p className="text-xs font-serif text-white italic">
                          {t.gallery.captions[index]}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>


        </motion.div>

        {/* Floating celebration elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-dusty-blue/20 text-xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -25, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 4,
              }}
            >
              {['🎊', '🎉', '💫', '⭐', '💝'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
