"use client";

import type { GuessResult, TileData } from "@/lib/types";
import Tile from "./Tile";

interface GameBoardProps {
  guesses: GuessResult[];
  currentGuess: string;
  revealingRow: number | null;
  bouncingRow: number | null;
  shakeRow: boolean;
  maxGuesses?: number;
}

export default function GameBoard({
  guesses,
  currentGuess,
  revealingRow,
  bouncingRow,
  shakeRow,
  maxGuesses = 6,
}: GameBoardProps) {
  const rows: { tiles: TileData[]; isCurrentRow: boolean }[] = [];

  // Build rows from guesses, current guess, and empty rows
  for (let i = 0; i < maxGuesses; i++) {
    if (i < guesses.length) {
      // Completed guess row
      rows.push({ tiles: guesses[i].tiles, isCurrentRow: false });
    } else if (i === guesses.length) {
      // Current input row
      const tiles: TileData[] = [];
      for (let j = 0; j < 5; j++) {
        tiles.push({
          letter: currentGuess[j]?.toUpperCase() ?? "",
          state: currentGuess[j] ? "tbd" : "empty",
        });
      }
      rows.push({ tiles, isCurrentRow: true });
    } else {
      // Empty future row
      const tiles: TileData[] = Array(5)
        .fill(null)
        .map(() => ({ letter: "", state: "empty" as const }));
      rows.push({ tiles, isCurrentRow: false });
    }
  }

  return (
    <div className="flex flex-col items-center gap-[5px]">
      {rows.map((row, rowIndex) => {
        const isRevealing = revealingRow === rowIndex;
        const isBouncing = bouncingRow === rowIndex;
        const isShaking = shakeRow && row.isCurrentRow;

        return (
          <div
            key={rowIndex}
            className={`flex gap-[5px] ${isShaking ? "row-shake" : ""}`}
          >
            {row.tiles.map((tile, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                letter={tile.letter}
                state={tile.state}
                position={colIndex}
                isRevealing={isRevealing}
                isBouncing={isBouncing}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
