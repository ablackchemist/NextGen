import { useEffect } from "react";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

export function TierCelebrationOverlay({ tier, onComplete }: { tier: string; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // close after 3.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[200] flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.5, y: 50, opacity: 0 }}
        animate={{ 
          scale: [0.5, 1.2, 1],
          y: [50, -20, 0],
          opacity: 1
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
          times: [0, 0.6, 1]
        }}
        className="flex flex-col items-center justify-center -mt-20"
      >
        <motion.div
          animate={{ 
            rotate: [0, -15, 15, -15, 15, 0],
            scale: [1, 1.2, 1.2, 1.2, 1.2, 1]
          }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="bg-yellow-500/20 p-6 rounded-full border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] mb-6"
        >
          <PartyPopper size={64} className="text-yellow-400" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-2">
            MILESTONE UNLOCKED
          </h2>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 1, bounce: 0.6 }}
            className="inline-block bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text text-3xl md:text-4xl font-extrabold uppercase tracking-widest drop-shadow-md"
          >
            {tier}
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Decorative particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 1, 
            scale: 0, 
            x: "-50%", 
            y: "-50%",
            left: "50%",
            top: "50%"
          }}
          animate={{ 
            opacity: 0,
            scale: Math.random() * 2 + 1,
            x: `calc(-50% + ${(Math.random() - 0.5) * 600}px)`,
            y: `calc(-50% + ${(Math.random() - 0.5) * 600}px)`,
          }}
          transition={{ 
            duration: 1.5 + Math.random() * 1,
            ease: "easeOut",
            delay: 0.3
          }}
          className={`absolute w-4 h-4 rounded-full ${
            ['bg-yellow-400', 'bg-pink-400', 'bg-cyan-400', 'bg-emerald-400'][i % 4]
          } shadow-[0_0_15px_rgba(255,255,255,0.8)]`}
        />
      ))}
    </motion.div>
  );
}
