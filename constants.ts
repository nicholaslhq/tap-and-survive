import { Difficulty } from './types';

export const COLORS = {
  primary: '#9333EA', // Purple-600 (Brighter/Vibrant for better visibility against black shadow)
  secondary: '#FDE047', // Yellow-300
  background: '#FEFCE8', // Yellow-50
  danger: '#EF4444', // Red-500
  text: '#000000',
  safePalette: [
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#10B981', // Emerald
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#D946EF', // Fuchsia
    '#F97316', // Orange
    '#0EA5E9', // Sky
    '#8B5CF6', // Purple
    '#14B8A6', // Teal
  ]
};

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    zoneCountMin: 2,
    zoneCountMax: 3,
    zoneSizeMinPct: 0.25, 
    zoneSizeMaxPct: 0.38,
  },
  [Difficulty.MEDIUM]: {
    zoneCountMin: 4,
    zoneCountMax: 6,
    zoneSizeMinPct: 0.20,
    zoneSizeMaxPct: 0.30,
  },
  [Difficulty.HARD]: {
    zoneCountMin: 7,
    zoneCountMax: 10,
    zoneSizeMinPct: 0.15,
    zoneSizeMaxPct: 0.22,
  },
};

export const TIMINGS = {
  WAITING_PHASE: 3000,
  REVEAL_ANIMATION: 500,
  RESULT_DISPLAY: 5000,
};

export const PLAYER_DIMENSIONS = {
  MIN_RADIUS: 25,
  MAX_RADIUS: 60,
  BASE_RADIUS_PCT: 0.08, // 8% of min screen dimension
};