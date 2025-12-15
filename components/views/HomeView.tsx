import React from 'react';
import { NeoButton } from '../NeoButton';
import { motion, Variants } from 'framer-motion';

interface HomeViewProps {
  onStart: () => void;
  onSettings: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const letterContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const letterVariants: Variants = {
  hidden: { y: 100, opacity: 0, rotate: 10 },
  visible: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 15 }
  },
};

const floatingVariants: Variants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
};

export const HomeView: React.FC<HomeViewProps> = ({ onStart, onSettings }) => {
  const line1 = "TAP &";
  const line2 = "SURVIVE";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center h-full w-full space-y-10 p-4 pointer-events-auto relative overflow-hidden"
    >
      {/* Abstract Background Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-[10%] left-[10%] w-24 h-24 rounded-full border-4 border-black/5 border-dashed"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-[20%] right-[10%] w-32 h-32 rotate-45 border-4 border-black/5"
        style={{ animationDelay: "1s" }}
      />

      {/* Dynamic Title Section */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          variants={letterContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center leading-[0.85]"
        >
          {/* TAP & */}
          <div className="flex overflow-visible relative z-20">
            {line1.split("").map((char, index) => (
              <motion.span
                key={`l1-${index}`}
                variants={letterVariants}
                className="text-[6rem] min-[400px]:text-[5rem] md:text-[7rem] font-black text-purple-600 drop-shadow-[5px_5px_0_#000] tracking-tighter"
                style={{ WebkitTextStroke: "2px black" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* SURVIVE */}
          <div className="flex overflow-visible relative z-10 mt-2 p-2">
            {/* Animated Background Highlight */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
              className="absolute inset-0 bg-yellow-300 border-2 border-black -skew-x-6 scale-110 origin-left -z-10 shadow-[4px_4px_0_#000]"
            />

            {line2.split("").map((char, index) => (
              <motion.span
                key={`l2-${index}`}
                variants={letterVariants}
                className="text-[4rem] min-[400px]:text-[3.5rem] md:text-[6rem] font-black text-red-500 tracking-tighter mx-[1px]"
                style={{
                  WebkitTextStroke: "2px black",
                  textShadow: "4px 4px 0 #000"
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Subtitle Badge */}
        <motion.div
          variants={itemVariants}
          className="mt-10 relative"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl md:text-2xl font-bold bg-white px-6 py-2 border-2 border-black shadow-[4px_4px_0_#000] -rotate-2"
          >
            DON'T LET GO
          </motion.div>

          {/* Rotating Sparkle Decor */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -top-5 -right-5 text-black w-8 h-8"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-4 -left-4 text-black w-6 h-6"
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="10" y="0" width="4" height="24" /><rect x="0" y="10" width="24" height="4" /></svg>
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="flex flex-col gap-4 w-full max-w-xs z-10 mt-6">
        <NeoButton onClick={onStart} size="lg" className="w-full">
          <div className="flex items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            START GAME
          </div>
        </NeoButton>
        <NeoButton onClick={onSettings} variant="secondary" className="w-full">
          <div className="flex items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            SETTINGS
          </div>
        </NeoButton>
      </motion.div>

      <motion.div variants={itemVariants} className="text-sm font-bold opacity-60 z-10 text-center">
        <div>Local Multiplayer</div>
        <div>Mobile Recommended</div>
        <div className="mt-6">
          Created by <a href="https://nlhq.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 transition-opacity">Nicholas</a>
        </div>
      </motion.div>
    </motion.div>
  );
};