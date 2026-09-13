import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Linkedin, X, User as UserIcon } from 'lucide-react';

export interface MentorProfile {
  id: string;
  name: string;
  title: string;
  linkedin: string;
  avatarUrl: string;
}

export function MentorProfileOverlay({ 
  profile,
  onClose
}: { 
  profile: MentorProfile;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 pointer-events-auto w-full max-w-sm"
    >
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 h-24 relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="px-6 pb-6 relative flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-900 bg-gray-800 -mt-12 mb-4 shadow-xl">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserIcon size={40} className="text-gray-500" />
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-1 text-center">{profile.name}</h3>
        <p className="text-blue-400 font-medium text-center mb-6">{profile.title}</p>
        
        <div className="w-full bg-gray-800 rounded-xl p-4 border border-gray-700/50 mb-6 flex items-start gap-3">
          <Briefcase className="text-gray-400 mt-1 flex-shrink-0" size={18} />
          <p className="text-sm text-gray-300 leading-relaxed">
            Professional mentor available in the NOBCChE directory. Connect to learn more about their STEM career journey and industry insights.
          </p>
        </div>

        <a 
          href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold py-3 rounded-xl transition-colors"
        >
          <Linkedin size={20} />
          View LinkedIn Profile
        </a>
      </div>
    </motion.div>
  );
}
