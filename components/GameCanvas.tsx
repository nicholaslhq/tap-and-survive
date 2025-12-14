import React, { useRef, useEffect, useCallback } from 'react';
import { GamePhase, GameSettings, Player, DangerZone, GameMode } from '../types';
import { COLORS, TIMINGS } from '../constants';
import { drawBackground, drawDangerZones, drawParticles, drawPlayers, Particle } from '../utils/renderer';
import { generateZones, checkCollisions, updateParticles } from '../utils/gameLogic';

interface GameCanvasProps {
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;
  settings: GameSettings;
  onPlayersChange: (count: number) => void;
  onGameOver: (survivors: number, total: number, players: Player[]) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  phase,
  setPhase,
  settings,
  onPlayersChange,
  onGameOver,
  isPaused,
  onTogglePause,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game State Refs
  const playersRef = useRef<Map<number, Player>>(new Map());
  const dangerZonesRef = useRef<DangerZone[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const isPausedRef = useRef(isPaused); 
  
  // Timing Refs (Delta Time System)
  const frameIdRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const phaseTimerRef = useRef<number>(0); 
  const animationTimeRef = useRef<number>(0); 
  
  // Survive Mode Refs
  const waveNumberRef = useRef<number>(0);
  const waveStartTimeRef = useRef<number>(0);
  const waveCollisionDoneRef = useRef<boolean>(false);

  const isMouseDownRef = useRef<boolean>(false);
  const touchStartTimeRef = useRef<number>(0);
  const maxTouchesRef = useRef<number>(0);

  // Sync isPaused prop to ref
  useEffect(() => {
    isPausedRef.current = isPaused;
    if (!isPaused) {
        lastFrameTimeRef.current = 0; 
    }
  }, [isPaused]);

  // Reset timers on phase change
  useEffect(() => {
    phaseTimerRef.current = 0;
    if (phase === GamePhase.COUNTDOWN || phase === GamePhase.LOBBY) {
        particlesRef.current = [];
        waveNumberRef.current = 0;
        waveStartTimeRef.current = 0;
        waveCollisionDoneRef.current = false;
        dangerZonesRef.current = [];
    }
  }, [phase]);

  // Main Game Loop
  const render = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = timestamp;
    }
    const dt = timestamp - lastFrameTimeRef.current;
    lastFrameTimeRef.current = timestamp;

    const paused = isPausedRef.current;

    if (!paused) {
        phaseTimerRef.current += dt;
        animationTimeRef.current += dt;
    }
    const animTime = animationTimeRef.current;
    const phaseTime = phaseTimerRef.current;

    const width = canvas.width;
    const height = canvas.height;

    // --- LOGIC UPDATES ---
    if (!paused) {
        if (phase === GamePhase.COUNTDOWN) {
            if (phaseTime >= TIMINGS.WAITING_PHASE) {
                if (settings.mode === GameMode.CLASSIC || settings.mode === GameMode.REVERSE) {
                    dangerZonesRef.current = generateZones(width, height, settings.difficulty, settings.mode, 0, playersRef.current);
                } else {
                    // Survive mode inits wave 0 immediately on entry to REVEAL
                    waveNumberRef.current = 0;
                    waveStartTimeRef.current = animTime; 
                    dangerZonesRef.current = generateZones(width, height, settings.difficulty, settings.mode, 0, playersRef.current);
                }
                setPhase(GamePhase.REVEAL);
            }
        } else if (phase === GamePhase.REVEAL) {
            if (settings.mode === GameMode.CLASSIC || settings.mode === GameMode.REVERSE) {
                if (phaseTime >= TIMINGS.REVEAL_ANIMATION) {
                    const { survivors, total } = checkCollisions(
                        playersRef.current,
                        dangerZonesRef.current,
                        particlesRef.current,
                        settings.mode,
                        width,
                        height,
                        animTime
                    );
                    onGameOver(survivors, total, Array.from(playersRef.current.values()));
                    setPhase(GamePhase.RESULT);
                }
            } else {
                // SURVIVE MODE LOGIC
                const wave = waveNumberRef.current;
                
                // Duration Calculation: Get faster as waves progress, but floor at 800ms
                const baseDuration = Math.max(800, 2500 - (wave * 120)); 
                
                const cycleDuration = baseDuration;
                const impactTime = cycleDuration * 0.6; // Time when "hit" happens
                const localTime = animTime - waveStartTimeRef.current;

                if (localTime >= impactTime && !waveCollisionDoneRef.current) {
                    const { survivors, total } = checkCollisions(
                        playersRef.current,
                        dangerZonesRef.current,
                        particlesRef.current,
                        settings.mode,
                        width,
                        height,
                        animTime
                    );
                    waveCollisionDoneRef.current = true;
                    
                    // End game if 1 or 0 survivors remain
                    if (survivors <= 1) {
                         onGameOver(survivors, total, Array.from(playersRef.current.values()));
                         setPhase(GamePhase.RESULT);
                    }
                }

                if (localTime >= cycleDuration) {
                    waveNumberRef.current += 1;
                    waveStartTimeRef.current = animTime;
                    waveCollisionDoneRef.current = false;
                    dangerZonesRef.current = generateZones(
                      width, 
                      height, 
                      settings.difficulty, 
                      settings.mode, 
                      waveNumberRef.current,
                      playersRef.current
                    );
                }
            }
        }

        particlesRef.current = updateParticles(particlesRef.current, dt);
    }

