import React from 'react';
import { NeoCard } from '../NeoCard';
import { NeoButton } from '../NeoButton';
import { GameMode, GameResultData } from '../../types';
import { motion, Variants } from 'framer-motion';

interface ResultModalProps {
  result: GameResultData;
  mode: GameMode;
  onClose: () => void;
  onPlayAgain: () => void;
  onHome: () => void;
}

const letterContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const letterVariants: Variants = {
  hidden: { y: -50, opacity: 0, rotate: -10 },
  visible: { 
    y: 0, 
    opacity: 1, 
    rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 15 } 
  },
};

const playerListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.3 }
  }
};

const playerItemVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring" } }
};

export const ResultModal: React.FC<ResultModalProps> = ({ result, mode, onClose, onPlayAgain, onHome }) => {
  let title = "ROUND OVER";
  if (mode === GameMode.SURVIVE) {
    if (result.survivors === 1) title = "WINNER!";
    else if (result.survivors === 0) title = "NO SURVIVORS";
    else title = "SURVIVED"; 
  } else if (mode === GameMode.REVERSE) {
     title = result.survivors === 0 ? "GAME OVER" : "SUCCESS";
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50 p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
        <motion.div
           initial={{ scale: 0.8, y: 50, opacity: 0 }}
           animate={{ scale: 1, y: 0, opacity: 1 }}
           transition={{ type: "spring", damping: 15 }}
        >
          <NeoCard color="bg-white" className="text-center relative pt-12 overflow-hidden">
             {/* Decorative Background Flash */}
             <motion.div 
               initial={{ x: '-100%' }}
               animate={{ x: '200%' }}
               transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
               className="absolute top-0 left-0 w-full h-full bg-zinc-200/30 -skew-x-12 z-0 pointer-events-none"
             />

            <button 
              onClick={onClose}
              className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-all z-10"
              aria-label="Minimize"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
            </button>

            <div className="relative z-10">
              <motion.div 
                 variants={letterContainerVariants}
                 initial="hidden"
                 animate="visible"
                 className="flex flex-wrap justify-center mb-4 leading-none"
              >
                 {title.split("").map((char, i) => (
                    <motion.span 
                      key={i} 
                      variants={letterVariants}
                      className="text-4xl font-black text-black drop-shadow-[3px_3px_0_rgba(0,0,0,0.2)]"
                    >
                       {char === " " ? "\u00A0" : char}
                    </motion.span>
                 ))}
              </motion.div>

              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-bold mb-8 bg-black text-white inline-block px-4 py-1 -rotate-2 shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
              >
                Survivors: <span className={result.survivors > 0 ? "text-green-400" : "text-red-400"}>{result.survivors}</span> / {result.total}
              </motion.div>
              
              <motion.div 
                variants={playerListVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap justify-center gap-3 mb-8 max-w-[280px] mx-auto"
              >
                  {[...result.players]
                    .sort((a, b) => (a.isAlive === b.isAlive ? 0 : a.isAlive ? -1 : 1))
                    .map((p) => (
                    <motion.div key={p.id} variants={playerItemVariants} className="relative group">
                      <div 
                        className={`w-10 h-10 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${!p.isAlive ? 'opacity-50 grayscale bg-gray-300' : ''}`}
                        style={{ backgroundColor: p.isAlive ? p.color : undefined }}
                      />
                      {!p.isAlive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg 
                            className="w-6 h-6 drop-shadow-sm" 
                            style={{ color: p.color }} 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </motion.div>

              <div className="flex flex-col gap-3">
                <NeoButton onClick={onPlayAgain} size="lg">
                   <div className="flex items-center justify-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                         <path d="M3 3v5h5"/>
                         <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                         <path d="M16 16h5v5"/>
                      </svg>
                      PLAY AGAIN
                   </div>
                </NeoButton>
                <NeoButton onClick={onHome} variant="secondary">
                   <div className="flex items-center justify-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                         <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      HOME
                   </div>
                </NeoButton>
              </div>
            </div>
          </NeoCard>
        </motion.div>
      </div>
    </motion.div>
  );
};