/**
 * KotobaLogo — Animated brush stroke reveal for the "言葉" game logo.
 * Sigil component: stroke-first, two-phase animation (draw entrance → shimmer loop).
 * Prefix: kl-
 */

interface KotobaLogoProps {
  width?: number;
  className?: string;
}

export function KotobaLogo({ width = 200, className }: KotobaLogoProps) {
  const height = Math.round(width * 0.4); // 200×80 ratio

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={["kl-root", className].filter(Boolean).join(" ")}
      aria-label="Kotoba — 言葉 — Japanese word game"
      role="img"
    >
      <style>{`
        /* ── Entrance: brush draw ── */
        @keyframes kl-draw {
          0%   { stroke-dashoffset: var(--len); opacity: 0; }
          15%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        /* ── Entrance: fade in ── */
        @keyframes kl-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Ambient: shimmer sweep across the kanji ── */
        @keyframes kl-shimmer {
          0%   { transform: translateX(-110px); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(210px); opacity: 0; }
        }

        /* ── Ambient: subtle ink bleed pulse on the dot ── */
        @keyframes kl-dot-pulse {
          0%, 100% { r: 1.5; opacity: 0.7; }
          50%       { r: 2.5; opacity: 1; }
        }

        /* ── Kanji strokes ── */
        .kl-stroke {
          stroke: #1a1814;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          animation: kl-draw 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .kl-s1  { --len: 34;  stroke-dasharray: 34;  stroke-dashoffset: 34;  animation-delay: 0.05s; }
        .kl-s2  { --len: 28;  stroke-dasharray: 28;  stroke-dashoffset: 28;  animation-delay: 0.25s; }
        .kl-s3  { --len: 40;  stroke-dasharray: 40;  stroke-dashoffset: 40;  animation-delay: 0.42s; }
        .kl-s4  { --len: 18;  stroke-dasharray: 18;  stroke-dashoffset: 18;  animation-delay: 0.60s; }
        .kl-s5  { --len: 22;  stroke-dasharray: 22;  stroke-dashoffset: 22;  animation-delay: 0.72s; }
        .kl-s6  { --len: 14;  stroke-dasharray: 14;  stroke-dashoffset: 14;  animation-delay: 0.84s; }
        .kl-s7  { --len: 34;  stroke-dasharray: 34;  stroke-dashoffset: 34;  animation-delay: 0.98s; }
        .kl-s8  { --len: 28;  stroke-dasharray: 28;  stroke-dashoffset: 28;  animation-delay: 1.14s; }
        .kl-s9  { --len: 38;  stroke-dasharray: 38;  stroke-dashoffset: 38;  animation-delay: 1.28s; }
        .kl-s10 { --len: 20;  stroke-dasharray: 20;  stroke-dashoffset: 20;  animation-delay: 1.44s; }
        .kl-s11 { --len: 26;  stroke-dasharray: 26;  stroke-dashoffset: 26;  animation-delay: 1.56s; }
        .kl-s12 { --len: 16;  stroke-dasharray: 16;  stroke-dashoffset: 16;  animation-delay: 1.66s; }

        /* ── KOTOBA romanized label ── */
        .kl-label {
          opacity: 0;
          animation: kl-fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.9s forwards;
        }

        /* ── Decorative rule line ── */
        .kl-rule {
          --len: 140;
          stroke-dasharray: 140;
          stroke-dashoffset: 140;
          animation: kl-draw 0.9s cubic-bezier(0.4, 0, 0.2, 1) 1.75s forwards;
        }

        /* ── Shimmer overlay (starts after all strokes drawn) ── */
        .kl-shimmer-rect {
          animation: kl-shimmer 2.6s ease-in-out 2.8s infinite;
        }

        /* ── Accent dot ── */
        .kl-dot {
          opacity: 0;
          animation:
            kl-fade-in 0.4s ease 2.1s forwards,
            kl-dot-pulse 2.8s ease-in-out 2.8s infinite;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .kl-root, .kl-root * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <defs>
        {/* Ink shimmer gradient */}
        <linearGradient id="kl-shim-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#f7f3eb" stopOpacity="0" />
          <stop offset="40%"  stopColor="#f7f3eb" stopOpacity="0.22" />
          <stop offset="50%"  stopColor="#f7f3eb" stopOpacity="0.35" />
          <stop offset="60%"  stopColor="#f7f3eb" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f7f3eb" stopOpacity="0" />
        </linearGradient>

        {/* Clip to kanji area */}
        <clipPath id="kl-kanji-clip">
          <rect x="10" y="2" width="120" height="58" />
        </clipPath>

        {/* Sakura accent gradient for the rule */}
        <linearGradient id="kl-rule-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1a1814" stopOpacity="0" />
          <stop offset="20%"  stopColor="#1a1814" stopOpacity="0.5" />
          <stop offset="50%"  stopColor="#c73e3a" stopOpacity="0.8" />
          <stop offset="80%"  stopColor="#1a1814" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a1814" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ═══════════════════════════════════════════
          言 — "Word/speech" kanji (left character)
          Rendered as authentic stroke decomposition
          ═══════════════════════════════════════════ */}

      {/* 言: top horizontal stroke */}
      <line x1="16" y1="8" x2="54" y2="8"
        stroke="#1a1814" strokeWidth="2.2" strokeLinecap="round"
        className="kl-stroke kl-s1" />

      {/* 言: second horizontal (shorter) */}
      <line x1="22" y1="16" x2="48" y2="16"
        stroke="#1a1814" strokeWidth="2" strokeLinecap="round"
        className="kl-stroke kl-s2" />

      {/* 言: vertical center drop */}
      <line x1="35" y1="8" x2="35" y2="22"
        stroke="#1a1814" strokeWidth="1.8" strokeLinecap="round"
        className="kl-stroke kl-s3" />

      {/* 言: box top horizontal */}
      <line x1="18" y1="22" x2="52" y2="22"
        stroke="#1a1814" strokeWidth="2" strokeLinecap="round"
        className="kl-stroke kl-s4" />

      {/* 言: box left vertical + bottom */}
      <path d="M18 22 L18 52 L52 52 L52 22"
        stroke="#1a1814" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        className="kl-stroke kl-s5" />

      {/* 言: inner horizontal lines (3 horizontal strokes inside box) */}
      <line x1="22" y1="33" x2="48" y2="33"
        stroke="#1a1814" strokeWidth="1.7" strokeLinecap="round"
        className="kl-stroke kl-s6" />

      {/* ═══════════════════════════════════════════
          葉 — "Leaf/word" kanji (right character)
          ═══════════════════════════════════════════ */}

      {/* 葉: top grass radical left stroke */}
      <line x1="72" y1="4" x2="72" y2="14"
        stroke="#1a1814" strokeWidth="1.9" strokeLinecap="round"
        className="kl-stroke kl-s7" />

      {/* 葉: top grass radical right stroke */}
      <line x1="86" y1="4" x2="86" y2="14"
        stroke="#1a1814" strokeWidth="1.9" strokeLinecap="round"
        className="kl-stroke kl-s8" />

      {/* 葉: grass top connecting horizontal */}
      <line x1="64" y1="14" x2="94" y2="14"
        stroke="#1a1814" strokeWidth="2" strokeLinecap="round"
        className="kl-stroke kl-s9" />

      {/* 葉: center body — tree top horizontal */}
      <line x1="68" y1="24" x2="90" y2="24"
        stroke="#1a1814" strokeWidth="2" strokeLinecap="round"
        className="kl-stroke kl-s10" />

      {/* 葉: center vertical spine */}
      <line x1="79" y1="14" x2="79" y2="58"
        stroke="#1a1814" strokeWidth="2" strokeLinecap="round"
        className="kl-stroke kl-s11" />

      {/* 葉: lower spreading branches */}
      <path d="M64 34 Q79 30 94 34 M62 44 Q79 39 96 44 M64 54 Q79 50 94 54"
        stroke="#1a1814" strokeWidth="1.8" strokeLinecap="round" fill="none"
        className="kl-stroke kl-s12" />

      {/* ═══════════════════════════════════════════
          Shimmer overlay — constrained to kanji area
          ═══════════════════════════════════════════ */}
      <g clipPath="url(#kl-kanji-clip)">
        <rect
          x="-40" y="0"
          width="40" height="60"
          fill="url(#kl-shim-grad)"
          className="kl-shimmer-rect"
        />
      </g>

      {/* ═══════════════════════════════════════════
          Decorative horizontal rule
          ═══════════════════════════════════════════ */}
      <line
        x1="30" y1="62" x2="170" y2="62"
        stroke="url(#kl-rule-grad)"
        strokeWidth="0.8"
        className="kl-rule"
      />

      {/* ═══════════════════════════════════════════
          Accent dot (vermillion)
          ═══════════════════════════════════════════ */}
      <circle cx="100" cy="62" r="1.5" fill="#c73e3a" className="kl-dot" />

      {/* ═══════════════════════════════════════════
          KOTOBA romanized label
          ═══════════════════════════════════════════ */}
      <text
        x="100" y="76"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="9"
        fontWeight="400"
        letterSpacing="6"
        fill="#1a1814"
        fillOpacity="0.65"
        className="kl-label"
      >
        KOTOBA
      </text>
    </svg>
  );
}
