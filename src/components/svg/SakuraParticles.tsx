/**
 * SakuraParticles — Cherry blossom particle overlay for win celebration.
 * Full viewport, 20 petals with staggered fall + rotation loops.
 * Sigil component. Prefix: sp-
 *
 * Props:
 *   visible — controls whether particles are rendered into the DOM
 */

interface SakuraParticlesProps {
  visible?: boolean;
  className?: string;
}

/**
 * Five-petal sakura flower rendered inline with transforms.
 * petalColor: fill color
 * centerColor: stamen dot
 */
function SakuraFlower({ x, y, r, petalColor, centerColor }: {
  x: number; y: number; r: number;
  petalColor: string; centerColor: string;
}) {
  const angles = [0, 72, 144, 216, 288];
  const petalDist = r * 0.55;
  const petalW = r * 0.38;
  const petalH = r * 0.55;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {angles.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const px = Math.cos(rad) * petalDist;
        const py = Math.sin(rad) * petalDist;
        return (
          <ellipse
            key={angle}
            cx={px}
            cy={py}
            rx={petalW}
            ry={petalH}
            fill={petalColor}
            fillOpacity="0.78"
            transform={`rotate(${angle + 90}, ${px}, ${py})`}
          />
        );
      })}
      {/* Center stamen dot */}
      <circle cx="0" cy="0" r={r * 0.18} fill={centerColor} fillOpacity="0.9" />
    </g>
  );
}

// Petal configuration: 20 particles with varied positions, sizes, colors, timings
const PETALS = [
  { id: "sp-p0",  x: 8,   delay: 0.0,  dur: 7.2,  size: 12, color: "#d4a0a7", swing: 28,  rot: 210 },
  { id: "sp-p1",  x: 18,  delay: 0.8,  dur: 8.4,  size: 9,  color: "#e8c4ca", swing: -22, rot: 140 },
  { id: "sp-p2",  x: 30,  delay: 1.6,  dur: 6.8,  size: 14, color: "#f0d8dd", swing: 35,  rot: 300 },
  { id: "sp-p3",  x: 42,  delay: 0.3,  dur: 9.1,  size: 10, color: "#d4a0a7", swing: -18, rot: 60  },
  { id: "sp-p4",  x: 55,  delay: 2.1,  dur: 7.7,  size: 13, color: "#e8c4ca", swing: 24,  rot: 180 },
  { id: "sp-p5",  x: 67,  delay: 1.1,  dur: 8.0,  size: 11, color: "#f0d8dd", swing: -30, rot: 90  },
  { id: "sp-p6",  x: 78,  delay: 0.5,  dur: 7.4,  size: 15, color: "#d4a0a7", swing: 20,  rot: 240 },
  { id: "sp-p7",  x: 87,  delay: 3.0,  dur: 6.5,  size: 9,  color: "#e8c4ca", swing: -25, rot: 330 },
  { id: "sp-p8",  x: 95,  delay: 1.8,  dur: 8.8,  size: 12, color: "#f0d8dd", swing: 32,  rot: 120 },
  { id: "sp-p9",  x: 12,  delay: 4.2,  dur: 7.1,  size: 10, color: "#d4a0a7", swing: -16, rot: 270 },
  { id: "sp-p10", x: 25,  delay: 3.5,  dur: 8.3,  size: 14, color: "#e8c4ca", swing: 26,  rot: 45  },
  { id: "sp-p11", x: 38,  delay: 2.7,  dur: 7.6,  size: 11, color: "#f0d8dd", swing: -34, rot: 195 },
  { id: "sp-p12", x: 50,  delay: 4.8,  dur: 6.9,  size: 13, color: "#d4a0a7", swing: 18,  rot: 315 },
  { id: "sp-p13", x: 62,  delay: 1.4,  dur: 9.3,  size: 9,  color: "#e8c4ca", swing: -28, rot: 75  },
  { id: "sp-p14", x: 73,  delay: 5.1,  dur: 7.8,  size: 15, color: "#f0d8dd", swing: 22,  rot: 165 },
  { id: "sp-p15", x: 83,  delay: 2.4,  dur: 8.1,  size: 10, color: "#d4a0a7", swing: -20, rot: 285 },
  { id: "sp-p16", x: 91,  delay: 3.9,  dur: 7.0,  size: 12, color: "#e8c4ca", swing: 30,  rot: 105 },
  { id: "sp-p17", x: 5,   delay: 5.6,  dur: 8.6,  size: 11, color: "#f0d8dd", swing: -24, rot: 225 },
  { id: "sp-p18", x: 47,  delay: 0.9,  dur: 7.3,  size: 14, color: "#d4a0a7", swing: 36,  rot: 345 },
  { id: "sp-p19", x: 70,  delay: 4.4,  dur: 8.9,  size: 9,  color: "#e8c4ca", swing: -14, rot: 135 },
];

export function SakuraParticles({ visible = false, className }: SakuraParticlesProps) {
  if (!visible) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={["sp-root", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 50,
        overflow: "hidden",
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <style>{`
        /* ── Petal fall: vertical drop with horizontal swing ── */
        @keyframes sp-fall {
          0%   { transform: translateY(-8vh) translateX(0px); opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(108vh) translateX(var(--swing)); opacity: 0; }
        }

        /* ── Petal rotation (separate so it runs on its own rhythm) ── */
        @keyframes sp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(var(--rot-end)); }
        }

        /* ── Gentle sway while falling ── */
        @keyframes sp-sway {
          0%, 100% { transform: translateX(0); }
          25%       { transform: translateX(var(--sway-pos)); }
          75%       { transform: translateX(var(--sway-neg)); }
        }

        .sp-petal-group {
          animation: sp-fall var(--dur) linear var(--delay) infinite;
        }

        .sp-petal-inner {
          transform-origin: center center;
          animation: sp-spin var(--spin-dur) ease-in-out var(--delay) infinite;
        }

        /* ── Reduced motion: just show a static gentle float, no fall ── */
        @media (prefers-reduced-motion: reduce) {
          .sp-root, .sp-root * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            opacity: 0.4 !important;
          }
        }
      `}</style>

      {PETALS.map((p) => (
        <g
          key={p.id}
          className="sp-petal-group"
          style={{
            "--dur": `${p.dur}s`,
            "--delay": `${p.delay}s`,
            "--swing": `${p.swing}px`,
          } as React.CSSProperties}
          transform={`translate(${p.x}, -5)`}
        >
          <g
            className="sp-petal-inner"
            style={{
              "--rot-end": `${p.rot}deg`,
              "--spin-dur": `${p.dur * 0.7}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties}
          >
            <SakuraFlower
              x={0}
              y={0}
              r={p.size * 0.5}
              petalColor={p.color}
              centerColor="#c4841d"
            />
          </g>
        </g>
      ))}
    </svg>
  );
}
