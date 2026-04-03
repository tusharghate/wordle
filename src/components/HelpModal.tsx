"use client";

import { useEffect, useRef } from "react";

export default function HelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-sumi-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="modal-content bg-washi-100 border border-washi-300 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-washi-300 text-sumi-500 hover:text-sumi-900 transition-colors"
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 id="help-modal-title" className="font-serif font-bold text-xl text-sumi-900 mb-4 tracking-wide text-center">
          遊び方 How To Play
        </h2>

        <div className="font-sans text-sm text-sumi-700 space-y-3">
          <p>
            Guess the word in 6 tries. Each guess must be a valid 5-letter word.
          </p>
          <p>
            After each guess, the tiles will change color to show how close your
            guess was to the word.
          </p>
        </div>

        {/* Examples */}
        <div className="mt-5 space-y-4">
          {/* Correct example */}
          <div>
            <div className="flex gap-[4px] mb-1.5">
              {["C", "R", "A", "N", "E"].map((l, i) => (
                <div
                  key={i}
                  className={`
                    w-9 h-9 flex items-center justify-center
                    border-2 text-sm font-serif font-bold
                    ${
                      i === 0
                        ? "bg-matcha-600 border-matcha-600 text-washi-50"
                        : "border-washi-400 text-sumi-900"
                    }
                  `}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs font-sans text-sumi-600">
              <span className="font-bold text-matcha-600">C</span> is in the
              word and in the correct spot.
            </p>
          </div>

          {/* Present example */}
          <div>
            <div className="flex gap-[4px] mb-1.5">
              {["S", "T", "O", "N", "E"].map((l, i) => (
                <div
                  key={i}
                  className={`
                    w-9 h-9 flex items-center justify-center
                    border-2 text-sm font-serif font-bold
                    ${
                      i === 2
                        ? "bg-yamabuki-500 border-yamabuki-600 text-washi-50"
                        : "border-washi-400 text-sumi-900"
                    }
                  `}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs font-sans text-sumi-600">
              <span className="font-bold text-yamabuki-600">O</span> is in the
              word but in the wrong spot.
            </p>
          </div>

          {/* Absent example */}
          <div>
            <div className="flex gap-[4px] mb-1.5">
              {["L", "I", "G", "H", "T"].map((l, i) => (
                <div
                  key={i}
                  className={`
                    w-9 h-9 flex items-center justify-center
                    border-2 text-sm font-serif font-bold
                    ${
                      i === 3
                        ? "bg-ishi-600 border-ishi-600 text-washi-200"
                        : "border-washi-400 text-sumi-900"
                    }
                  `}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs font-sans text-sumi-600">
              <span className="font-bold text-ishi-500">H</span> is not in the
              word in any spot.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-washi-300">
          <p className="text-xs font-sans text-sumi-500 text-center">
            A new word is available each day. がんばって！
          </p>
        </div>
      </div>
    </div>
  );
}
