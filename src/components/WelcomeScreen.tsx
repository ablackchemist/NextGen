import React from 'react';
import { motion } from 'framer-motion';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px]" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <div className="mb-4">
          <span className="text-2xl font-bold tracking-widest text-blue-500 uppercase">NOBCChE</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          NextGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Mentors</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12">
          An immersive 3D mentorship and professional development experience.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow duration-300"
        >
          Start Experience
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
