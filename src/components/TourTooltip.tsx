import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

export function TourTooltip({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-24 right-6 z-50 w-80 bg-blue-600 text-white p-5 rounded-2xl shadow-2xl border border-blue-400 pointer-events-auto"
    >
      <button onClick={onClose} className="absolute top-3 right-3 text-blue-200 hover:text-white transition-colors">
        <X size={18} />
      </button>
      
      {/* Up-pointing arrow triangle */}
      <div className="absolute -top-3 right-12 text-blue-600">
        <svg width="24" height="12" viewBox="0 0 24 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L24 12H0L12 0Z" />
        </svg>
      </div>

      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <ArrowUpRight size={20} />
        Welcome to your Hub!
      </h3>
      
      <p className="text-sm text-blue-100 mb-5 leading-relaxed">
        Use these tools to track your milestones, manage your mentorship journal, and gather inspiration from STEM pioneers.
      </p>
      
      <button 
        onClick={onClose}
        className="w-full py-2.5 bg-white text-blue-700 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors shadow-sm"
      >
        Let's get started
      </button>
    </motion.div>
  );
}
