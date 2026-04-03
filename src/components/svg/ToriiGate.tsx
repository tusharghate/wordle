/**
 * ToriiGate — Decorative torii gate silhouette, fades in gently.
 * Ultra-subtle decorative element (3–5% opacity). Ink-filled silhouette.
 * Two-phase: fade-in entrance → very slow drift ambient loop.
 * Sigil component. Prefix: tg-
 */

interface ToriiGateProps {
  width?: number;
  /** Ink color — default matches sumi ink palette */
  color?: string;
  /** Overall opacity multiplier (0–1). Combine with the built-in low opacity. */
  opacity?: number;
  className?: string;
}

export function ToriiGate({
  width = 300,
  color = "#1a1814",
  opacity = 1,
  className,
}: ToriiGateProps) {
  const height = Math.round(width * (200 / 300));

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={["tg-root", className].filter(Boolean).join(" ")}
      aria-label="Torii gate decorative element"
      role="img"
      style={{ opacity }}
    >
      <style>{`
        /* ── Entrance: slow fade in ── */
        @keyframes tg-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Ambient: barely perceptible vertical float ── */
        @keyframes tg-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-2.5px); }
        }

        .tg-gate {
          opacity: 0;
          animation:
            tg-fade 2.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards,
            tg-float 8s ease-in-out 2.8s infinite;
        }

        /* Shimmer on the kasagi (top beam) — very subtle */
        @keyframes tg-kasagi-shim {
          0%   { transform: translateX(-320px); }
          100% { transform: translateX(320px); }
        }

        .tg-kasagi-shim {
          animation: tg-kasagi-shim 5.5s ease-in-out 3.2s infinite;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .tg-root, .tg-root * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            opacity: 0.04 !important;
            transform: none !important;
          }
        }
      `}</style>

      <defs>
        <linearGradient id="tg-shim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={color} stopOpacity="0" />
          <stop offset="45%"  stopColor={color} stopOpacity="0.07" />
          <stop offset="50%"  stopColor={color} stopOpacity="0.12" />
          <stop offset="55%"  stopColor={color} stopOpacity="0.07" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>

        {/* Clip to the kasagi beam */}
        <clipPath id="tg-kasagi-clip">
          <rect x="10" y="24" width="280" height="32" />
        </clipPath>
      </defs>

      <g className="tg-gate" fillOpacity="0.045">
        {/*
          Torii anatomy (top → bottom):
          1. Kasagi (笠木) — curved top beam with upswept ends
          2. Shimaki (島木) — second straight beam below kasagi
          3. Nuki (貫) — horizontal crossbar between the two pillars
          4. Two pillars (hashira)
          5. Diagonal supports (nemaki / base reinforcements)
        */}

        {/* ── Kasagi: curved top beam with upswept ends ── */}
        {/* The kasagi curves upward and the ends sweep up and out — signature torii shape */}
        <path
          d="M 20 48
             Q 30 56 50 58
             L 50 34
             Q 50 28 58 26
             L 242 26
             Q 250 28 250 34
             L 250 58
             Q 270 56 280 48
             Q 268 32 250 30
             L 250 24
             L 58 24
             L 58 30
             Q 32 32 20 48 Z"
          fill={color}
          fillOpacity="0.045"
        />

        {/* ── Shimaki: second beam (straight, below kasagi) ── */}
        <rect
          x="50" y="60"
          width="200" height="14"
          rx="1"
          fill={color}
          fillOpacity="0.04"
        />

        {/* ── Nuki: horizontal crossbar (roughly middle of pillars) ── */}
        <rect
          x="66" y="120"
          width="168" height="10"
          rx="1"
          fill={color}
          fillOpacity="0.038"
        />

        {/* ── Left pillar ── */}
        <rect
          x="76" y="74"
          width="18" height="122"
          rx="2"
          fill={color}
          fillOpacity="0.042"
        />

        {/* ── Right pillar ── */}
        <rect
          x="206" y="74"
          width="18" height="122"
          rx="2"
          fill={color}
          fillOpacity="0.042"
        />

        {/* ── Left pillar base kutsunugi (slight splay at base) ── */}
        <path
          d="M72 178 L76 178 L76 196 L94 196 L94 178 L98 178 L98 196 Q85 200 72 196 Z"
          fill={color}
          fillOpacity="0.038"
        />

        {/* ── Right pillar base ── */}
        <path
          d="M202 178 L206 178 L206 196 L224 196 L224 178 L228 178 L228 196 Q215 200 202 196 Z"
          fill={color}
          fillOpacity="0.038"
        />

        {/* ── Shimmer on kasagi ── */}
        <g clipPath="url(#tg-kasagi-clip)">
          <rect
            x="-60" y="24"
            width="60" height="32"
            fill="url(#tg-shim)"
            className="tg-kasagi-shim"
          />
        </g>
      </g>
    </svg>
  );
}
