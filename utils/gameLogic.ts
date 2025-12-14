import { DIFFICULTY_CONFIG, PLAYER_DIMENSIONS } from '../constants';
import { DangerZone, Difficulty, GameMode, Player, AnimationType } from '../types';
import { Particle } from './renderer';
import { getZoneTransform } from './animation';

export const getDifficultyBasedAnimation = (difficulty: Difficulty): AnimationType => {
  const rand = Math.random();
  switch (difficulty) {
    case Difficulty.EASY:
      return rand > 0.6 ? 'grow' : 'fade-in';
    case Difficulty.MEDIUM:
      if (rand > 0.7) return 'wobble';
      if (rand > 0.4) return 'ripple';
      return 'grow';
    case Difficulty.HARD:
      if (rand > 0.7) return 'slide';
      if (rand > 0.4) return 'wobble';
      return 'ripple';
    default:
      return 'grow';
  }
};

export const generateZones = (
  width: number, 
  height: number, 
  difficulty: Difficulty, 
  mode: GameMode, 
  wave: number = 0,
  players?: Map<number, Player>
): DangerZone[] => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const minDim = Math.min(width, height);
  const zones: DangerZone[] = [];
  const animationForRound = getDifficultyBasedAnimation(difficulty);

  // Default configuration
  let count = Math.floor(Math.random() * (config.zoneCountMax - config.zoneCountMin + 1)) + config.zoneCountMin;
  let sizeMultiplier = 1;
  let allowedOverlap = false;
  let buffer = 20;

  // SURVIVE MODE: Aggressive Scaling
  if (mode === GameMode.SURVIVE) {
     // Scale count: Starts at min, adds 1 every wave, capped at high density
     count = config.zoneCountMin + wave; 
     if (difficulty === Difficulty.HARD) count += 2;
     
     // Cap count to reasonable limit to prevent total render failure, but high enough to cover screen
     const maxCount = 15 + Math.floor(wave / 2);
     count = Math.min(count, maxCount);

     // Scale size: Increases 5% per wave
     sizeMultiplier = 1 + (wave * 0.05);

     // Overlap logic:
     // Wave 0-4: Standard buffer (zones don't overlap much)
     // Wave 5-9: Small buffer
     // Wave 10+: Negative buffer (forced overlap allowed)
     buffer = Math.max(20 - (wave * 5), -minDim * 0.2); 
     
     if (wave > 8) allowedOverlap = true;
  } else {
     // Classic/Reverse Logic
     // Random variations occasionally
  }

  const maxAttempts = (mode === GameMode.SURVIVE && wave > 5) ? 100 : 50;

  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    let radius = 0;
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < maxAttempts) {
      attempts++;
      
      const baseRadPct = config.zoneSizeMinPct + Math.random() * (config.zoneSizeMaxPct - config.zoneSizeMinPct);
      radius = minDim * baseRadPct * sizeMultiplier;
      
      // Cap radius to avoid single massive zone taking whole screen early on
      if (mode === GameMode.SURVIVE) {
          radius = Math.min(radius, minDim * 0.6);
      }

      x = Math.random() * width;
      y = Math.random() * height;

      let collision = false;
      // Check against existing zones
      for (const existingZone of zones) {
         const dx = x - existingZone.x;
         const dy = y - existingZone.y;
         const dist = Math.sqrt(dx * dx + dy * dy);
         
         // Use calculated buffer
         if (dist < radius + existingZone.radius + buffer) { 
             collision = true;
             break;
         }
      }
      
      if (!collision) valid = true;
    }

    // In late survival waves, if we couldn't find a valid non-overlapping spot,
    // force placement anyway to ensure difficulty ramps up (Total Coverage)
    if (!valid && mode === GameMode.SURVIVE && allowedOverlap) {
        valid = true;
    }

    if (!valid) continue;

    // Animation type selection
    let animType = animationForRound;
    if (mode === GameMode.SURVIVE) {
        // More chaotic animations in later waves
        animType = Math.random() > 0.5 ? getDifficultyBasedAnimation(Difficulty.HARD) : animationForRound;
    } else {
        animType = Math.random() > 0.8 ? getDifficultyBasedAnimation(difficulty) : animationForRound;
    }

    // Shape generation
    const numPoints = 8 + Math.floor(Math.random() * 7); 
    const shapePoints = [];
    for (let j = 0; j < numPoints; j++) {
      shapePoints.push({
        angle: (j / numPoints) * Math.PI * 2,
        variance: 0.85 + Math.random() * 0.3, 
      });
    }

    const slideAngle = Math.random() * Math.PI * 2;
    const slideDist = 200 + Math.random() * 300; 

    zones.push({
      x,
      y,
      radius,
      type: Math.random() > 0.3 ? 'blob' : 'circle',
      animationType: animType,
      shapePoints,
      rotation: Math.random() * Math.PI * 2,
      slideOffset: {
        x: Math.cos(slideAngle) * slideDist,
        y: Math.sin(slideAngle) * slideDist,
      }
    });
  }
  return zones;
};