    // --- DRAWING ---
    ctx.clearRect(0, 0, width, height);

    drawBackground(ctx, width, height, settings.difficulty, animTime);
    
    drawDangerZones(
        ctx, 
        dangerZonesRef.current, 
        phase, 
        phaseTime, 
        animTime, 
        settings.mode, 
        { number: waveNumberRef.current, startTime: waveStartTimeRef.current }
    );
    
    drawParticles(ctx, particlesRef.current);
    
    drawPlayers(ctx, playersRef.current, width, height, animTime);

    frameIdRef.current = requestAnimationFrame(render);
  }, [phase, settings.difficulty, settings.mode, setPhase, onGameOver]);

  // Logic for adding/removing players
  const updatePlayerState = useCallback((id: number, x: number, y: number, isActive: boolean) => {
    if (isPausedRef.current) return;

    if (isActive) {
      if (!playersRef.current.has(id)) {
        if (phase === GamePhase.LOBBY || phase === GamePhase.COUNTDOWN) {
          const usedColors = new Set(Array.from(playersRef.current.values()).map((p: Player) => p.color));
          
          const availableColors = COLORS.safePalette.filter(c => !usedColors.has(c));
          const color = availableColors.length > 0 
            ? availableColors[Math.floor(Math.random() * availableColors.length)]
            : COLORS.safePalette[playersRef.current.size % COLORS.safePalette.length];
          
          playersRef.current.set(id, {
            id,
            color,
            position: { x, y },
            isAlive: true,
            joinedAt: animationTimeRef.current // Use Game Time
          });
        }
      } 
    } else {
       if (playersRef.current.has(id)) {
         if (phase === GamePhase.LOBBY || phase === GamePhase.COUNTDOWN) {
            playersRef.current.delete(id);
         } else if (phase === GamePhase.REVEAL) {
            const p = playersRef.current.get(id);
            if (p && p.isAlive) {
               p.isAlive = false;
               p.deathTime = animationTimeRef.current;
               
               // Check survivor count immediately if a player leaves/lets go
               if (settings.mode === GameMode.SURVIVE) {
                   const survivors = Array.from(playersRef.current.values()).filter((pl: Player) => pl.isAlive).length;
                   // Trigger game over only if the game has actually started (waves > 0) or if we are strict
                   if (survivors <= 1) {
                        onGameOver(survivors, playersRef.current.size, Array.from(playersRef.current.values()));
                        setPhase(GamePhase.RESULT);
                   }
               }
            }
         }
       }
    }

    const count = playersRef.current.size;
    onPlayersChange(count);

    if (phase === GamePhase.LOBBY && count >= 1) {
      setPhase(GamePhase.COUNTDOWN);
    }
    if (phase === GamePhase.COUNTDOWN && count < 1) {
      setPhase(GamePhase.LOBBY);
    }
  }, [phase, setPhase, onPlayersChange, settings.mode, onGameOver]);

  const handleTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    if (e.type === 'touchstart') {
        maxTouchesRef.current = Math.max(maxTouchesRef.current, e.touches.length);
        if (e.touches.length === 1 && maxTouchesRef.current === 1) {
             touchStartTimeRef.current = Date.now();
        }
    }
    if (e.type === 'touchend') {
        if (maxTouchesRef.current === 3 && e.touches.length === 0) {
            const duration = Date.now() - touchStartTimeRef.current;
            if (duration < 600) {
                 onTogglePause();
                 maxTouchesRef.current = 0;
                 return;
            }
        }
        if (e.touches.length === 0) {
            maxTouchesRef.current = 0;
        }
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const activeIds = new Set<number>();
    
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      const id = t.identifier;
      activeIds.add(id);
      
      const x = (t.clientX - rect.left) * (canvas.width / rect.width);
      const y = (t.clientY - rect.top) * (canvas.height / rect.height);
      
      updatePlayerState(id, x, y, true);
    }

    playersRef.current.forEach((player) => {
      if (player.id !== -1 && !activeIds.has(player.id)) {
        updatePlayerState(player.id, 0, 0, false);
      }
    });

  }, [updatePlayerState, onTogglePause]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    updatePlayerState(-1, x, y, true);
  }, [updatePlayerState]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    updatePlayerState(-1, x, y, true);
  }, [updatePlayerState]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    isMouseDownRef.current = false;
    updatePlayerState(-1, 0, 0, false);
  }, [updatePlayerState]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      updatePlayerState(-1, 0, 0, false);
    }
  }, [updatePlayerState]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    lastFrameTimeRef.current = 0;
    frameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [render]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full touch-none select-none overflow-hidden bg-transparent">
      <canvas
        ref={canvasRef}
        className="block touch-none select-none"
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouch}
        onTouchCancel={handleTouch}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};