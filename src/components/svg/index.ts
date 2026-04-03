/**
 * Kotoba SVG component library
 * Japanese-inspired animated SVG assets for the Kotoba (言葉) word game.
 *
 * All components are self-contained React/TSX with embedded CSS animations.
 * Animations respect prefers-reduced-motion.
 *
 * Usage:
 *   import { KotobaLogo, SakuraParticles, EnsoCircle } from "@/components/svg"
 */

export { KotobaLogo }       from "./KotobaLogo";
export { SakuraParticles }  from "./SakuraParticles";
export { EnsoCircle }       from "./EnsoCircle";
export { InkSplash }        from "./InkSplash";
export { ToriiGate }        from "./ToriiGate";
export { WavePattern }      from "./WavePattern";

/**
 * Design tokens (mirrored here for consumer convenience)
 *
 * These are the canonical color values for the Kotoba visual system.
 * Use these when composing layouts alongside the SVG components.
 */
export const KotobaTokens = {
  /** Sumi ink — primary stroke color */
  ink: "#1a1814",
  /** Washi paper — background / light surface */
  paper: "#f7f3eb",
  /** Jade / matcha — correct letter state */
  correct: "#538d6e",
  /** Gold / yamabuki — present letter state */
  present: "#c4841d",
  /** Stone gray — absent letter state */
  absent: "#787068",
  /** Sakura pink — celebration / accent */
  sakura: "#d4a0a7",
  /** Vermillion — primary accent, error, emphasis */
  vermillion: "#c73e3a",
} as const;

export type KotobaTokenKey = keyof typeof KotobaTokens;
