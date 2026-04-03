"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import type { TileState } from "@/lib/types";

interface TileProps {
  letter: string;
  state: TileState;
  position: number;
  isRevealing: boolean;
  isBouncing: boolean;
}

const stateStyles: Record<TileState, string> = {
  empty: "border-washi-400 bg-transparent",
  tbd: "border-sumi-400 bg-transparent text-sumi-900",
  correct: "border-matcha-600 bg-matcha-600 text-washi-50",
  present: "border-yamabuki-600 bg-yamabuki-500 text-washi-50",
  absent: "border-ishi-600 bg-ishi-600 text-washi-200",
};

export default function Tile({
  letter,
  state,
  position,
  isRevealing,
  isBouncing,
}: TileProps) {
  // Track reveal phase: null = not revealing, "waiting" = pre-flip, "colored" = post-flip
  const [revealPhase, setRevealPhase] = useState<null | "waiting" | "colored">(
    null
  );
  const [animClass, setAnimClass] = useState("");
  const prevRevealingRef = useRef(isRevealing);

  // Derive display state from props and reveal phase
  let displayState: TileState;
  if (isRevealing && revealPhase !== "colored") {
    displayState = "tbd";
  } else {
    displayState = state;
  }

  // Handle reveal animation (flip) — only use timeouts, no sync setState
  useEffect(() => {
    // Detect transition to revealing
    if (isRevealing && state !== "tbd" && state !== "empty") {
      const flipDelay = position * 300;

      const flipTimer = setTimeout(() => {
        startTransition(() => setAnimClass("tile-flip"));
      }, flipDelay);

      const colorTimer = setTimeout(() => {
        startTransition(() => setRevealPhase("colored"));
      }, flipDelay + 250);

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(colorTimer);
      };
    }
  }, [isRevealing, state, position]);

  // Reset reveal phase when revealing ends
  useEffect(() => {
    if (prevRevealingRef.current && !isRevealing) {
      startTransition(() => {
        setRevealPhase(null);
        setAnimClass("");
      });
    }
    prevRevealingRef.current = isRevealing;
  }, [isRevealing]);

  // Handle bounce animation (win)
  useEffect(() => {
    if (isBouncing) {
      const delay = position * 100;
      const timer = setTimeout(() => {
        startTransition(() => setAnimClass("tile-bounce"));
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isBouncing, position]);

  // Pop animation when letter is typed
  const popClass =
    letter && state === "tbd" && !isRevealing ? "tile-pop" : "";

  return (
    <div
      className={`
        w-[58px] h-[58px] sm:w-[62px] sm:h-[62px]
        border-2 flex items-center justify-center
        text-2xl sm:text-[2rem] font-bold font-serif
        select-none transition-colors duration-0
        ${stateStyles[displayState]}
        ${animClass}
        ${popClass}
      `}
      style={{
        perspective: "500px",
      }}
    >
      {letter}
    </div>
  );
}
