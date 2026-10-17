'use client';

import { withBasePath } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import FlightTimeline from '../FlightTimeline';
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
    color: 'text-blush',
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
      className="relative w-full h-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${withBasePath('/intro/lake-background.jpg')}')` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    >
      {/* Main content */}
      <div className="relative z-10 h-full overflow-y-auto overflow-x-hidden">
        <div className="flex justify-center min-h-full px-4 sm:px-8 pt-16 pb-14">
        {/* Frosted panel keeps the text readable over the picture */}
        <div className="flex flex-col items-center w-full max-w-md bg-white/65 backdrop-blur-md rounded-3xl px-5 sm:px-6 py-8 shadow-xl border border-white/60 text-center">
        {/* Header with Date */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <h2 className="typography-heading text-[#d99aac] mb-4">
            {t.date.heading}
          </h2>
          
          {/* Date Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blush/20 mb-6">
            <h1 className="typography-hero text-blush mb-1">{t.date.weekday}</h1>
            <div className="text-5xl font-decorative font-bold text-gray-800 mb-1">{t.date.day}</div>
            <h2 className="typography-subheading text-gray-700 mb-1">{t.date.month}</h2>
            <div className="typography-formal text-2xl font-medium text-blush">{t.date.year}</div>
          </div>

        </motion.div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-6">
            <h3 className="typography-subheading text-[#d99aac]">{t.date.timeline}</h3>
          </div>
          <div className="w-16 h-px bg-blush/50 mx-auto" />

          {/* Timeline drawn as a flight route */}
          <FlightTimeline
            items={scheduleItems.map((item, index) => ({
              time: t.date.schedule[index].time,
              title: t.date.schedule[index].title,
              action: item.showPin ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(VENUE_MAP_URL, '_blank');
                  }}
                  onTouchEnd={(e) => e.stopPropagation()}
                  className="ml-3 p-1.5 bg-white/70 hover:bg-white border border-blush/30 rounded-full transition-all duration-200 hover:scale-110 group"
                  title={`${t.date.navigateTo} ${item.location}`}
                >
                  <MapPin className="w-4 h-4 text-[#d99aac] group-hover:text-[#c98399]" />
                </button>
              ) : undefined,
            }))}
          />

          {/* Bottom message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-6"
          >
            <p className="font-serif italic text-xl sm:text-2xl leading-snug text-gray-600">
              {t.date.closing}
            </p>
          </motion.div>
        </motion.div>

        {/* Venue and save-the-date, after the hour-by-hour timeline */}
        <div className="w-full max-w-md mt-8">
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
              className="block bg-white/60 hover:bg-white/90 rounded-xl p-4 border border-blush/20 transition-colors"
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-gray-700 mr-2" />
                </div>
                <p className="typography-formal text-lg font-medium text-gray-700">
                  Vendryně
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  {t.date.country}
                </p>
                <p className="mt-2 text-xs text-gray-700 underline underline-offset-2">
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
              <Calendar className="w-5 h-5 text-gray-700 mr-2" />
              <span className="text-gray-700 font-medium">{t.date.saveTheDate}</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleSaveDate('google')}
                className="bg-white/70 hover:bg-white border border-blush/30 rounded-lg px-4 py-2 text-gray-700 text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Google
              </button>
              
              <button
                onClick={() => handleSaveDate('outlook')}
                className="bg-white/70 hover:bg-white border border-blush/30 rounded-lg px-4 py-2 text-gray-700 text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Outlook
              </button>
              
              <button
                onClick={() => handleSaveDate('ics')}
                className="bg-white/70 hover:bg-white border border-blush/30 rounded-lg px-4 py-2 text-gray-700 text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.date.download}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Contact Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="w-full max-w-md mt-8"
        >
          <div className="bg-white/60 rounded-2xl p-6 border border-blush/20">
            <div className="flex items-center justify-center mb-4">
              <Phone className="w-5 h-5 text-gray-700 mr-2" />
              <span className="text-gray-700 font-medium">{t.date.moreInfo}</span>
            </div>
            
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-1">{t.date.rsvp}</p>
                <a 
                  href="tel:+26775950123" 
                  className="text-gray-700 hover:text-[#c98399] transition-colors duration-200 font-medium"
                >
                  Kaone +267 75 950 123
                </a>
              </div>
              
              <div className="w-12 h-px bg-blush/40 mx-auto" />
              
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-1">{t.date.contact}</p>
                <a 
                  href="tel:+26775268992" 
                  className="text-gray-700 hover:text-[#c98399] transition-colors duration-200 font-medium"
                >
                  Seelo +267 75 268 992
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        </div>
        </div>

      </div>
    </motion.div>
  );
}
