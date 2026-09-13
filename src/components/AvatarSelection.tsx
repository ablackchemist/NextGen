import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const femaleAvatars = [
  { id: 'f2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine&skinColor=d08b5b&backgroundColor=d1d4f9', name: 'Jasmine' },
  { id: 'f3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&skinColor=614335&backgroundColor=c0aede', name: 'Zoe' },
  { id: 'f4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&skinColor=614335&backgroundColor=ffd5dc', name: 'Chloe' },
  { id: 'f6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily&skinColor=ffdbb4&backgroundColor=ffd5dc', name: 'Lily' },
  { id: 'f7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eva&skinColor=825c43&backgroundColor=d1d4f9', name: 'Eva' },
  { id: 'm3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan&skinColor=825c43&backgroundColor=b6e3f4', name: 'Ryan' },
  { id: 'm4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&skinColor=fd9841&backgroundColor=d1d4f9', name: 'Leo' },
  { id: 'm5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&skinColor=ae5d29&backgroundColor=c0aede', name: 'Sam' },
  { id: 'm7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar&skinColor=edb98a&backgroundColor=b6e3f4', name: 'Oscar' },
  { id: 'm8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake&skinColor=fd9841&backgroundColor=c0aede', name: 'Jake' },
  { id: 'm9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah&skinColor=ffdbb4&backgroundColor=ffd5dc', name: 'Noah' },
  { id: 'm14', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William&skinColor=614335&backgroundColor=b6e3f4', name: 'William' },
  { id: 'm16', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&skinColor=825c43&backgroundColor=c0aede', name: 'Lucas' }
];

const maleAvatars = [
  { id: 'f1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&skinColor=edb98a&backgroundColor=c0aede', name: 'Aneka' },
  { id: 'f5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&skinColor=d08b5b&backgroundColor=b6e3f4', name: 'Mia' },
  { id: 'f8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&skinColor=edb98a&backgroundColor=b6e3f4', name: 'Emma' },
  { id: 'm1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&skinColor=ffdbb4&backgroundColor=b6e3f4', name: 'Felix' },
  { id: 'm2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason&skinColor=ae5d29&backgroundColor=ffd5dc', name: 'Mason' },
  { id: 'm6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&skinColor=614335&backgroundColor=d1d4f9', name: 'Max' },
  { id: 'm10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam&skinColor=edb98a&backgroundColor=b6e3f4', name: 'Liam' },
  { id: 'm11', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&skinColor=d08b5b&backgroundColor=d1d4f9', name: 'Oliver' },
  { id: 'm12', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elijah&skinColor=ae5d29&backgroundColor=c0aede', name: 'Elijah' },
  { id: 'm13', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&skinColor=825c43&backgroundColor=ffd5dc', name: 'James' },
  { id: 'm15', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin&skinColor=fd9841&backgroundColor=d1d4f9', name: 'Benjamin' },
];

export function AvatarSelection({ onSelect }: { onSelect: (url: string) => void }) {
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const currentAvatars = selectedGender === 'male' ? maleAvatars : femaleAvatars;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-y-auto p-4 sm:p-8"
    >
      <div className="bg-gray-900 border border-gray-700 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-auto my-auto mt-10 mb-10 sm:my-auto">
        <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Identity Kiosk</h2>
        <p className="text-gray-400 text-center mb-8">Select your digital avatar styling to enter the NOBCChE NextGen campus.</p>
        
        <AnimatePresence mode="wait">
          {!selectedGender ? (
            <motion.div
              key="gender-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-xl font-medium text-white text-center mb-4">Choose Category</h3>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setSelectedGender('female')}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 p-6 rounded-2xl transition-all hover:scale-105"
                >
                  <div className="text-2xl font-bold mb-2">Female</div>
                  <div className="text-gray-400 text-sm">View options</div>
                </button>
                <button
                  onClick={() => setSelectedGender('male')}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 p-6 rounded-2xl transition-all hover:scale-105"
                >
                  <div className="text-2xl font-bold mb-2">Male</div>
                  <div className="text-gray-400 text-sm">View options</div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="avatar-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col"
            >
              <button 
                onClick={() => { setSelectedGender(null); setSelected(null); }}
                className="text-gray-400 hover:text-white text-sm mb-4 self-start flex items-center gap-1 transition-colors"
              >
                ← Back to categories
              </button>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {currentAvatars.map(avatar => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelected(avatar.url)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex-shrink-0 transition-all overflow-hidden p-1 ${
                      selected === avatar.url 
                      ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-gray-900 scale-110 shadow-lg shadow-blue-500/50' 
                      : 'hover:scale-105 opacity-60 hover:opacity-100 cursor-pointer'
                    }`}
                    title={avatar.name}
                  >
                    <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover rounded-full bg-gray-100" />
                  </button>
                ))}
              </div>
              
              <button
                disabled={!selected}
                onClick={() => selected && onSelect(selected)}
                className={`w-full text-lg font-bold py-4 rounded-xl transition-all shadow-lg ${
                  selected 
                    ? 'bg-white text-gray-900 hover:bg-gray-200 shadow-white/10 opacity-100' 
                    : 'bg-white/10 text-white/50 cursor-not-allowed opacity-50'
                }`}
              >
                Join Workspace
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
