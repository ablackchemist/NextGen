import React from 'react';
import { motion } from 'framer-motion';
import { X, Linkedin, User as UserIcon } from 'lucide-react';
import { MentorProfile } from './MentorProfileOverlay';

export function MentorDirectoryOverlay({ 
  mentors,
  onClose,
  onSelectMentor
}: { 
  mentors: MentorProfile[];
  onClose: () => void;
  onSelectMentor: (m: MentorProfile) => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-5xl h-[85vh] bg-gray-900 border border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Mentor Directory</h2>
            <p className="text-blue-400 mt-1">Connect with professional leaders in STEM.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map(m => (
              <motion.div 
                key={m.id}
                whileHover={{ y: -5 }}
                className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-2xl overflow-hidden flex flex-col transition-colors cursor-pointer group"
                onClick={() => onSelectMentor(m)}
              >
                <div className="h-24 bg-gradient-to-r from-blue-900/50 to-purple-900/50 relative" />
                <div className="px-5 pb-5 flex-1 flex flex-col items-center text-center relative -mt-12">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800 bg-gray-700 mb-4 flex-shrink-0 group-hover:border-blue-500 transition-colors">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={40} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{m.name}</h3>
                  <p className="text-sm text-blue-400 font-medium mb-4 flex-1 line-clamp-3">{m.title}</p>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(m.linkedin, '_blank');
                    }}
                    className="flexItems-center justify-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] font-semibold py-2 px-4 rounded-xl transition-colors w-full"
                  >
                    <Linkedin size={16} />
                    View LinkedIn
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
