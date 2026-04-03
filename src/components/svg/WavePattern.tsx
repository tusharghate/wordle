/**
 * WavePattern — Traditional Japanese seigaiha (青海波) wave pattern.
 * Repeating tile that subtly animates with a slow shimmer drift.
 * Designed as a background texture — very low opacity.
 * Sigil component. Prefix: wp-
 *
 * The seigaiha pattern is composed of overlapping semicircles arranged
 * in offset rows, creating a fish-scale or wave appearance.
 * Classic Heian-period textile motif.
 */

interface WavePatternProps {
  /** Tile width in px — the pattern repeats at this interval */
  tileSize?: number;
  /** Color of the wave arcs */
  color?: string;
  /** Base opacity for the pattern (0–1, default: 0.06) */
  opacity?: number;
  /** Whether to animate the shimmer drift */
  animated?: boolean;
  className?: string;
}

export function WavePattern({
  tileSize = 100,
  color = "#1a1814",
  opacity = 0.06,
  animated = true,
  className,
}: WavePatternProps) {
  /**
   * Seigaiha geometry:
   * - Each "scale" is a semicircle of radius R
   * - Scales are arranged in rows, offset by R horizontally
   * - Row vertical spacing: R (so they overlap by half)
   * - The defining characteristic: each arc overlaps the two below it
   *
   * For tileSize=100:
   * R = 25 → 4 scales wide × 4 rows tall (with partial scales at edges for seamless tiling)
   */
  const R = tileSize / 4; // radius of each seigaiha arc
  const cols = 5; // one extra for offset row tiling
  const rows = 5;

  // Generate arc paths for the seigaiha pattern within the tile
  const arcs: Array<{ cx: number; cy: number; r: number; row: number; col: number }> = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Offset every other row by R
      const offsetX = row % 2 === 0 ? 0 : R;
      const cx = col * R * 2 + offsetX;
      const cy = row * R;
      arcs.push({ cx, cy, r: R, row, col });
    }
  }

  const svgWidth  = tileSize;
  const svgHeight = tileSize;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={["wp-root", className].filter(Boolean).join(" ")}
      aria-label="Seigaiha wave pattern background texture"
      role="img"
      style={{ opacity }}
    >
      <style>{`
        /* ── Ambient shimmer drift ── */
        @keyframes wp-drift {
          0%   { transform: translateX(0px)   translateY(0px); }
          33%  { transform: translateX(4px)   translateY(-2px); }
          66%  { transform: translateX(-2px)  translateY(3px); }
          100% { transform: translateX(0px)   translateY(0px); }
        }

        /* ── Slow opacity wave ── */
        @keyframes wp-wave {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.65; }
        }

        .wp-pattern {
          animation:
            wp-wave 7s ease-in-out infinite,
            wp-drift 11s ease-in-out infinite;
        }

        .wp-no-anim .wp-pattern {
          animation: none;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .wp-root, .wp-root * {
            animation: none !important;
          }
        }
      `}</style>

      <defs>
        {/* Clip to tile bounds for clean tiling */}
        <clipPath id="wp-tile-clip">
          <rect x="0" y="0" width={svgWidth} height={svgHeight} />
        </clipPath>

        {/* Subtle vignette fade at tile edges for smooth repeat */}
        <radialGradient id="wp-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </radialGradient>
      </defs>

      <g clipPath="url(#wp-tile-clip)" className={animated ? "wp-pattern" : "wp-no-anim"}>
        {arcs.map(({ cx, cy, r, row, col }) => {
          // Each seigaiha "scale":
          // 1. A filled semicircle (bottom half) for the body
          // 2. A set of concentric arc lines for the pattern detail
          const concentric = [0.75, 0.5, 0.25];

          return (
            <g key={`${row}-${col}`}>
              {/* Scale body: semicircle (top arc, flat bottom) */}
              <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`}
                fill={color}
                fillOpacity="0.08"
                stroke={color}
                strokeWidth="0.6"
                strokeOpacity="0.5"
              />

              {/* Concentric arc lines inside the scale */}
              {concentric.map((ratio, i) => (
                <path
                  key={i}
                  d={`M ${cx - r * ratio} ${cy} A ${r * ratio} ${r * ratio} 0 0 1 ${cx + r * ratio} ${cy}`}
                  stroke={color}
                  strokeWidth="0.35"
                  strokeOpacity={0.3 - i * 0.08}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
