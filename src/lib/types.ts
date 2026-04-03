export type LetterState = "correct" | "present" | "absent";

export type TileState = "empty" | "tbd" | "correct" | "present" | "absent";

export interface TileData {
  letter: string;
  state: TileState;
}

export interface GuessResult {
  word: string;
  tiles: TileData[];
}

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  answer: string;
  guesses: GuessResult[];
  currentGuess: string;
  status: GameStatus;
  dayOffset: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastCompletedDay: number;
}

export type KeyState = Record<string, LetterState | undefined>;

export type ToastMessage = {
  id: number;
  text: string;
};
