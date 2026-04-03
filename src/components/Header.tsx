"use client";

interface HeaderProps {
  onHelp: () => void;
  onStats: () => void;
}

export default function Header({ onHelp, onStats }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-washi-300 bg-washi-100/80 backdrop-blur-sm relative z-10">
      {/* Help button */}
      <button
        onClick={onHelp}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-washi-300 transition-colors text-sumi-600 hover:text-sumi-900"
        aria-label="How to play"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex flex-col items-center select-none">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-sumi-900">
            言葉
          </span>
          <span className="text-xs sm:text-sm font-sans font-medium tracking-[0.3em] text-sumi-500 uppercase mt-1">
            Kotoba
          </span>
        </div>
      </div>

      {/* Stats button */}
      <button
        onClick={onStats}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-washi-300 transition-colors text-sumi-600 hover:text-sumi-900"
        aria-label="Statistics"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </button>
    </header>
  );
}
