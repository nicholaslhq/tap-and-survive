import React, { useState, useEffect, useCallback } from 'react';
import { GamePhase, GameSettings, Difficulty, GameMode, Player, GameResultData } from './types';
import { GameCanvas } from './components/GameCanvas';
import { HomeView } from './components/views/HomeView';
import { SettingsView } from './components/views/SettingsView';
import { ResultModal } from './components/views/ResultModal';
import { GameOverlay } from './components/GameOverlay';
import { RoundEndEffects } from './components/RoundEndEffects';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // Global State
  const [phase, setPhase] = useState<GamePhase>(GamePhase.HOME);
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: Difficulty.EASY,
    mode: GameMode.CLASSIC,
  });
  
  // Ephemeral Gameplay State
  const [playerCount, setPlayerCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [gameResult, setGameResult] = useState<GameResultData | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Toggle Pause
  const togglePause = useCallback(() => {
    if (phase === GamePhase.LOBBY || phase === GamePhase.COUNTDOWN || phase === GamePhase.REVEAL) {
      setIsPaused((prev) => !prev);
    }
  }, [phase]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Escape') {
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause]);

  useEffect(() => {
    if (phase === GamePhase.COUNTDOWN) {
      if (!isPaused) {
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    } else {
        if (phase === GamePhase.LOBBY) setCountdown(3);
    }
  }, [phase, isPaused]);

  const handleGameOver = (survivors: number, total: number, players: Player[]) => {
    setGameResult({ survivors, total, players });
    setShowSummary(false); 
    setIsPaused(false);
  };

  const resetGame = () => {
    setPhase(GamePhase.LOBBY);
    setGameResult(null);
    setPlayerCount(0);
    setGameKey(prev => prev + 1);
    setShowSummary(false);
    setIsPaused(false);
    setCountdown(3);
  };

  const goHome = () => {
    setPhase(GamePhase.HOME);
    setGameResult(null);
    setPlayerCount(0);
    setGameKey(prev => prev + 1); 
    setShowSummary(false);
    setIsPaused(false);
  };

  return (
    <div className="relative w-full h-full bg-[#FEFCE8] overflow-hidden select-none">
       <div className="absolute inset-0 bg-dot-pattern z-0"></div>
       
       {/* Canvas is always mounted but logic handles phase */}
       <GameCanvas 
         key={gameKey}
         phase={phase}
         setPhase={setPhase}
         settings={settings}
         onPlayersChange={setPlayerCount}
         onGameOver={handleGameOver}
         isPaused={isPaused}
         onTogglePause={togglePause}
       />
       
       {/* Visual Effects Layer - Above Canvas, Below Overlay */}
       <RoundEndEffects phase={phase} result={gameResult} />

       <GameOverlay 
         phase={phase}
         settings={settings}
         isPaused={isPaused}
         countdown={countdown}
         onTogglePause={togglePause}
         onResume={togglePause}
         onQuit={goHome}
         onShowResults={() => setShowSummary(true)}
         hasResult={!!gameResult}
         showSummary={showSummary}
       />

       {/* View Layers */}
       <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {phase === GamePhase.HOME && (
               <HomeView 
                 key="home"
                 onStart={() => setPhase(GamePhase.LOBBY)}
                 onSettings={() => setPhase(GamePhase.SETTINGS)}
               />
            )}
            {phase === GamePhase.SETTINGS && (
               <SettingsView 
                 key="settings"
                 settings={settings}
                 onUpdateSettings={setSettings}
                 onBack={() => setPhase(GamePhase.HOME)}
               />
            )}
          </AnimatePresence>
       </div>
       
       <AnimatePresence>
         {phase === GamePhase.RESULT && gameResult && showSummary && (
            <ResultModal 
               key="result"
               result={gameResult}
               mode={settings.mode}
               onClose={() => setShowSummary(false)}
               onPlayAgain={resetGame}
               onHome={goHome}
            />
         )}
       </AnimatePresence>
    </div>
  );
};

export default App;