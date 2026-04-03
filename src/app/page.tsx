"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import type {
  GameStatus,
  GuessResult,
  KeyState,
  ToastMessage,
} from "@/lib/types";
import {
  getDayOffset,
  getWordForDay,
  isValidGuess,
  evaluateGuess,
  computeKeyStates,
} from "@/lib/game-logic";
import {
  loadStats,
  loadGameState,
  saveGameState,
  updateStatsAfterGame,
} from "@/lib/storage";
import type { GameStats } from "@/lib/types";
import Header from "@/components/Header";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import Toast from "@/components/Toast";
import StatsModal from "@/components/StatsModal";
import HelpModal from "@/components/HelpModal";

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const REVEAL_DURATION = 1800; // ms for all tiles to finish flipping
const BOUNCE_DURATION = 1200; // ms for bounce animation
const WIN_MESSAGES = [
  "天才！ Genius!",
  "見事！ Magnificent!",
  "素晴らしい！ Impressive!",
  "お見事！ Splendid!",
  "よくできた！ Great!",
  "ギリギリ！ Phew!",
];

export default function Home() {
  const [{ dayOffset, answer }] = useState(() => {
    const d = getDayOffset();
    return { dayOffset: d, answer: getWordForDay(d) };
  });
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [keyStates, setKeyStates] = useState<KeyState>({});
  const [stats, setStats] = useState<GameStats>(loadStats);

  // Animation states
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [bouncingRow, setBouncingRow] = useState<number | null>(null);
  const [shakeRow, setShakeRow] = useState(false);
  const [showSakura, setShowSakura] = useState(false);

  // Modal states
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);

  const isAnimating = revealingRow !== null || bouncingRow !== null;

  // Restore game state on mount
  useEffect(() => {
    const saved = loadGameState();
    if (saved && saved.dayOffset === dayOffset) {
      // Batch into a single transition to avoid cascading renders
      const restoredGuesses = saved.guesses;
      const restoredStatus = saved.status;
      const restoredKeys = computeKeyStates(restoredGuesses);
      startTransition(() => {
        setGuesses(restoredGuesses);
        setGameStatus(restoredStatus);
        setKeyStates(restoredKeys);
        setStats(loadStats());
      });
    } else {
      const s = loadStats();
      startTransition(() => {
        setStats(s);
        if (s.gamesPlayed === 0) {
          setShowHelp(true);
        }
      });
    }
  }, [dayOffset]);

  const addToast = useCallback((text: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const submitGuess = useCallback(() => {
    if (gameStatus !== "playing" || isAnimating) return;

    if (currentGuess.length < WORD_LENGTH) {
      addToast("Not enough letters");
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 400);
      return;
    }

    if (!isValidGuess(currentGuess)) {
      addToast("Not in word list");
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 400);
      return;
    }

    const tiles = evaluateGuess(currentGuess, answer);
    const newGuess: GuessResult = { word: currentGuess, tiles };
    const newGuesses = [...guesses, newGuess];
    const rowIndex = guesses.length;

    // Set the guess data immediately (tiles have correct states)
    setGuesses(newGuesses);
    setCurrentGuess("");

    // Start reveal animation
    setRevealingRow(rowIndex);

    // After reveal completes
    setTimeout(() => {
      setRevealingRow(null);

      // Update keyboard states
      setKeyStates(computeKeyStates(newGuesses));

      // Check for win
      const isWin = tiles.every((t) => t.state === "correct");
      const isLoss = !isWin && newGuesses.length >= MAX_GUESSES;

      if (isWin) {
        setGameStatus("won");
        saveGameState(dayOffset, newGuesses, "won");
        const newStats = updateStatsAfterGame(
          stats,
          "won",
          newGuesses.length,
          dayOffset
        );
        setStats(newStats);

        // Bounce animation
        setBouncingRow(rowIndex);
        addToast(WIN_MESSAGES[Math.min(newGuesses.length - 1, 5)]);

        setTimeout(() => {
          setBouncingRow(null);
          setShowSakura(true);
          setTimeout(() => setShowStats(true), 500);
          // Clean up sakura DOM nodes after animations complete
          setTimeout(() => setShowSakura(false), 8000);
        }, BOUNCE_DURATION);
      } else if (isLoss) {
        setGameStatus("lost");
        saveGameState(dayOffset, newGuesses, "lost");
        const newStats = updateStatsAfterGame(
          stats,
          "lost",
          newGuesses.length,
          dayOffset
        );
        setStats(newStats);

        addToast(answer.toUpperCase());
        setTimeout(() => setShowStats(true), 2000);
      } else {
        saveGameState(dayOffset, newGuesses, "playing");
      }
    }, REVEAL_DURATION);
  }, [
    currentGuess,
    guesses,
    answer,
    gameStatus,
    isAnimating,
    addToast,
    dayOffset,
    stats,
  ]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameStatus !== "playing" || isAnimating) return;

      if (key === "ENTER") {
        submitGuess();
        return;
      }

      if (key === "⌫" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    },
    [gameStatus, isAnimating, currentGuess, submitGuess]
  );

  // Physical keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (showStats || showHelp) return;

      if (e.key === "Enter") {
        e.preventDefault();
        handleKey("ENTER");
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleKey("⌫");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey, showStats, showHelp]);

  return (
    <div className="flex flex-col h-dvh relative z-10">
      <Header
        onHelp={() => setShowHelp(true)}
        onStats={() => setShowStats(true)}
      />

      {/* Game board — centered */}
      <main className="flex-1 flex items-center justify-center py-2">
        <GameBoard
          guesses={guesses}
          currentGuess={currentGuess}
          revealingRow={revealingRow}
          bouncingRow={bouncingRow}
          shakeRow={shakeRow}
        />
      </main>

      {/* Keyboard — bottom */}
      <div className="pb-3 pt-1">
        <Keyboard
          keyStates={keyStates}
          onKey={handleKey}
          disabled={gameStatus !== "playing" || isAnimating}
        />
      </div>

      {/* Sakura celebration */}
      {showSakura && <SakuraCelebration />}

      {/* Toasts */}
      <Toast messages={toasts} onDismiss={dismissToast} />

      {/* Modals */}
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        gameStatus={gameStatus}
        answer={answer}
        guessCount={guesses.length}
        guesses={guesses}
        dayOffset={dayOffset}
      />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Sakura Celebration — CSS-only particle effect
   ═══════════════════════════════════════════ */

// Deterministic pseudo-random for SSR/hydration safety
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// Pre-computed at module level — pure and deterministic
const SAKURA_PETALS = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: seededRandom(i * 7 + 1) * 100,
  delay: seededRandom(i * 7 + 2) * 3,
  duration: 3 + seededRandom(i * 7 + 3) * 4,
  size: 8 + seededRandom(i * 7 + 4) * 12,
  rotation: seededRandom(i * 7 + 5) * 360,
  opacity: 0.4 + seededRandom(i * 7 + 6) * 0.5,
}));

function SakuraCelebration() {
  const petals = SAKURA_PETALS;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <style>{`
        @keyframes sakura-fall {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0px);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translateY(100vh) rotate(720deg) translateX(80px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sakura-petal { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal absolute"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            animation: `sakura-fall ${p.duration}s ease-in-out ${p.delay}s forwards`,
            opacity: 0,
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 20 20"
            style={{ transform: `rotate(${p.rotation}deg)` }}
          >
            <ellipse
              cx="10"
              cy="7"
              rx="4"
              ry="6"
              fill="#d4a0a7"
              opacity={p.opacity}
            />
            <ellipse
              cx="7"
              cy="12"
              rx="4"
              ry="5"
              fill="#e8c4ca"
              opacity={p.opacity * 0.8}
              transform="rotate(-30 7 12)"
            />
            <ellipse
              cx="13"
              cy="12"
              rx="4"
              ry="5"
              fill="#e8c4ca"
              opacity={p.opacity * 0.8}
              transform="rotate(30 13 12)"
            />
            <circle cx="10" cy="10" r="1.5" fill="#c9929d" opacity="0.6" />
          </svg>
        </div>
      ))}
    </div>
  );
}
