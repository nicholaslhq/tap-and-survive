import React from 'react';
import { motion } from 'framer-motion';
import { GamePhase, GameResultData } from '../types';

interface RoundEndEffectsProps {
  phase: GamePhase;
  result: GameResultData | null;
}

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export const RoundEndEffects: React.FC<RoundEndEffectsProps> = ({ phase, result }) => {
  if (phase !== GamePhase.RESULT || !result) return null;

  const hasSurvivors = result.survivors > 0;
  
  // Choose border color based on outcome
  const borderColor = hasSurvivors ? 'border-[#84CC16]' : 'border-red-500';

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {/* Border Animation */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: [0, 1, 1, 0]
            }}
            transition={{ duration: 3, times: [0, 0.1, 0.8, 1] }}
            className={`absolute inset-0 border-[16px] md:border-[24px] ${borderColor} box-border`}
            style={{ pointerEvents: 'none' }}
        />

        {/* Success Confetti */}
        {hasSurvivors && (
            <>
                {Array.from({ length: 60 }).map((_, i) => (
                    <ConfettiPiece key={i} index={i} />
                ))}
            </>
        )}

        {/* Failure Shake/Overlay */}
        {!hasSurvivors && (
            <motion.div
                initial={{ x: 0, opacity: 0 }}
                animate={{ 
                    x: [0, -10, 10, -10, 10, 0],
                    opacity: [0, 0.3, 0]
                }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-red-500 mix-blend-multiply"
            />
        )}
        
        {/* Text Indicator for "Release" */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [0.95, 1, 1, 1],
            }}
            transition={{ duration: 3, times: [0, 0.1, 0.8, 1] }}
            className="absolute top-1/4 left-0 right-0 flex justify-center"
        >
            <div className={`px-6 py-2 font-black text-2xl border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] bg-white ${hasSurvivors ? 'text-green-600' : 'text-red-500'} rotate-2`}>
                {hasSurvivors ? "SURVIVED!" : "WIPED OUT"}
            </div>
        </motion.div>
    </div>
  );
};

const ConfettiPiece: React.FC<{ index: number }> = ({ index }) => {
    // Deterministic randomness based on index to avoid hydration mismatch if SSR (though here it's client-side)
    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 0.2;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = 10 + Math.random() * 10;
    
    return (
        <motion.div
            initial={{ y: -50, x: `${randomX}vw`, rotate: 0 }}
            animate={{ 
                y: '110vh', 
                rotate: 360 + Math.random() * 360,
                x: `${randomX + (Math.random() - 0.5) * 20}vw` 
            }}
            transition={{ 
                duration: 1.5 + Math.random(), 
                delay: randomDelay, 
                ease: "easeOut" 
            }}
            className="absolute border border-black/20"
            style={{ 
                backgroundColor: randomColor,
                width: size,
                height: size,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%'
            }}
        />
    )
};