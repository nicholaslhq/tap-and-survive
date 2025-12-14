import React from 'react';
import { GamePhase, GameSettings, GameMode, Difficulty } from '../types';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface GameOverlayProps {
  phase: GamePhase;
  settings: GameSettings;
  isPaused: boolean;
  countdown: number;
  onTogglePause: () => void;
  onResume: () => void;
  onQuit: () => void;
  onShowResults: () => void;
  hasResult: boolean;
  showSummary: boolean;
}

const letterContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const letterVariants: Variants = {
  hidden: { y: 50, opacity: 0, rotate: 5 },
  visible: { 
    y: 0, 
    opacity: 1, 
    rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 20 } 
  },
};

// --- Reused Icon Components ---

const ModeIcon: React.FC<{ mode: GameMode }> = ({ mode }) => {
  if (mode === GameMode.CLASSIC) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  if (mode === GameMode.REVERSE) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6" />
        <path d="M21.34 5.5A10 10 0 1 1 11 2c2.1 0 4.02.66 5.6 1.81" />
        <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0" />
      </svg>
    );
  }
  if (mode === GameMode.SURVIVE) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  return null;
};

const DifficultyIcon: React.FC<{ diff: Difficulty }> = ({ diff }) => {
  if (diff === Difficulty.EASY) {
    // Heart Icon
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (diff === Difficulty.MEDIUM) {
    // Zap/Lightning Icon
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (diff === Difficulty.HARD) {
    // Skull Icon
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12.5 17-.5-4" />
        <path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <path d="M8 20v2h8v-2" />
      </svg>
    );
  }
  return null;
};

export const GameOverlay: React.FC<GameOverlayProps> = ({
  phase,
  settings,
  isPaused,
  countdown,
  onTogglePause,
  onResume,
  onQuit,
  onShowResults,
  hasResult,
  showSummary,
}) => {
  if (phase === GamePhase.HOME || phase === GamePhase.SETTINGS) return null;

  const lobbyText = "TAP & HOLD";

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      
      {/* Pause Button Layer */}
      {!hasResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-6 right-6 pointer-events-auto z-30"
        >
          <NeoButton 
            onClick={onTogglePause}
            className="!p-3 !bg-white !text-black"
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            )}
          </NeoButton>
        </motion.div>
      )}

      {/* PAUSED OVERLAY */}
      <AnimatePresence>
      {isPaused && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50"
          onClick={onTogglePause}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <NeoCard className="bg-white text-center">
                <h2 className="text-4xl font-black mb-6">PAUSED</h2>
                <div className="flex flex-col gap-4 min-w-[200px]">
                  <NeoButton onClick={onResume} size="lg">
                     <div className="flex items-center justify-center gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        RESUME
                     </div>
                  </NeoButton>
                  <NeoButton variant="danger" onClick={onQuit}>
                     <div className="flex items-center justify-center gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                           <polyline points="16 17 21 12 16 7"/>
                           <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        QUIT
                     </div>
                  </NeoButton>
                </div>
              </NeoCard>
            </motion.div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* CENTERED CONTENT LAYER */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Lobby Instructions */}
        <AnimatePresence>
        {phase === GamePhase.LOBBY && !isPaused && (
          <motion.div 
            key="lobby"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute flex flex-col items-center gap-6 w-full px-4"
          >
            <div className="flex flex-col items-center gap-2">
                <motion.div 
                   initial={{ y: -20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.3 }}
                   exit={{ opacity: 0, transition: { duration: 0 } }}
                   className="flex gap-4"
                >
                  <div className="bg-white border-2 border-black px-3 py-1 font-bold text-sm shadow-[3px_3px_0_#000] rotate-3 flex items-center gap-2">
                      <ModeIcon mode={settings.mode} />
                      {settings.mode}
                  </div>
                  <div className="bg-white border-2 border-black px-3 py-1 font-bold text-sm shadow-[3px_3px_0_#000] -rotate-3 flex items-center gap-2">
                      <DifficultyIcon diff={settings.difficulty} />
                      {settings.difficulty}
                  </div>
                </motion.div>

                <motion.div 
                  variants={letterContainerVariants}
                  className="flex flex-wrap justify-center my-6"
                >
                  {lobbyText.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={letterVariants}
                      className="text-6xl md:text-8xl font-black text-white drop-shadow-[4px_4px_0_#000]"
                      style={{ WebkitTextStroke: "2px black" }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: 0.6 }}
                   exit={{ opacity: 0, transition: { duration: 0 } }}
                   className="font-bold bg-white inline-block px-6 py-2 border-2 border-black shadow-[4px_4px_0_#000]"
                >
                  <span className="animate-pulse">Waiting for players...</span>
                </motion.div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Countdown */}
        <AnimatePresence mode="popLayout">
        {phase === GamePhase.COUNTDOWN && !isPaused && (
          <motion.div 
            key={countdown}
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1.5, opacity: 1, y: 0 }}
            exit={{ scale: 2, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute text-9xl font-black text-purple-600 drop-shadow-[6px_6px_0_#000]"
          >
            {countdown > 0 ? countdown : "GO!"}
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* View Results Button */}
      {phase === GamePhase.RESULT && hasResult && !showSummary && (
        <motion.div 
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="pointer-events-auto absolute bottom-6 right-6 z-30"
        >
          <button 
            onClick={onShowResults} 
            className="group bg-white text-black border-2 border-black hover:bg-yellow-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all p-3"
            aria-label="View Results"
          >
            <svg 
              className="animate-nudge-right group-hover:animate-none"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
};