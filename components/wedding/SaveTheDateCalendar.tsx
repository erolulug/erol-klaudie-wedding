'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { withBasePath } from '@/lib/utils';

// The wedding day shown on the calendar
const YEAR = 2027;
const MONTH = 7; // August (0-based)
const DAY = 14;

// Weeks start on Monday; returns the month as rows of day numbers (null = empty cell)
function monthGrid(year: number, month: number) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon = 0
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7));
}

// "Save the date" calendar inside the ornate frame with swans.
// Text sizes are in cqw (% of the frame width) so everything scales together.
export default function SaveTheDateCalendar() {
  const { t } = useLanguage();
  const rows = monthGrid(YEAR, MONTH);

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-serif italic font-bold uppercase text-2xl text-[#3a322c] tracking-wide mb-3">
        {t.date.saveTheDate}
      </h3>

      <div
        className="relative w-full max-w-[300px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
        style={{ aspectRatio: '350 / 418', containerType: 'inline-size' }}
      >
        <img
          src={withBasePath('/intro/calendar-frame.png')}
          alt=""
          className="absolute inset-0 w-full h-full"
          draggable={false}
        />

        {/* The calendar sits inside the oval, above the swans */}
        <div
          className="absolute flex flex-col items-center text-[#3a322c] font-serif"
          style={{ left: '24%', right: '23%', top: '24%', bottom: '34%' }}
        >
          <p className="leading-none mb-[2.5cqw]" style={{ fontSize: '7cqw' }}>
            {t.date.monthName} {YEAR}
          </p>

          <div className="grid grid-cols-7 w-full border-b border-[#3a322c]/60 pb-[0.6cqw] mb-[0.6cqw]">
            {t.date.weekdays.map((d, i) => (
              <span
                key={d}
                className={`text-center font-bold uppercase leading-none ${i < 6 ? 'border-r border-[#3a322c]/40' : ''}`}
                style={{ fontSize: '2.6cqw' }}
              >
                {d}
              </span>
            ))}
          </div>

          <div className="w-full flex-1 flex flex-col justify-between">
            {rows.map((row, r) => (
              <div key={r} className="grid grid-cols-7 w-full">
                {row.map((day, c) => (
                  <span
                    key={c}
                    className={`relative flex items-center justify-center leading-none ${c < 6 ? 'border-r border-[#3a322c]/40' : ''}`}
                    style={{ fontSize: '4.2cqw', height: '5.6cqw' }}
                  >
                    {day === DAY ? (
                      <>
                        <motion.span
                          className="absolute inset-0 flex items-center justify-center text-[#8b1e2d]"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Heart style={{ width: '7.4cqw', height: '7.4cqw' }} fill="currentColor" strokeWidth={0} />
                        </motion.span>
                        <span className="relative text-white font-bold">{day}</span>
                      </>
                    ) : (
                      day
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
