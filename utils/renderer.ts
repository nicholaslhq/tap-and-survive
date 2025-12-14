import { COLORS, PLAYER_DIMENSIONS, TIMINGS } from '../constants';
import { DangerZone, GameMode, GamePhase, Player, Difficulty } from '../types';
import { getZoneTransform } from './animation';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

// Emulate spring physics for entry
const springOut = (t: number) => {
  const p = 0.4; // Period
  return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
};

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  difficulty: Difficulty,
  animTime: number
) => {
  const gridSize = 40; 
  const dotRadius = 2;
  const cols = Math.ceil(width / gridSize) + 1;
  const rows = Math.ceil(height / gridSize) + 1;

  for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
          let x = i * gridSize;
          let y = j * gridSize;
          let alpha = 0.1;
          let color = '#000000';

          if (difficulty === Difficulty.EASY) {
              const timeFactor = animTime / 4000;
              const phase = (i + j) * 0.2; 
              const wave = (Math.sin(timeFactor + phase) + 1) / 2;
              alpha = 0.05 + wave * 0.05;
              
          } else if (difficulty === Difficulty.MEDIUM) {
              const timeFactor = animTime / 2500;
              const offset = 4;
              x += Math.sin(timeFactor + j * 0.5) * offset;
              y += Math.cos(timeFactor + i * 0.5) * offset;
              alpha = 0.1;

          } else if (difficulty === Difficulty.HARD) {
              const timeFactor = animTime / 1500;
              const offset = 6;
              x += Math.sin(timeFactor + i * 1.5 + j) * offset;
              y += Math.cos(timeFactor * 1.2 + j * 1.5 - i) * offset;
              color = '#7F1D1D';
              alpha = 0.15;
          }

          ctx.globalAlpha = alpha;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
      }
  }
  ctx.globalAlpha = 1;
};

export const drawDangerZones = (
  ctx: CanvasRenderingContext2D,
  zones: DangerZone[],
  phase: GamePhase,
  phaseTime: number,
  animTime: number,
  mode: GameMode,
  waveData: { number: number, startTime: number }
) => {
  if (phase !== GamePhase.REVEAL && phase !== GamePhase.RESULT) return;

  zones.forEach(zone => {
    let progress = 0;
    let isFadingOut = false;

    if (mode === GameMode.CLASSIC || mode === GameMode.REVERSE) {
        progress = Math.min(phaseTime / TIMINGS.REVEAL_ANIMATION, 1);
        if (phase === GamePhase.RESULT) progress = 1;
    } else {
        // Survive Mode Drawing Logic
        const wave = waveData.number;
        const baseDuration = Math.max(1200, 2500 - (wave * 150)); 
        const impactTime = baseDuration * 0.6;
        const localTime = animTime - waveData.startTime;

        if (phase === GamePhase.RESULT) {
            progress = 1; // Freeze on result
        } else {
            if (localTime < impactTime) {
                progress = localTime / impactTime;
            } else {
                isFadingOut = true;
                progress = (localTime - impactTime) / (baseDuration - impactTime);
            }
        }
    }

    const { scale, opacity, offsetX, offsetY, wobbleFactor } = getZoneTransform(
      zone.animationType, 
      progress, 
      zone, 
      animTime,
      isFadingOut
    );

    ctx.save();
    ctx.translate(zone.x + offsetX, zone.y + offsetY);
    ctx.rotate(zone.rotation || 0);
    ctx.beginPath();

    if (zone.type === 'blob' && zone.shapePoints.length > 0) {
      const points = zone.shapePoints.map(p => {
         const variance = p.variance + (wobbleFactor * Math.sin(p.angle * 10 + animTime / 100));
         const r = zone.radius * scale * variance;
         return {
           x: Math.cos(p.angle) * r,
           y: Math.sin(p.angle) * r
         };
      });

      const len = points.length;
      const firstMid = { 
        x: (points[len-1].x + points[0].x) / 2, 
        y: (points[len-1].y + points[0].y) / 2 
      };
      ctx.moveTo(firstMid.x, firstMid.y);

      for (let i = 0; i < len; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % len];
        const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        ctx.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
      }
    } else {
      ctx.arc(0, 0, zone.radius * scale, 0, Math.PI * 2);
    }

    ctx.closePath();
    ctx.globalAlpha = opacity;
    
    const isReverse = mode === GameMode.REVERSE;
    const mainColor = isReverse ? '#22c55e' : COLORS.danger; 
    const strokeColor = isReverse ? '#14532d' : '#7F1D1D'; 
    
    ctx.fillStyle = isFadingOut ? '#9CA3AF' : mainColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = isFadingOut ? '#4B5563' : strokeColor;
    ctx.stroke();
    ctx.restore();
  });
};

export const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
  particles.forEach(p => {
    const progress = p.life / p.maxLife;
    const alpha = 1 - progress;
    const scale = 1 - progress;
    
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    
    const s = p.size * scale;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
};

export const drawPlayers = (
  ctx: CanvasRenderingContext2D, 
  players: Map<number, Player>, 
  width: number, 
  height: number, 
  animTime: number
) => {
  const minDim = Math.min(width, height);
  const baseRadius = minDim * PLAYER_DIMENSIONS.BASE_RADIUS_PCT;
  const playerRadius = Math.max(PLAYER_DIMENSIONS.MIN_RADIUS, Math.min(baseRadius, PLAYER_DIMENSIONS.MAX_RADIUS));

  players.forEach((player) => {
    const { x, y } = player.position;
    
    if (player.isAlive) {
      // Entrance Animation
      const age = animTime - player.joinedAt;
      const enterDuration = 600;
      let scale = 1;
      
      if (age < enterDuration) {
          scale = springOut(age / enterDuration);
      }
      const currentRadius = playerRadius * scale;

      ctx.beginPath();
      // Dynamic Halo (Pulse)
      const pulse = Math.sin(animTime / 150) * 4;
      ctx.arc(x, y, Math.max(0, currentRadius * 2 + pulse), 0, Math.PI * 2);
      ctx.strokeStyle = player.color;
      ctx.globalAlpha = 0.5 * Math.min(1, age/200);
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      ctx.beginPath();
      // Dynamic Core
      ctx.arc(x, y, Math.max(0, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = player.color;
      ctx.strokeStyle = '#000';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      // Dead state
      ctx.save();
      ctx.globalAlpha = 0.8; 
      
      ctx.beginPath();
      ctx.arc(x, y, playerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#6B7280';
      ctx.strokeStyle = '#000000'; 
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      const r = playerRadius * 0.4;
      ctx.moveTo(x - r, y - r);
      ctx.lineTo(x + r, y + r);
      ctx.moveTo(x + r, y - r);
      ctx.lineTo(x - r, y + r);
      ctx.strokeStyle = player.color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      ctx.restore();
    }
  });
};