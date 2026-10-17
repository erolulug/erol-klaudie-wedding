'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const PINK = '#d99aac';
const FLIGHT_DURATION = 9;
const PLANE_PATH =
  'M14 0 L4 -2.5 L-3 -11 L-7 -11 L-2 -2.5 L-9 -2.5 L-12 -6.5 L-14.5 -6.5 L-13 0 L-14.5 6.5 L-12 6.5 L-9 2.5 L-2 2.5 L-7 11 L-3 11 L4 2.5 Z';

// Rows are staggered like stops along a winding flight route (% of width)
const INDENTS = [4, 20, 30, 12, 24, 8];

export interface TimelineItem {
  time: string;
  title: string;
  action?: React.ReactNode;
}

type Point = { x: number; y: number };

// Smooth curve through the points (Catmull-Rom converted to cubic Béziers)
function smoothPath(pts: Point[]) {
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

// Event timeline drawn as a dashed flight route: the plane flies through
// each event's dot, like the page-1 flight.
export default function FlightTimeline({ items }: { items: TimelineItem[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const inView = useInView(boxRef, { once: true, amount: 0.3 });
  const [route, setRoute] = useState<{ d: string; w: number; h: number; stops: number[] } | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => {
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (!dots.length) return;
      // offset* ignore animation transforms; walk up to the timeline box
      const centre = (el: HTMLElement): Point => {
        let x = el.offsetWidth / 2;
        let y = el.offsetHeight / 2;
        let node: HTMLElement | null = el;
        while (node && node !== box) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return { x, y };
      };
      const W = box.offsetWidth;
      const stops = dots.map(centre);
      const first = stops[0];
      const last = stops[stops.length - 1];
      // glide in from above the first stop, then through every stop, then out
      const pts: Point[] = [
        { x: first.x + 40, y: first.y - 80 },
        ...stops,
        { x: last.x + 30, y: last.y + 55 },
        { x: W * 0.6, y: last.y + 85 },
        { x: W * 0.9, y: last.y + 125 },
      ];
      // share of the route length at which the plane reaches each stop
      let total = 0;
      const lengthAt = pts.map((p, i) => (i ? (total += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y)) : 0));
      const stopShare = stops.map((_, i) => lengthAt[1 + i] / total);
      setRoute({ d: smoothPath(pts), w: W, h: box.offsetHeight, stops: stopShare });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, [items]);

  return (
    <div ref={boxRef} className="relative pt-20 pb-36">
      {route && (
        <>
          <svg
            className="absolute left-0 top-0 pointer-events-none overflow-visible"
            width={route.w}
            height={route.h}
            viewBox={`0 0 ${route.w} ${route.h}`}
          >
            <mask id="timeline-reveal" maskUnits="userSpaceOnUse">
              <motion.path
                d={route.d}
                fill="none"
                stroke="white"
                strokeWidth="12"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: FLIGHT_DURATION, ease: 'linear' }}
              />
            </mask>
            <g mask="url(#timeline-reveal)">
              <path d={route.d} fill="none" stroke={PINK} strokeWidth="4" strokeDasharray="7 6" strokeLinecap="round" />
              <path d={route.d} fill="none" stroke="white" strokeWidth="2" strokeDasharray="7 6" strokeLinecap="round" />
            </g>
          </svg>

          <motion.div
            className="absolute left-0 top-0 pointer-events-none z-10"
            style={{ offsetPath: `path("${route.d}")`, offsetRotate: 'auto', width: 28, height: 28 }}
            initial={{ offsetDistance: '0%', opacity: 0 }}
            animate={inView ? { offsetDistance: '100%', opacity: 1 } : { offsetDistance: '0%', opacity: 0 }}
            transition={{ offsetDistance: { duration: FLIGHT_DURATION, ease: 'linear' }, opacity: { duration: 0.3 } }}
          >
            <svg viewBox="-16 -13 32 26" className="w-full h-full overflow-visible">
              <path d={PLANE_PATH} fill={PINK} stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </>
      )}

      <div className="space-y-9">
        {items.map((item, i) => (
          <div key={i} className="relative flex items-start text-left" style={{ paddingLeft: `${INDENTS[i % INDENTS.length]}%` }}>
            {/* Stop on the route - pops in as the plane passes */}
            <motion.span
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="relative z-[5] mt-2 flex-shrink-0 w-3.5 h-3.5 rounded-full bg-[#d99aac] border-2 border-white shadow"
              initial={{ scale: 0 }}
              animate={inView && route ? { scale: [0, 1.5, 1] } : { scale: 0 }}
              transition={{ duration: 0.45, delay: (route?.stops[i] ?? 0) * FLIGHT_DURATION }}
            />
            <div className="ml-4 flex-1">
              <p className="font-serif text-xl font-bold text-gray-700 tracking-wide">{item.time}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="font-serif text-base font-medium text-gray-700 uppercase tracking-wider">{item.title}</p>
                {item.action}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
