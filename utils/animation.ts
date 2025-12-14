import { AnimationType, DangerZone } from '../types';

export const easeOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};

export const easeElastic = (x: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

export interface ZoneTransform {
  scale: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
  wobbleFactor: number;
}

export const getZoneTransform = (
  type: AnimationType,
  progress: number,
  zone: DangerZone,
  animTime: number,
  isFadingOut: boolean = false
): ZoneTransform => {
  let scale = 1;
  let opacity = 1;
  let offsetX = 0;
  let offsetY = 0;
  let wobbleFactor = 0;

  if (isFadingOut) {
    return { scale: 1, opacity: 1 - progress, offsetX: 0, offsetY: 0, wobbleFactor: 0 };
  }

  switch (type) {
    case 'fade-in':
      opacity = progress;
      scale = 1;
      break;
    case 'grow':
      scale = easeOutBack(progress);
      break;
    case 'ripple':
      scale = easeElastic(progress);
      opacity = Math.min(progress * 1.5, 1);
      break;
    case 'slide':
      const slideProg = easeOutCubic(progress);
      if (zone.slideOffset) {
        offsetX = zone.slideOffset.x * (1 - slideProg);
        offsetY = zone.slideOffset.y * (1 - slideProg);
      }
      opacity = progress < 0.2 ? progress * 5 : 1; 
      break;
    case 'wobble':
      scale = progress < 1 ? easeOutBack(progress) : 1;
      wobbleFactor = (1 - progress) * 0.3 * Math.sin(animTime / 50); 
      break;
    default:
      scale = easeOutBack(progress);
      break;
  }

  return { scale, opacity, offsetX, offsetY, wobbleFactor };
};