export const updateParticles = (particles: Particle[], dt: number): Particle[] => {
  return particles.filter(p => {
    p.life += dt;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    return p.life < p.maxLife;
  });
};

export const checkCollisions = (
  players: Map<number, Player>,
  zones: DangerZone[],
  particles: Particle[],
  mode: GameMode,
  width: number,
  height: number,
  currentTime: number
): { survivors: number, total: number } => {
  let survivors = 0;
  let total = 0;

  // Calculate dynamic player radius (visual size)
  const minDim = Math.min(width, height);
  const base = minDim * PLAYER_DIMENSIONS.BASE_RADIUS_PCT;
  const playerRadius = Math.max(PLAYER_DIMENSIONS.MIN_RADIUS, Math.min(base, PLAYER_DIMENSIONS.MAX_RADIUS));
  
  // Tolerance buffer: 
  // Small negative buffer to prevent false positives on exact pixel edges, 
  // but keeping it small ensures "slight overlap" triggers.
  const TOLERANCE = 2; 

  const TWO_PI = Math.PI * 2;

  players.forEach((player) => {
    total++;
    if (!player.isAlive) return;

    let isIntersecting = false;

    for (const zone of zones) {
      const dx = player.position.x - zone.x;
      const dy = player.position.y - zone.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate zone effective radius at the angle of the player
      let zoneEffectiveRadius = zone.radius;

      // We assume collision happens when zone is fully active (progress = 1)
      // Account for 'wobble' or 'blob' shape variations at progress = 1
      const { wobbleFactor } = getZoneTransform(zone.animationType, 1, zone, currentTime);

      if (zone.type === 'blob' && zone.shapePoints.length > 0) {
         // Calculate angle to player in zone's local space
         let angle = Math.atan2(dy, dx);
         // Subtract zone rotation
         angle -= (zone.rotation || 0);
         // Normalize to 0-2PI
         angle = angle % TWO_PI;
         if (angle < 0) angle += TWO_PI;

         // Find the segment [p1, p2] wrapping this angle
         const points = zone.shapePoints;
         let p1 = points[points.length - 1];
         let p2 = points[0];
         
         for (let i = 0; i < points.length - 1; i++) {
             if (angle >= points[i].angle && angle < points[i+1].angle) {
                 p1 = points[i];
                 p2 = points[i+1];
                 break;
             }
         }

         // Linear interpolation of angle to find the shape variance at this angle
         let span = p2.angle - p1.angle;
         if (span < 0) span += TWO_PI; // Wrap around case
         
         let curr = angle - p1.angle;
         if (curr < 0) curr += TWO_PI;
         
         const t = span === 0 ? 0 : curr / span;
         
         // Apply wobble to the variances
         const v1 = p1.variance + (wobbleFactor * Math.sin(p1.angle * 10 + currentTime / 100));
         const v2 = p2.variance + (wobbleFactor * Math.sin(p2.angle * 10 + currentTime / 100));
         
         // Interpolate variance
         const v = v1 + (v2 - v1) * t;
         
         zoneEffectiveRadius = zone.radius * v;
      }

      // Check intersection: Distance < Sum of Radii
      // Applying tolerance to ensure we aren't too strict on pixel borders
      if (dist < zoneEffectiveRadius + playerRadius - TOLERANCE) {
          isIntersecting = true;
          break; 
      }
    }

    let shouldDie = false;

    if (mode === GameMode.REVERSE) {
        // Reverse Logic: SAFE if inside zone, DEAD if outside
        if (!isIntersecting) shouldDie = true;
    } else {
        // Classic/Survive Logic: DEAD if inside zone
        if (isIntersecting) shouldDie = true;
    }

    if (shouldDie) {
      player.isAlive = false;
      player.deathTime = currentTime;

      // Create explosion particles
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;
        const speed = 2 + Math.random() * 5;
        particles.push({
          x: player.position.x,
          y: player.position.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 800 + Math.random() * 400,
          color: player.color,
          size: 8 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.4
        });
      }
    } else {
      survivors++;
    }
  });

  return { survivors, total };
};
