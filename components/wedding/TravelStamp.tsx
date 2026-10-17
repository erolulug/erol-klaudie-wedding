'use client';

// Round "passport" ink stamp: names curved along the top and bottom,
// stars on the sides and a plane in the middle. Drawn in SVG so it stays sharp.
const INK = '#c98399'; // rose, matching the heart and pin

export default function TravelStamp({ top, bottom }: { top: string; bottom: string }) {
  const stars = [158, 202, -22, 22].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: 100 + Math.cos(a) * 66, y: 100 + Math.sin(a) * 66 };
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
      <defs>
        {/* Slightly uneven, worn ink */}
        <filter id="stamp-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="1" seed="9" result="spots" />
          <feColorMatrix in="spots" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.45" result="mask" />
          <feComposite in="rough" in2="mask" operator="in" />
        </filter>
        {/* Text arcs: baselines placed so the names sit centred in the ring band */}
        <path id="stamp-top" d="M45.6 100 A54.4 54.4 0 0 1 154.4 100" />
        <path id="stamp-bottom" d="M26.1 100 A73.9 73.9 0 0 0 173.9 100" />
      </defs>

      <g filter="url(#stamp-ink)" fill={INK} stroke={INK}>
        <circle cx="100" cy="100" r="93" fill="none" strokeWidth="5" />
        <circle cx="100" cy="100" r="85" fill="none" strokeWidth="2" />
        <circle cx="100" cy="100" r="44" fill="none" strokeWidth="3.5" />
        <circle cx="100" cy="100" r="39" fill="none" strokeWidth="1.5" />

        <text fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="700" fontSize="28" letterSpacing="1.5" stroke="none">
          <textPath href="#stamp-top" startOffset="50%" textAnchor="middle">
            {top}
          </textPath>
        </text>
        <text fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="700" fontSize="26" letterSpacing="1" stroke="none">
          <textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">
            {bottom}
          </textPath>
        </text>

        {stars.map((s, i) => (
          <path
            key={i}
            transform={`translate(${s.x} ${s.y}) scale(0.55)`}
            d="M0 -10 L2.9 -3.1 L10 -3.1 L4.3 1.2 L6.5 8.1 L0 3.8 L-6.5 8.1 L-4.3 1.2 L-10 -3.1 L-2.9 -3.1 Z"
            stroke="none"
          />
        ))}

        {/* Plane heading up and to the right */}
        <path
          transform="translate(100 100) rotate(-35) scale(2)"
          d="M14 0 L4 -2.5 L-3 -11 L-7 -11 L-2 -2.5 L-9 -2.5 L-12 -6.5 L-14.5 -6.5 L-13 0 L-14.5 6.5 L-12 6.5 L-9 2.5 L-2 2.5 L-7 11 L-3 11 L4 2.5 Z"
          stroke="none"
        />
      </g>
    </svg>
  );
}
