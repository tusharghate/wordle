import type { GameStats, GuessResult, GameStatus } from "./types";

const STATS_KEY = "kotoba-stats";
const STATE_KEY = "kotoba-game-state";

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  lastCompletedDay: -1,
};

export function loadStats(): GameStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: GameStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // storage full or unavailable
  }
}

export function updateStatsAfterGame(
  stats: GameStats,
  status: GameStatus,
  guessCount: number,
  dayOffset: number
): GameStats {
  if (status === "playing") return stats;
  if (stats.lastCompletedDay === dayOffset) return stats; // already recorded

  const updated = { ...stats };
  updated.gamesPlayed += 1;
  updated.lastCompletedDay = dayOffset;

  if (status === "won") {
    updated.gamesWon += 1;
    // Streak continues only if last completed day was yesterday (or first game ever)
    const isConsecutive =
      stats.lastCompletedDay === dayOffset - 1 ||
      stats.lastCompletedDay === -1;
    updated.currentStreak = isConsecutive ? updated.currentStreak + 1 : 1;
    updated.maxStreak = Math.max(updated.maxStreak, updated.currentStreak);
    updated.guessDistribution = [...updated.guessDistribution];
    updated.guessDistribution[guessCount - 1] += 1;
  } else {
    updated.currentStreak = 0;
  }

  saveStats(updated);
  return updated;
}

export interface SavedGameState {
  dayOffset: number;
  guesses: GuessResult[];
  status: GameStatus;
}

export function loadGameState(): SavedGameState | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STATE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    // Validate shape to guard against corrupted or foreign data
    if (
      typeof parsed?.dayOffset !== "number" ||
      !Array.isArray(parsed?.guesses) ||
      !["playing", "won", "lost"].includes(parsed?.status)
    ) {
      return null;
    }
    return parsed as SavedGameState;
  } catch {
    return null;
  }
}

export function saveGameState(
  dayOffset: number,
  guesses: GuessResult[],
  status: GameStatus
): void {
  if (typeof window === "undefined") return;
  try {
    const state: SavedGameState = { dayOffset, guesses, status };
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}
