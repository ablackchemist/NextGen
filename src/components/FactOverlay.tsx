import { motion } from "framer-motion";
import { X, Info, GraduationCap, Building2 } from "lucide-react";

export function FactOverlay({ 
  title, 
  content, 
  type,
  onClose 
}: { 
  title: string; 
  content: string; 
  type: 'mentor' | 'kiosk';
  onClose: () => void; 
}) {
  const isMentor = type === 'mentor';
  const Icon = isMentor ? GraduationCap : Building2;
  const colorClass = isMentor ? "text-yellow-400" : "text-cyan-400";
  const bgClass = isMentor ? "from-yellow-900/20 to-yellow-600/10" : "from-cyan-900/20 to-cyan-600/10";
  const borderClass = isMentor ? "border-yellow-500/30" : "border-cyan-500/30";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 pointer-events-auto bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-lg overflow-hidden shadow-2xl flex flex-col bg-gray-900 rounded-3xl border ${borderClass}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <Icon className={colorClass} size={28} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isMentor ? "Mentor Encounter" : "Information Kiosk"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={`p-8 bg-gradient-to-br ${bgClass} relative object-cover`}>
          <h3 className={`text-2xl font-bold mb-4 ${colorClass}`}>{title}</h3>
          <p className="text-gray-200 text-lg leading-relaxed">{content}</p>
          
          <button 
            onClick={onClose}
            className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
