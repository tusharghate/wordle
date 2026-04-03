/**
 * InkSplash — One-shot ink splatter animation for tile reveal moments.
 * Plays once when `animate` prop changes to true. Uses key prop trick
 * to re-trigger on repeat reveals.
 * Sigil component. Prefix: is-
 *
 * Props:
 *   animate — when true, the animation plays
 *   size    — component size in px (default: 40)
 */

import { useMemo } from "react";

interface InkSplashProps {
  animate?: boolean;
  size?: number;
  className?: string;
}

/**
 * Generates splash droplet path around origin.
 * Each droplet is a teardrop pointing away from center.
 */
function splashDroplets(count: number, cx: number, cy: number): Array<{
  d: string;
  delay: number;
  dist: number;
  angle: number;
  scale: number;
}> {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (i % 3 === 0 ? 0.15 : -0.08);
    const dist = 9 + (i % 4) * 2.5 + (i % 3) * 1.5;
    const scale = 0.45 + (i % 5) * 0.15;
    const ex = cx + Math.cos(angle) * dist;
    const ey = cy + Math.sin(angle) * dist;
    const mx = cx + Math.cos(angle) * (dist * 0.45);
    const my = cy + Math.sin(angle) * (dist * 0.45);
    // Perpendicular offset for teardrop width
    const perp = angle + Math.PI / 2;
    const w = 1.2 * scale;
    const cx1 = mx + Math.cos(perp) * w;
    const cy1 = my + Math.sin(perp) * w;
    const cx2 = mx - Math.cos(perp) * w;
    const cy2 = my - Math.sin(perp) * w;
    const d = `M ${cx},${cy} Q ${cx1},${cy1} ${ex},${ey} Q ${cx2},${cy2} ${cx},${cy} Z`;
    return { d, delay: i * 0.028, dist, angle, scale };
  });
}

export function InkSplash({ animate = false, size = 40, className }: InkSplashProps) {
  const cx = 20;
  const cy = 20;
  const droplets = useMemo(() => splashDroplets(11, cx, cy), []);

  return (
    // Key on animate forces DOM remount → re-triggers animations on each true transition
    <svg
      key={animate ? "active" : "idle"}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={["is-root", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      role="presentation"
    >
      <style>{`
        /* ── Core splash: scale up from center ── */
        @keyframes is-splash {
          0%   { transform: scale(0);     opacity: 0; }
          15%  { transform: scale(1.3);   opacity: 1; }
          45%  { transform: scale(1.0);   opacity: 0.9; }
          100% { transform: scale(1.08);  opacity: 0; }
        }

        /* ── Droplet fly-out ── */
        @keyframes is-drop {
          0%   { transform: translate(0, 0) scale(0); opacity: 0; }
          20%  { transform: translate(var(--tx), var(--ty)) scale(1.1); opacity: 1; }
          55%  { transform: translate(var(--tx2), var(--ty2)) scale(0.9); opacity: 0.7; }
          100% { transform: translate(var(--tx3), var(--ty3)) scale(0.3); opacity: 0; }
        }

        /* ── Center burst: ink blot ── */
        @keyframes is-burst {
          0%   { r: 0;   opacity: 0; }
          20%  { r: 4.5; opacity: 0.9; }
          55%  { r: 3.8; opacity: 0.7; }
          100% { r: 5.5; opacity: 0; }
        }

        /* ── Ring ripple ── */
        @keyframes is-ring {
          0%   { r: 2; stroke-width: 2; opacity: 0.6; }
          100% { r: 12; stroke-width: 0.3; opacity: 0; }
        }

        .is-root {
          pointer-events: none;
        }

        .is-center {
          transform-origin: ${cx}px ${cy}px;
        }

        .is-droplet {
          transform-origin: ${cx}px ${cy}px;
          animation: is-drop 0.55s cubic-bezier(0.4, 0, 0.2, 1) var(--delay) forwards;
        }

        .is-burst-circle {
          animation: is-burst 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0s forwards;
        }

        .is-ring {
          animation: is-ring 0.65s ease-out 0.05s forwards;
        }

        /* ── Idle: invisible ── */
        .is-idle .is-droplet,
        .is-idle .is-burst-circle,
        .is-idle .is-ring {
          opacity: 0;
          animation: none;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .is-root, .is-root * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            opacity: 0 !important;
          }
        }
      `}</style>

      <defs>
        <radialGradient id="is-ink" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#1a1814" stopOpacity="1" />
          <stop offset="70%"  stopColor="#1a1814" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#1a1814" stopOpacity="0" />
        </radialGradient>
        <filter id="is-blur">
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
      </defs>

      {animate && (
        <g className="is-center">
          {/* Ripple ring */}
          <circle
            cx={cx} cy={cy}
            r="2"
            stroke="#1a1814"
            strokeOpacity="0.45"
            fill="none"
            className="is-ring"
          />

          {/* Center ink burst */}
          <circle
            cx={cx} cy={cy}
            r="0"
            fill="url(#is-ink)"
            className="is-burst-circle"
          />

          {/* Droplets */}
          {droplets.map((drop, i) => {
            const tx  = Math.cos(drop.angle) * drop.dist * 0.6;
            const ty  = Math.sin(drop.angle) * drop.dist * 0.6;
            const tx2 = Math.cos(drop.angle) * drop.dist * 1.0;
            const ty2 = Math.sin(drop.angle) * drop.dist * 1.0;
            const tx3 = Math.cos(drop.angle) * drop.dist * 1.2;
            const ty3 = Math.sin(drop.angle) * drop.dist * 1.2;
            return (
              <path
                key={i}
                d={drop.d}
                fill="#1a1814"
                fillOpacity="0.82"
                filter="url(#is-blur)"
                className="is-droplet"
                style={{
                  "--delay": `${drop.delay}s`,
                  "--tx": `${tx}px`,
                  "--ty": `${ty}px`,
                  "--tx2": `${tx2}px`,
                  "--ty2": `${ty2}px`,
                  "--tx3": `${tx3}px`,
                  "--ty3": `${ty3}px`,
                } as React.CSSProperties}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}
