'use client';

import { motion } from 'framer-motion';

// Irregular wax edge: a circle with a few overlapping wobbles (deterministic)
function waxEdgePath(cx: number, cy: number, r: number) {
  const points = Array.from({ length: 96 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2;
    const wobble = 1 + 0.045 * Math.sin(7 * a + 0.6) + 0.03 * Math.sin(13 * a + 2.1) + 0.02 * Math.sin(23 * a);
    return [cx + Math.cos(a) * r * wobble, cy + Math.sin(a) * r * wobble];
  });
  return 'M' + points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L') + 'Z';
}

const EDGE = waxEdgePath(100, 100, 92);

function SealArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#f3eadf" />
          <stop offset="45%" stopColor="#dccab4" />
          <stop offset="100%" stopColor="#b09a80" />
        </radialGradient>
        <radialGradient id={`${id}-pressed`} cx="60%" cy="65%" r="70%">
          <stop offset="0%" stopColor="#e2d3bf" />
          <stop offset="100%" stopColor="#c6b197" />
        </radialGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a46a" />
          <stop offset="55%" stopColor="#a8834f" />
          <stop offset="100%" stopColor="#86663c" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Wax blob */}
      <path d={EDGE} fill={`url(#${id}-wax)`} />
      {/* Raised rim highlight */}
      <path d={EDGE} fill="none" stroke="#fffaf2" strokeOpacity="0.7" strokeWidth="2" transform="translate(-1 -1)" />

      {/* Pressed-in centre with an embossed ring */}
      <circle cx="100" cy="100" r="66" fill={`url(#${id}-pressed)`} />
      <circle cx="100" cy="100" r="66" fill="none" stroke="#9c8569" strokeWidth="3" strokeOpacity="0.55" />
      <circle cx="101" cy="101" r="61" fill="none" stroke="#fbf3e6" strokeWidth="1.4" strokeOpacity="0.8" />
      <circle cx="100" cy="100" r="57" fill="none" stroke="#9c8569" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="2 4" />

      {/* Monogram: dark pressed letters with a light lower edge */}
      <g fontFamily="var(--font-script)" fontSize="58" textAnchor="middle">
        <text x="101.5" y="122" fill="#fffaf0" fillOpacity="0.85">E&amp;K</text>
        <text x="100" y="120" fill={`url(#${id}-gold)`}>E&amp;K</text>
      </g>

      {/* Glossy reflection */}
      <path d={EDGE} fill={`url(#${id}-shine)`} />
    </svg>
  );
}

interface WaxSealProps {
  lifted: boolean;
  className?: string;
}

// Rising hearts released when the seal lifts (deterministic positions)
const hearts = Array.from({ length: 8 }, (_, i) => ({
  x: (i - 3.5) * 14 + (i % 2 ? 6 : -6),
  rise: 110 + (i % 3) * 35,
  size: 12 + (i % 3) * 4,
  delay: 0.15 + i * 0.07,
}));

// When the envelope opens the seal stays whole: it glows, lifts off the
// paper and floats away while little hearts rise from it
export default function WaxSeal({ lifted, className = '' }: WaxSealProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Soft golden glow behind the seal as it lifts */}
      <motion.div
        className="absolute inset-[-25%] rounded-full bg-[radial-gradient(circle,_rgba(255,214,150,0.75)_0%,_rgba(255,214,150,0)_65%)]"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={lifted ? { opacity: [0, 1, 0], scale: [0.6, 1.3, 1.6] } : { opacity: 0, scale: 0.6 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute inset-0 drop-shadow-[0_5px_9px_rgba(90,65,40,0.35)]"
        animate={
          lifted
            ? { scale: [1, 1.12, 0.55], y: [0, -6, -140], rotate: [0, -4, 6], opacity: [1, 1, 0] }
            : { scale: 1, y: 0, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 1.6, times: [0, 0.25, 1], ease: 'easeInOut' }}
      >
        <SealArt id="seal" />
      </motion.div>

      {lifted &&
        hearts.map((h, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute left-1/2 top-1/2 text-[#c9a46a]"
            style={{ width: h.size, height: h.size, marginLeft: -h.size / 2, marginTop: -h.size / 2 }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{ x: h.x, y: -h.rise, opacity: [0, 1, 0], scale: 1 }}
            transition={{ duration: 1.5, delay: h.delay, ease: 'easeOut' }}
          >
            <path
              fill="currentColor"
              d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z"
            />
          </motion.svg>
        ))}
    </div>
  );
}
