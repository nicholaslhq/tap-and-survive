import React from 'react';
import { NeoCard } from '../NeoCard';
import { NeoButton } from '../NeoButton';
import { Difficulty, GameMode, GameSettings } from '../../types';
import { motion, Variants } from 'framer-motion';

interface SettingsViewProps {
  settings: GameSettings;
  onUpdateSettings: (s: GameSettings) => void;
  onBack: () => void;
}

const letterContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const letterVariants: Variants = {
  hidden: { y: 50, opacity: 0, rotate: 10 },
  visible: { 
    y: 0, 
    opacity: 1, 
    rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 15 } 
  },
};

const cardVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0, rotate: -3 },
  visible: { scale: 1, opacity: 1, rotate: 0, transition: { type: "spring", duration: 0.6 } },
  exit: { scale: 0.8, opacity: 0, rotate: 3, transition: { duration: 0.3 } }
};

const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 3, -3, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
  }
};

const ModeIcon: React.FC<{ mode: GameMode }> = ({ mode }) => {
  if (mode === GameMode.CLASSIC) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  if (mode === GameMode.REVERSE) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6" />
        <path d="M21.34 5.5A10 10 0 1 1 11 2c2.1 0 4.02.66 5.6 1.81" />
        <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0" />
      </svg>
    );
  }
  if (mode === GameMode.SURVIVE) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  return null;
};

const DifficultyIcon: React.FC<{ diff: Difficulty }> = ({ diff }) => {
  if (diff === Difficulty.EASY) {
    // Heart Icon - Represents high survivability/life
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (diff === Difficulty.MEDIUM) {
    // Zap/Lightning Icon - Represents speed and action
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (diff === Difficulty.HARD) {
    // Skull Icon - Represents danger/death
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings, onBack }) => {
  const title = "SETTINGS";

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center h-full w-full p-4 pointer-events-auto relative"
    >
      {/* Abstract Background Elements */}
      <motion.div 
        variants={floatingVariants}
        animate="animate"
        className="absolute top-[15%] right-[10%] w-20 h-20 border-4 border-black/10 rotate-12"
      />
      <motion.div 
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-[15%] left-[10%] w-16 h-16 rounded-full border-4 border-black/10 border-dashed"
        style={{ animationDelay: "1s" }}
      />

      <motion.div variants={cardVariants} className="w-full max-w-md relative z-10">
        <NeoCard className="bg-white">
          <motion.div 
            variants={letterContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center mb-8"
          >
             {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  className="text-4xl md:text-5xl font-black tracking-tighter"
                  style={{ textShadow: "3px 3px 0 #e2e8f0" }}
                >
                  {char}
                </motion.span>
             ))}
          </motion.div>
          
          <div className="mb-6">
             <label className="block font-bold mb-2 bg-black text-white inline-block px-2 -rotate-3">MODE</label>
             <div className="flex flex-col gap-3 mt-2">
                <NeoButton 
                  variant={settings.mode === GameMode.CLASSIC ? 'primary' : 'secondary'}
                  onClick={() => onUpdateSettings({...settings, mode: GameMode.CLASSIC})}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <ModeIcon mode={GameMode.CLASSIC} />
                    CLASSIC
                  </div>
                </NeoButton>
                <NeoButton 
                  variant={settings.mode === GameMode.REVERSE ? 'primary' : 'secondary'}
                  onClick={() => onUpdateSettings({...settings, mode: GameMode.REVERSE})}
                  className="w-full text-left"
                >
                   <div className="flex items-center gap-3">
                    <ModeIcon mode={GameMode.REVERSE} />
                    REVERSE
                  </div>
                </NeoButton>
                <NeoButton 
                  variant={settings.mode === GameMode.SURVIVE ? 'primary' : 'secondary'}
                  onClick={() => onUpdateSettings({...settings, mode: GameMode.SURVIVE})}
                  className="w-full text-left"
                >
                   <div className="flex items-center gap-3">
                    <ModeIcon mode={GameMode.SURVIVE} />
                    SURVIVE
                  </div>
                </NeoButton>
             </div>
          </div>

          <div className="mb-8">
            <label className="block font-bold mb-2 bg-black text-white inline-block px-2 rotate-3">DIFFICULTY</label>
            <div className="flex flex-col gap-3 mt-2">
              {(Object.keys(Difficulty) as Difficulty[]).map((d) => (
                <NeoButton
                  key={d}
                  variant={settings.difficulty === d ? 'primary' : 'secondary'}
                  onClick={() => onUpdateSettings({ ...settings, difficulty: d })}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <DifficultyIcon diff={d} />
                    {d}
                  </div>
                </NeoButton>
              ))}
            </div>
          </div>

          <NeoButton onClick={onBack} className="w-full" variant="secondary">
             <div className="flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="m12 19-7-7 7-7"/>
                   <path d="M19 12H5"/>
                </svg>
                BACK
             </div>
          </NeoButton>
        </NeoCard>
      </motion.div>
    </motion.div>
  );
};