"use client";

import { useState } from "react";
import type { GameStats, GameStatus, GuessResult } from "@/lib/types";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  gameStatus: GameStatus;
  answer: string;
  guessCount: number;
  guesses: GuessResult[];
  dayOffset: number;
}

const WIN_MESSAGES = [
  "天才！ Genius!",
  "見事！ Magnificent!",
  "素晴らしい！ Impressive!",
  "お見事！ Splendid!",
  "よくできた！ Great!",
  "ギリギリ！ Phew!",
];

export default function StatsModal({
  isOpen,
  onClose,
  stats,
  gameStatus,
  answer,
  guessCount,
  guesses,
  dayOffset,
}: StatsModalProps) {
  const [shareLabel, setShareLabel] = useState("共有 Share");

  // Component unmounts when !isOpen (returns null below), so state resets naturally on reopen.
  if (!isOpen) return null;

  const winPct =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const maxDist = Math.max(...stats.guessDistribution, 1);

  const handleShare = () => {
    const emojiMap = { correct: "🟩", present: "🟨", absent: "⬛" } as const;
    const grid = guesses
      .map((g) =>
        g.tiles
          .map((t) => emojiMap[t.state as keyof typeof emojiMap] ?? "⬛")
          .join("")
      )
      .join("\n");
    const resultText = `言葉 Kotoba #${dayOffset} ${gameStatus === "won" ? guessCount : "X"}/6\n\n${grid}`;
    navigator.clipboard
      .writeText(resultText)
      .then(() => setShareLabel("コピー済み Copied!"))
      .catch(() => setShareLabel("コピー失敗 Copy failed"));
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-sumi-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
    >
      <div
        className="modal-content bg-washi-100 border border-washi-300 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          autoFocus
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

        {/* Game result */}
        {gameStatus !== "playing" && (
          <div className="text-center mb-5">
            {gameStatus === "won" ? (
              <p className="font-serif text-lg text-matcha-600 font-bold">
                {WIN_MESSAGES[Math.min(guessCount - 1, 5)]}
              </p>
            ) : (
              <div>
                <p className="font-serif text-lg text-kurenai-500 font-bold">
                  残念 — Not this time
                </p>
                <p className="text-sm text-sumi-500 mt-1 font-sans">
                  The word was{" "}
                  <span className="font-bold text-sumi-900 uppercase tracking-wider">
                    {answer}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h2 id="stats-modal-title" className="text-center font-serif font-bold text-lg text-sumi-900 mb-4 tracking-wide">
          統計 Statistics
        </h2>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-1 mb-6">
          {[
            { value: stats.gamesPlayed, label: "Played" },
            { value: winPct, label: "Win %" },
            { value: stats.currentStreak, label: "Current\nStreak" },
            { value: stats.maxStreak, label: "Max\nStreak" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-serif font-bold text-sumi-900">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-sumi-500 font-sans whitespace-pre-line leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Guess distribution */}
        <h3 className="font-serif font-medium text-sm text-sumi-700 mb-2 tracking-wide">
          推測分布 Guess Distribution
        </h3>
        <div className="flex flex-col gap-1">
          {stats.guessDistribution.map((count, i) => {
            const width = Math.max((count / maxDist) * 100, 8);
            const isCurrentGuess =
              gameStatus === "won" && i === guessCount - 1;
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-sans font-bold text-sumi-700 w-3 text-right">
                  {i + 1}
                </span>
                <div
                  className={`
                    h-5 rounded-sm flex items-center justify-end px-1.5
                    text-xs font-sans font-bold
                    transition-all duration-300
                    ${
                      isCurrentGuess
                        ? "bg-matcha-600 text-washi-50"
                        : count > 0
                          ? "bg-ishi-500 text-washi-100"
                          : "bg-washi-300 text-sumi-500"
                    }
                  `}
                  style={{ width: `${width}%` }}
                >
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Share button */}
        {gameStatus !== "playing" && (
          <button
            onClick={handleShare}
            className="mt-5 w-full py-2.5 rounded-lg bg-matcha-600 text-washi-50 font-sans font-bold text-sm hover:bg-matcha-500 transition-colors"
          >
            {shareLabel}
          </button>
        )}
      </div>
    </div>
  );
}
