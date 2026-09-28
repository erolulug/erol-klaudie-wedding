'use client';

import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

export default function Scene11RSVP({ onNext, onPrev, isActive }: SceneProps) {
  const { t } = useLanguage();


  return (
    <div className="relative w-full h-full bg-gradient-to-b from-white to-beige">
      {/* Watercolor border effect (consistent with other scenes) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-dusty-blue/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-dusty-blue/10 to-transparent" />
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-dusty-blue/10 to-transparent" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-dusty-blue/10 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-start min-h-full px-6 py-8 text-center">
        {/* Google Forms RSVP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl w-full mt-8 mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-dusty-blue/20">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl mb-4"
              >
                💌
              </motion.div>
              <h3 className="typography-heading text-dusty-blue mb-2">
                {t.rsvp.heading}
              </h3>
              <div className="w-16 h-px bg-dusty-blue mx-auto mb-4" />
              <p className="typography-body text-gray-600">
                {t.rsvp.subtitle}
              </p>
              <div className="bg-dusty-blue/10 rounded-xl p-4 mt-4">
                <p className="typography-caption text-dusty-blue font-medium">
                  {t.rsvp.deadline}
                </p>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-dusty-blue/10">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSffPqVzNMfWKuFzvOAACTeEzoW4iNIsr61g6BlURAOnqk6ktQ/viewform?embedded=true"
                width="100%"
                height="1600"
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0}
                className="w-full"
                title="Wedding RSVP Form"
              >
                {t.rsvp.loading}
              </iframe>
            </div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Decorative elements - consistent with other scenes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-dusty-blue/10 text-2xl"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          >
            {['✨', '🌟', '💫', '🤍', '💙', '🌸'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
