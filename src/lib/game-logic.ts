import { ANSWER_WORDS, VALID_GUESSES } from "@/data/words";
import type { TileData, LetterState, KeyState, GuessResult } from "./types";

const EPOCH = new Date(2024, 0, 1).getTime(); // Jan 1, 2024
const MS_PER_DAY = 86400000;

export function getDayOffset(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - EPOCH) / MS_PER_DAY);
}

export function getWordForDay(dayOffset: number): string {
  const index = dayOffset % ANSWER_WORDS.length;
  return ANSWER_WORDS[index];
}

export function isValidGuess(word: string): boolean {
  const lower = word.toLowerCase();
  return ANSWER_WORDS.includes(lower) || VALID_GUESSES.includes(lower);
}

export function evaluateGuess(guess: string, answer: string): TileData[] {
  const g = guess.toLowerCase().split("");
  const a = answer.toLowerCase().split("");
  const result: TileData[] = g.map((letter) => ({
    letter: letter.toUpperCase(),
    state: "absent" as const,
  }));

  // Track which answer positions are "consumed"
  const answerUsed = new Array(5).fill(false);
  const guessUsed = new Array(5).fill(false);

  // First pass: exact matches (correct)
  for (let i = 0; i < 5; i++) {
    if (g[i] === a[i]) {
      result[i].state = "correct";
      answerUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Second pass: present letters (wrong position)
  for (let i = 0; i < 5; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 5; j++) {
      if (answerUsed[j]) continue;
      if (g[i] === a[j]) {
        result[i].state = "present";
        answerUsed[j] = true;
        break;
      }
    }
  }

  return result;
}

export function computeKeyStates(guesses: GuessResult[]): KeyState {
  const keys: KeyState = {};

  for (const guess of guesses) {
    for (const tile of guess.tiles) {
      const letter = tile.letter;
      const current = keys[letter];
      const incoming = tile.state as LetterState;

      if (!current) {
        keys[letter] = incoming;
      } else if (current === "correct") {
        // correct is always the best
      } else if (incoming === "correct") {
        keys[letter] = "correct";
      } else if (current === "present") {
        // present beats absent
      } else if (incoming === "present") {
        keys[letter] = "present";
      }
      // absent stays absent if nothing better
    }
  }

  return keys;
}
