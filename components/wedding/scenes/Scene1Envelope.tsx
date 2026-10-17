'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { withBasePath } from '@/lib/utils';
import TravelStamp from '../TravelStamp';

interface SceneProps {
  onNext: () => void;
  onPrev: () => void;
  isActive: boolean;
}

// Map coordinates in the world-map.svg viewBox (1000 x 581, Mercator)
const MAP_W = 1000;
const MAP_H = 581;
const ISTANBUL = { x: 552.7, y: 262.6 };
const VENDRYNE = { x: 524.2, y: 228.3 };

const PINK = '#d99aac';

// Order on open: map -> Turkey & Czechia appear -> text -> plane flies a heart
// around the invitation text and lands in Czechia
const MAP_IN = 0.1;
const PLACES_IN = 1.0;
const FLIGHT_START = 2.6;
const FLIGHT_DURATION = 13;
// gentle take-off and landing, steady cruising speed in between
const FLIGHT_EASE = [0.3, 0.12, 0.7, 0.88] as const;
const LANDED = FLIGHT_START + FLIGHT_DURATION;
// the plane flies all the way to Czechia; the dashed line stays behind its tail
const PLANE_END = 1;
const PLANE_TAIL_PX = 14;
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

type Box = { x: number; y: number; w: number; h: number };

// Flight in page pixels: Turkey -> down to the top of the heart -> a heart
// that wraps the invitation text -> back up to Czechia
function buildFlightPath(map: Box, text: Box, pageWidth: number) {
  const tx = map.x + (ISTANBUL.x / MAP_W) * map.w;
  const ty = map.y + (ISTANBUL.y / MAP_H) * map.h;
  const vx = map.x + (VENDRYNE.x / MAP_W) * map.w;
  const vy = map.y + (VENDRYNE.y / MAP_H) * map.h;

  // Classic heart drawn in a 0..1 box: rounded lobes, V-shaped dip at the top
  // (0.5, 0.3) and a point at the bottom (0.5, 1). The text sits between
  // y = 0.33 and y = 0.72, where the heart is widest.
  const cx = text.x + text.w / 2;
  const W = Math.min(text.w * 1.45, pageWidth - 10);
  const H = text.h / (0.72 - 0.33);
  const left = cx - W / 2;
  const top = text.y - 0.33 * H;
  const P = (x: number, y: number) => `${(left + x * W).toFixed(1)} ${(top + y * H).toFixed(1)}`;
  const notch = { x: cx, y: top + 0.3 * H };
  const f = (n: number) => n.toFixed(1);

  const entry = `M${f(tx)} ${f(ty)} C${f(tx)} ${f(ty + (notch.y - ty) * 0.5)} ${P(0.62, 0.15)} ${P(0.5, 0.3)}`;
  const d = [
    // glide down from Turkey into the dip of the heart
    entry,
    // left half: lobe, side, down to the point
    `C${P(0.42, 0.2)} ${P(0.35, 0.15)} ${P(0.25, 0.15)}`,
    `C${P(0.05, 0.15)} ${P(0, 0.32)} ${P(0, 0.42)}`,
    `C${P(0, 0.62)} ${P(0.25, 0.8)} ${P(0.5, 1)}`,
    // right half: up the side, over the lobe, back into the dip
    `C${P(0.75, 0.8)} ${P(1, 0.62)} ${P(1, 0.42)}`,
    `C${P(1, 0.32)} ${P(0.95, 0.15)} ${P(0.75, 0.15)}`,
    `C${P(0.65, 0.15)} ${P(0.58, 0.2)} ${P(0.5, 0.3)}`,
    // and up to Czechia
    `C${P(0.38, 0.15)} ${f(vx)} ${f(vy + (notch.y - vy) * 0.5)} ${f(vx)} ${f(vy)}`,
  ].join(' ');

  // Stamp goes in the lower part of the heart, between the text and the point
  const stampSize = Math.min(84, W * 0.21, H * 0.17);
  return { d, entry, notch, stamp: { x: cx, y: top + 0.835 * H, size: stampSize } };
}

type Point = { x: number; y: number };

// Lengths of SVG paths, measured by the browser
function pathLengths(...paths: string[]) {
  if (typeof document === 'undefined') return paths.map(() => 0);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.position = 'absolute';
  svg.style.visibility = 'hidden';
  const els = paths.map((d) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    return el;
  });
  svg.append(...els);
  document.body.appendChild(svg);
  const lengths = els.map((el) => el.getTotalLength());
  svg.remove();
  return lengths;
}

