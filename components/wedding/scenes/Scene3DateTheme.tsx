'use client';

import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Clock, Sun, Church, Users, Moon, Calendar, Download, Phone, MapPin } from 'lucide-react';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

interface ScheduleItem {
  showPin: boolean;
  caption: string;
  location: string;
  icon: React.ReactNode;
  color: string;
}

export const VENUE_MAP_URL = 'https://maps.app.goo.gl/3FK81LEqqAgVcC659';

const scheduleItems: ScheduleItem[] = [
  {
    showPin: false,
    caption: 'Welcome drinks as our loved ones gather',
    location: 'Vendryně, Czechia',
    icon: <Sun size={20} />,
    color: 'text-orange-500',
  },
  {
    showPin: true,
    caption: 'We gather to vow our forever',
    location: 'Vendryně, Czechia',
    icon: <Church size={20} />,
    color: 'text-dusty-blue',
  },
  {
    showPin: true,
    caption: 'Laughter, feasting, and celebration follow',
    location: 'Vendryně, Czechia',
    icon: <Users size={20} />,
    color: 'text-green-500',
  },
  {
    showPin: false,
    caption: 'Dancing into the night',
    location: 'Vendryně, Czechia',
    icon: <Moon size={20} />,
    color: 'text-purple-500',
  },
];

export default function Scene3DateTheme({ isActive }: SceneProps) {
  const { t } = useLanguage();
  // Save the date functionality
  const generateCalendarLink = (type: 'google' | 'outlook' | 'ics') => {
    const eventDetails = {
      title: t.date.calendarTitle,
      startDate: '20270814T110000Z', // August 14, 2027, 1:00 PM Czech time (CEST)
      endDate: '20270814T220000Z',   // August 14, 2027, midnight Czech time (CEST)
      location: 'Vendryně, Czechia',
      description: t.date.calendarDescription
    };

    switch (type) {
      case 'google':
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&location=${encodeURIComponent(eventDetails.location)}&details=${encodeURIComponent(eventDetails.description)}`;
      
      case 'outlook':
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventDetails.title)}&startdt=${eventDetails.startDate}&enddt=${eventDetails.endDate}&location=${encodeURIComponent(eventDetails.location)}&body=${encodeURIComponent(eventDetails.description)}`;
      
      case 'ics':
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//Wedding Event//EN
BEGIN:VEVENT
UID:wedding-${Date.now()}@ourday.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${eventDetails.startDate}
DTEND:${eventDetails.endDate}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;
        
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        return URL.createObjectURL(blob);
    }
  };

  const handleSaveDate = (type: 'google' | 'outlook' | 'ics') => {
    const link = generateCalendarLink(type);
    
    if (type === 'ics') {
      // For ICS, trigger download
      const a = document.createElement('a');
      a.href = link;
      a.download = 'erol-klaudie-wedding.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(link);
    } else {
      // For Google and Outlook, open in new tab
      window.open(link, '_blank');
    }
  };
  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden"
      initial={{ background: 'linear-gradient(to bottom right, #ffffff, #EAE6E1)' }}
      animate={{ background: 'linear-gradient(to bottom right, #8BADD6,rgb(4, 65, 96))' }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#A3BFD9_1px,_transparent_1px)] bg-[length:30px_30px]" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-start h-full px-6 pt-16 pb-24 text-center relative z-10 overflow-y-auto">
        {/* Header with Date */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <h2 className="typography-heading text-white mb-4">
            {t.date.heading}
          </h2>
          
          {/* Date Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-dusty-blue/20 mb-6">
            <h1 className="typography-hero text-dusty-blue mb-1">{t.date.weekday}</h1>
            <div className="text-5xl font-decorative font-bold text-gray-800 mb-1">{t.date.day}</div>
            <h2 className="typography-subheading text-gray-700 mb-1">{t.date.month}</h2>
            <div className="typography-formal text-2xl font-medium text-dusty-blue">{t.date.year}</div>
          </div>

          {/* Location Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-6"
          >
            <a
              href={VENUE_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-colors"
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-white mr-2" />
                </div>
                <p className="typography-formal text-lg font-medium text-white">
                  Vendryně
                </p>
                <p className="text-sm text-white/80 font-medium">
                  {t.date.country}
                </p>
                <p className="mt-2 text-xs text-white underline underline-offset-2">
                  {t.date.openMap}
                </p>
              </div>
            </a>
          </motion.div>

          {/* Save the Date Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-medium">{t.date.saveTheDate}</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleSaveDate('google')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Google
              </button>
              
              <button
                onClick={() => handleSaveDate('outlook')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Outlook
              </button>
              
              <button
                onClick={() => handleSaveDate('ics')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.date.download}
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-6">
            <h3 className="typography-subheading text-white">{t.date.timeline}</h3>
          </div>
          <div className="w-16 h-px bg-white/60 mx-auto mb-6" />

          {/* Timeline */}
          <div className="relative">
            {/* Main vertical line */}
            <div className="absolute left-2 top-0 bottom-0 w-px bg-white/60"></div>
            
            <div className="space-y-8">
              {scheduleItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + index * 0.15,
                    ease: 'easeOut' 
                  }}
                  className="relative flex items-start"
                >
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-4 h-4 bg-white rounded-full border-2 border-white/80 shadow-lg z-10"></div>
                  
                  {/* Content */}
                  <div className="ml-6 flex-1 text-left">
                    {/* Time */}
                    <div className="mb-2">
                      <h3 className="typography-formal text-xl font-bold text-white tracking-wide">
                        {t.date.schedule[index].time}
                      </h3>
                    </div>
                    
                    {/* Event Title and Location Pin */}
                    <div className="flex items-center justify-between">
                      <h4 className="typography-formal text-base font-medium text-white/95 uppercase tracking-wider">
                        {t.date.schedule[index].title}
                      </h4>
                      
                      {/* Location Pin for Ceremony and Reception */}
                      {item.showPin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(VENUE_MAP_URL, '_blank');
                          }}
                          onTouchEnd={(e) => e.stopPropagation()}
                          className="ml-3 p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full transition-all duration-200 hover:scale-110 group"
                          title={`${t.date.navigateTo} ${item.location}`}
                        >
                          <MapPin className="w-4 h-4 text-white group-hover:text-white/90" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-6"
          >
            <p className="text-sm typography-formal text-white/80 italic">
              {t.date.closing}
            </p>
          </motion.div>
        </motion.div>

        {/* Contact Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="w-full max-w-md mt-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Phone className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-medium">{t.date.moreInfo}</span>
            </div>
            
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-white/90 text-sm font-medium mb-1">{t.date.rsvp}</p>
                <a 
                  href="tel:+26775950123" 
                  className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
                >
                  Kaone +267 75 950 123
                </a>
              </div>
              
              <div className="w-12 h-px bg-white/40 mx-auto" />
              
              <div className="text-center">
                <p className="text-white/90 text-sm font-medium mb-1">{t.date.contact}</p>
                <a 
                  href="tel:+26775268992" 
                  className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
                >
                  Seelo +267 75 268 992
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-dusty-blue/20 text-lg"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 3,
              }}
            >
              {['✨', '🌟', '💫'][i % 3]}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
