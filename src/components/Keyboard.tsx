"use client";

import type { KeyState } from "@/lib/types";

interface KeyboardProps {
  keyStates: KeyState;
  onKey: (key: string) => void;
  disabled: boolean;
}

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

export default function Keyboard({
  keyStates,
  onKey,
  disabled,
}: KeyboardProps) {
  const getKeyClass = (key: string): string => {
    const state = keyStates[key];
    if (state === "correct") return "key-correct";
    if (state === "present") return "key-present";
    if (state === "absent") return "key-absent";
    return "bg-washi-300 text-sumi-900 border-washi-400 hover:bg-washi-400 active:bg-washi-500";
  };

  return (
    <div className="flex flex-col items-center gap-[6px] px-2 w-full max-w-[520px] mx-auto">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-[5px] w-full">
          {row.map((key) => {
            const isWide = key === "ENTER" || key === "⌫";
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                disabled={disabled}
                className={`
                  ${isWide ? "px-3 sm:px-4 text-xs sm:text-sm" : "w-[32px] sm:w-[40px] text-sm sm:text-base"}
                  h-[52px] sm:h-[58px]
                  rounded-md border
                  font-sans font-bold
                  flex items-center justify-center
                  select-none cursor-pointer
                  transition-colors duration-150
                  disabled:opacity-60 disabled:cursor-not-allowed
                  ${getKeyClass(key)}
                `}
                aria-label={
                  key === "⌫" ? "Backspace" : key === "ENTER" ? "Submit guess" : key
                }
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
