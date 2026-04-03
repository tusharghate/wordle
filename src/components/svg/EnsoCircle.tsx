/**
 * EnsoCircle — Animated Zen ensō (円相) circle drawn in a single brushstroke.
 * Two-phase: stroke draws itself (entrance) → subtle opacity breathe (ambient loop).
 * Simulates brush pressure variation via gradient opacity along the stroke path.
 * Sigil component. Prefix: ec-
 */

interface EnsoCircleProps {
  size?: number;
  className?: string;
}

export function EnsoCircle({ size = 60, className }: EnsoCircleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={["ec-root", className].filter(Boolean).join(" ")}
      aria-label="Ensō — Zen circle drawn in one brushstroke"
      role="img"
    >
      <style>{`
        /* ── Entrance: stroke draws itself ── */
        @keyframes ec-draw {
          0%   {
            stroke-dashoffset: 172;
            opacity: 0.15;
          }
          12%  { opacity: 1; }
          78%  { stroke-dashoffset: 12; }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        /* ── Ambient: very slow breath — ink settling ── */
        @keyframes ec-breathe {
          0%, 100% { opacity: 0.88; }
          50%       { opacity: 1; }
        }

        /* ── Ambient: barely perceptible scale pulse ── */
        @keyframes ec-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.018); }
        }

        /* ── Entrance fade-in for the gap (brush lift) ── */
        @keyframes ec-gap-in {
          0%, 75%  { opacity: 0; }
          100%     { opacity: 1; }
        }

        .ec-main-stroke {
          stroke-dasharray: 172;
          stroke-dashoffset: 172;
          animation:
            ec-draw 2.0s cubic-bezier(0.4, 0, 0.2, 1) forwards,
            ec-breathe 4.2s ease-in-out 2.2s infinite;
        }

        .ec-root-g {
          transform-origin: 30px 30px;
          animation: ec-pulse 5.0s ease-in-out 2.2s infinite;
        }

        /* The brush-lift gap appears after the stroke finishes */
        .ec-gap {
          opacity: 0;
          animation: ec-gap-in 0.5s ease 1.8s forwards;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .ec-root, .ec-root * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <defs>
        {/*
          Brush pressure simulation: the stroke's opacity varies along its arc.
          We achieve this via a conic-gradient-like linearGradient used as stroke paint.
          Heavy ink at start (thick entry), lighter mid-stroke, heavy again at end.
        */}
        <linearGradient id="ec-ink" x1="30" y1="4" x2="30" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1a1814" stopOpacity="0.95" />
          <stop offset="30%"  stopColor="#1a1814" stopOpacity="0.75" />
          <stop offset="60%"  stopColor="#1a1814" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#1a1814" stopOpacity="1" />
        </linearGradient>

        {/* Second pass gradient for the tail — even darker to simulate drag */}
        <linearGradient id="ec-ink-tail" x1="56" y1="30" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1a1814" stopOpacity="1" />
          <stop offset="100%" stopColor="#1a1814" stopOpacity="0.6" />
        </linearGradient>

        {/* Gap background (washi paper color) to simulate brush lift */}
        <filter id="ec-blur-edge">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>

      <g className="ec-root-g">
        {/*
          The ensō circle:
          — Near-full circle (≈340°) leaving a deliberate gap at top-right
          — strokeWidth varies conceptually; we layer two strokes for depth
          — Path starts at top (12 o'clock position) going clockwise
        */}

        {/* Shadow/depth layer — slightly thicker, more transparent */}
        <path
          d="M30 5
             A 25 25 0 1 1 51.5 16.5"
          stroke="#1a1814"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.12"
          filter="url(#ec-blur-edge)"
          className="ec-main-stroke"
        />

        {/* Primary ink stroke */}
        <path
          d="M30 5
             A 25 25 0 1 1 51.5 16.5"
          stroke="url(#ec-ink)"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
          className="ec-main-stroke"
        />

        {/*
          Brush tail: a short secondary stroke at the endpoint to simulate
          the drag and thinning as the brush lifts. Starts at endpoint.
        */}
        <path
          d="M51.5 16.5 L53 14"
          stroke="#1a1814"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          className="ec-gap"
        />

        {/*
          Entry thickening: a subtle filled ellipse at the stroke start
          to simulate the initial ink deposit as the brush touches paper.
        */}
        <ellipse
          cx="30" cy="5"
          rx="2.8" ry="2.0"
          fill="#1a1814"
          fillOpacity="0.35"
          transform="rotate(-15, 30, 5)"
          className="ec-gap"
        />
      </g>
    </svg>
  );
}