export default function Scene1Envelope(_props: SceneProps) {
  const { t, language } = useLanguage();
  const pageRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<{ d: string; w: number; h: number; notch: Point; notchAt: number; stamp: { x: number; y: number; size: number } } | null>(null);
  const routeLength = useRef(1);

  // One shared clock for the plane and the line, so the line is always drawn
  // right behind the plane's tail and never appears ahead of it
  const progress = useMotionValue(0);
  useEffect(() => {
    const flightAnimation = animate(progress, 1, { duration: FLIGHT_DURATION, delay: FLIGHT_START, ease: FLIGHT_EASE });
    return () => flightAnimation.stop();
  }, [progress]);
  const planeDistance = useTransform(progress, (p) => `${p * PLANE_END * 100}%`);
  const planeOpacity = useTransform(progress, (p) => (p > 0 ? 1 : 0));
  const lineDrawn = useTransform(progress, (p) => Math.max(0, p * PLANE_END - PLANE_TAIL_PX / routeLength.current));
  // the dip waypoint pops exactly when the plane reaches it
  const [notchReached, setNotchReached] = useState(false);
  useMotionValueEvent(progress, 'change', (p) => {
    if (!notchReached && flight && p * PLANE_END >= flight.notchAt) setNotchReached(true);
  });

  // Measure layout (ignoring animation transforms) and rebuild the route when it changes
  useLayoutEffect(() => {
    const page = pageRef.current;
    const map = mapRef.current;
    const text = textRef.current;
    if (!page || !map || !text) return;
    const box = (el: HTMLElement): Box => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
    const update = () => {
      const { d, entry, notch, stamp } = buildFlightPath(box(map), box(text), page.offsetWidth);
      const [entryLength, fullLength] = pathLengths(entry, d);
      routeLength.current = fullLength || 1;
      setFlight({ d, notch, stamp, notchAt: entryLength / routeLength.current, w: page.offsetWidth, h: page.offsetHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    [page, map, text].forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [language]);

  return (
    <div className="relative w-full h-full bg-[#fffdfa] overflow-y-auto overflow-x-hidden">
      <div
        ref={pageRef}
        className="relative flex flex-col items-center justify-center min-h-full px-4 pt-16 pb-6 text-center text-[#4a4a4a]"
      >
        <motion.h1 {...fadeUp(PLACES_IN + 0.3)} className="font-script leading-none" style={{ fontSize: 'clamp(2.6rem, 11vw, 4.2rem)' }}>
          Erol &amp; Klaudie
        </motion.h1>
        <motion.p {...fadeUp(PLACES_IN + 0.5)} className="font-serif mt-2" style={{ fontSize: 'clamp(1.15rem, 5vw, 1.6rem)' }}>
          {t.travel.married}
        </motion.p>

        {/* World map with Turkey and Czechia */}
        <motion.div
          ref={mapRef}
          className="relative w-full max-w-[640px] mt-6"
          style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: MAP_IN, ease: 'easeOut' }}
        >
          <img src={withBasePath('/intro/world-map.svg')} alt="" className="absolute inset-0 w-full h-full" draggable={false} />

          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 w-full h-full overflow-visible">
            {/* Start: Turkey */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: PLACES_IN, duration: 0.6 }}>
              <circle cx={ISTANBUL.x} cy={ISTANBUL.y} r="9" fill="white" stroke={PINK} strokeWidth="4" />
              <text x={ISTANBUL.x + 16} y={ISTANBUL.y + 30} fontSize="34" fill="#4a4a4a" fontFamily="var(--font-serif)">
                {t.travel.from}
              </text>
            </motion.g>

            {/* Destination pin: Czechia - appears with Turkey, bounces when the plane lands */}
            <motion.g
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: PLACES_IN, duration: 0.6, ease: [0.3, 1.5, 0.5, 1] }}
            >
              <g transform={`translate(${VENDRYNE.x} ${VENDRYNE.y})`}>
                <motion.g
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                  animate={{ scale: [1, 1, 1.35, 0.95, 1.1, 1] }}
                  transition={{
                    duration: LANDED + 0.8,
                    times: [0, LANDED / (LANDED + 0.8), (LANDED + 0.2) / (LANDED + 0.8), (LANDED + 0.4) / (LANDED + 0.8), (LANDED + 0.6) / (LANDED + 0.8), 1],
                  }}
                >
                  <path d="M0 0 C-6 -12 -22 -24 -22 -40 A22 22 0 1 1 22 -40 C22 -24 6 -12 0 0 Z" fill={PINK} />
                  <path
                    d="M0 -30 C-3 -34 -11 -36 -11 -43 C-11 -48 -6 -50 -3 -50 C-1.5 -50 -0.5 -49 0 -48 C0.5 -49 1.5 -50 3 -50 C6 -50 11 -48 11 -43 C11 -36 3 -34 0 -30 Z"
                    fill="white"
                  />
                  <text x="-30" y="-30" textAnchor="end" fontSize="34" fill="#4a4a4a" fontFamily="var(--font-serif)">
                    {t.travel.to}
                  </text>
                </motion.g>
              </g>
            </motion.g>
          </svg>
        </motion.div>

        {/* Invitation text - the plane draws a heart around this block.
            Narrower than the page and padded so the heart fits around it. */}
        <div ref={textRef} className="w-[78%] max-w-sm mt-20 mb-32">
          <motion.h2 {...fadeUp(PLACES_IN + 0.8)} className="font-serif" style={{ fontSize: 'clamp(1.6rem, 7vw, 2.3rem)' }}>
            {t.travel.invited}
          </motion.h2>
          <motion.p {...fadeUp(PLACES_IN + 1.0)} className="font-serif mt-2 leading-snug" style={{ fontSize: 'clamp(1rem, 4.2vw, 1.3rem)' }}>
            {t.travel.adventure}
          </motion.p>
          <motion.p {...fadeUp(PLACES_IN + 1.2)} className="font-serif mt-4" style={{ fontSize: 'clamp(1rem, 4.2vw, 1.25rem)' }}>
            14.08.2027 | Vendryně
          </motion.p>
        </div>

        {/* Flight route + plane, laid over the whole page */}
        {flight && (
          <>
            <svg
              className="absolute left-0 top-0 pointer-events-none overflow-visible"
              width={flight.w}
              height={flight.h}
              viewBox={`0 0 ${flight.w} ${flight.h}`}
            >
              <mask id="route-reveal" maskUnits="userSpaceOnUse">
                <motion.path
                  d={flight.d}
                  fill="none"
                  stroke="white"
                  strokeWidth="7"
                  style={{ pathLength: lineDrawn }}
                />
              </mask>
              <g mask="url(#route-reveal)">
                <path d={flight.d} fill="none" stroke={PINK} strokeWidth="4" strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round" />
                <path d={flight.d} fill="none" stroke="white" strokeWidth="2" strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Waypoint at the heart's dip, where the route lines meet - covers the junction */}
              <motion.circle
                cx={flight.notch.x}
                cy={flight.notch.y}
                r="5.5"
                fill={PINK}
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={notchReached ? { scale: [0, 1.5, 1] } : { scale: 0 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                transition={{ duration: 0.45 }}
              />
            </svg>

            {/* Plane follows the same route (CSS motion path) */}
            <motion.div
              className="absolute left-0 top-0 pointer-events-none"
              style={{
                offsetPath: `path("${flight.d}")`,
                offsetRotate: 'auto',
                offsetDistance: planeDistance,
                opacity: planeOpacity,
                width: 30,
                height: 30,
              }}
            >
              <svg viewBox="-16 -13 32 26" className="w-full h-full overflow-visible">
                <path
                  d="M14 0 L4 -2.5 L-3 -11 L-7 -11 L-2 -2.5 L-9 -2.5 L-12 -6.5 L-14.5 -6.5 L-13 0 L-14.5 6.5 L-12 6.5 L-9 2.5 L-2 2.5 L-7 11 L-3 11 L4 2.5 Z"
                  fill={PINK}
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* "Erol / Klaudie" travel stamp, stamped on just after landing */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: flight.stamp.x - flight.stamp.size / 2,
                top: flight.stamp.y - flight.stamp.size / 2,
                width: flight.stamp.size,
                height: flight.stamp.size,
              }}
              initial={{ opacity: 0, scale: 1.9, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ delay: LANDED + 0.3, duration: 0.45, ease: [0.5, 0, 0.75, 0] }}
            >
              <TravelStamp top="Erol" bottom="Klaudie" />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
