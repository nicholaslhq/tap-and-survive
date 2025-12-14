export enum GamePhase {
  HOME = 'HOME',
  SETTINGS = 'SETTINGS',
  LOBBY = 'LOBBY',       // Waiting for initial touches
  COUNTDOWN = 'COUNTDOWN', // 3s timer
  REVEAL = 'REVEAL',     // 0.5s zone appearance
  RESULT = 'RESULT',     // 5s outcome
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum GameMode {
  CLASSIC = 'CLASSIC',
  SURVIVE = 'SURVIVE',
  REVERSE = 'REVERSE',
}

export interface Point {
  x: number;
  y: number;
}

export interface Player {
  id: number; // Corresponds to touch identifier
  color: string;
  position: Point;
  isAlive: boolean;
  joinedAt: number;
  deathTime?: number;
}

export interface GameResultData {
  survivors: number;
  total: number;
  players: Player[];
}

export type AnimationType = 'fade-in' | 'grow' | 'ripple' | 'slide' | 'wobble';

export interface BlobPoint {
  angle: number;
  variance: number; // Multiplier for radius (e.g. 0.8 to 1.2)
}

export interface DangerZone {
  x: number;
  y: number;
  radius: number;
  type: 'circle' | 'blob';
  
  // Visuals
  animationType: AnimationType;
  shapePoints: BlobPoint[]; // For constructing organic shapes
  slideOffset?: { x: number; y: number }; // Only for slide animation
  rotationSpeed?: number; // Radians per frame
  rotation?: number; // Current rotation
}

export interface GameSettings {
  difficulty: Difficulty;
  mode: GameMode;
}