import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { VirtualJoysticks } from './components/VirtualJoysticks';
import { UIOverlay } from './components/UIOverlay';
import { AvatarSelection } from './components/AvatarSelection';
import { MentorshipJournalOverlay } from './components/MentorshipJournalOverlay';
import { MentorSpotlightOverlay } from './components/MentorSpotlightOverlay';
import { AchievementsOverlay, getAchievements } from './components/AchievementsOverlay';
import { TourTooltip } from './components/TourTooltip';
import { FactOverlay } from './components/FactOverlay';
import { ProfileOverlay } from './components/ProfileOverlay';
import { MentorDirectoryOverlay } from './components/MentorDirectoryOverlay';
import { TierCelebrationOverlay } from './components/TierCelebrationOverlay';
import { DailyInspirationWidget } from './components/DailyInspirationWidget';
import { WelcomeScreen } from './components/WelcomeScreen';
import { VoiceChatWidget } from './components/VoiceChatWidget';
import { MentorOnboarding } from './components/MentorOnboarding';
import { MenteeOnboarding } from './components/MenteeOnboarding';
import { MentorProfileOverlay, MentorProfile } from './components/MentorProfileOverlay';
import { Tier } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Map, Star, Award, Camera, Users, MessageSquare } from 'lucide-react';

export default function App() {
  const [moveState, setMoveState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const [activeTier, setActiveTier] = useState<Tier | null>(null);
  const [activeRoadmapTier, setActiveRoadmapTier] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [factData, setFactData] = useState<{ title: string; content: string; type: 'mentor' | 'kiosk' } | null>(null);
  const [nickname, setNickname] = useState("Guest");
  const [careerFocus, setCareerFocus] = useState("");
  const [myColor] = useState(() => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
  const [visitedTiers, setVisitedTiers] = useState<Set<string>>(new Set());
  const [celebratingTier, setCelebratingTier] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [mentors, setMentors] = useState<MentorProfile[]>([
    {
      id: 'mentor-1',
      name: 'Dr. Percy Julian',
      title: 'Pioneered the chemical synthesis of medicinal drugs',
      linkedin: 'https://linkedin.com/in/percy-julian',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Percy&skinColor=614335'
    },
    {
      id: 'mentor-2',
      name: 'Dr. Marie Daly',
      title: 'First African American woman to earn a Ph.D. in chemistry in the US',
      linkedin: 'https://linkedin.com/in/marie-daly',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie&skinColor=614335'
    }
  ]);
  const [showMentorOnboarding, setShowMentorOnboarding] = useState(false);
  const [showMenteeOnboarding, setShowMenteeOnboarding] = useState(false);
  
  // Weekly Challenge & Match State
  const [pastConnections, setPastConnections] = useState<any[]>([]);
  const [consecutiveDays, setConsecutiveDays] = useState(() => {
    return parseInt(localStorage.getItem('nobcche_consecutive_days') || '0', 10);
  });

  const handleMove = (dir: string, active: boolean) => {
    setMoveState((prev) => ({ ...prev, [dir]: active }));
  };

  const takeSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `nobcche-snapshot-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAnyOverlayOpen = activeTier || activeRoadmapTier || isJournalOpen || isSpotlightOpen || isAchievementsOpen || isProfileOpen || isDirectoryOpen || factData !== null || isVoiceChatOpen || selectedMentor !== null || showMentorOnboarding || showMenteeOnboarding;

  const earnedCount = getAchievements(consecutiveDays).filter((a) => a.unlocked).length;

  const handleStartExperience = () => {
    setHasStarted(true);
    setShowMentorOnboarding(true); 
  };

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden font-sans text-gray-900">
      <AnimatePresence>
        {!hasStarted && (
          <WelcomeScreen onStart={handleStartExperience} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasStarted && showMentorOnboarding && (
          <MentorOnboarding
            onSkip={() => {
              setShowMentorOnboarding(false);
              setShowMenteeOnboarding(true);
            }}
            onComplete={(m) => {
               setMentors(prev => [...prev, { ...m, id: `mentor-${Date.now()}` }]);
               setNickname(m.name);
               setCareerFocus(m.title);
               setAvatarUrl(m.avatarUrl); // Set their uploaded pic as their avatar
               setShowMentorOnboarding(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasStarted && showMenteeOnboarding && (
          <MenteeOnboarding
            onComplete={(m) => {
               setNickname(m.name);
               setCareerFocus(m.focus);
               setShowMenteeOnboarding(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasStarted && !showMentorOnboarding && !showMenteeOnboarding && !avatarUrl && (
          <AvatarSelection onSelect={(url) => {
            setAvatarUrl(url);
            if (!localStorage.getItem('nobcche_tour_seen')) {
              setTimeout(() => setShowTour(true), 1500);
            }
          }} />
        )}
      </AnimatePresence>

      {hasStarted && !showMentorOnboarding && !showMenteeOnboarding && avatarUrl && (
        <Scene 
          moveState={moveState} 
          avatarUrl={avatarUrl}
          earnedCount={earnedCount}
          activeRoadmapTier={activeRoadmapTier}
          careerFocus={careerFocus}
          nickname={nickname}
          myColor={myColor}
          mentors={mentors}
          onCloseRoadmap={() => setActiveRoadmapTier(null)}
          onEnterTier={(tier) => {
            setActiveTier(tier as Tier);
            if (!visitedTiers.has(tier)) {
              setVisitedTiers(prev => new Set(prev).add(tier));
              setCelebratingTier(tier);
            }
          }} 
          onInteract={(title, content, type) => setFactData({ title, content, type })}
          onMentorClick={(m) => {
            document.exitPointerLock?.();
            setSelectedMentor(m);
          }}
        />
      )}
      {!isAnyOverlayOpen && avatarUrl && <VirtualJoysticks setMove={handleMove} />}

      {/* Selected Mentor Overlay */}
      <AnimatePresence>
        {selectedMentor && (
          <MentorProfileOverlay 
            profile={selectedMentor} 
            onClose={() => setSelectedMentor(null)} 
          />
        )}
      </AnimatePresence>
      
      {/* Tiers overlay */}
      <AnimatePresence>
        {activeTier && (
          <UIOverlay 
            tier={activeTier} 
            onClose={() => setActiveTier(null)} 
          />
        )}
      </AnimatePresence>

      {/* Journal overlay */}
      <AnimatePresence>
        {isJournalOpen && (
          <MentorshipJournalOverlay onClose={() => setIsJournalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Spotlight overlay */}
      <AnimatePresence>
        {isSpotlightOpen && (
           <MentorSpotlightOverlay onClose={() => setIsSpotlightOpen(false)} />
        )}
      </AnimatePresence>

      {/* Achievements overlay */}
      <AnimatePresence>
        {isAchievementsOpen && (
           <AchievementsOverlay consecutiveDays={consecutiveDays} onClose={() => setIsAchievementsOpen(false)} />
        )}
      </AnimatePresence>

      {/* Fact overlay */}
      <AnimatePresence>
        {factData && (
           <FactOverlay 
             title={factData.title} 
             content={factData.content} 
             type={factData.type} 
             onClose={() => setFactData(null)} 
           />
        )}
      </AnimatePresence>

      {/* Mentor Directory overlay */}
      <AnimatePresence>
        {isDirectoryOpen && (
           <MentorDirectoryOverlay 
             mentors={mentors}
             onSelectMentor={(m) => {
               setIsDirectoryOpen(false);
               setSelectedMentor(m);
             }}
             onClose={() => setIsDirectoryOpen(false)} 
           />
        )}
      </AnimatePresence>

      {/* Profile overlay */}
      <AnimatePresence>
        {isProfileOpen && (
           <ProfileOverlay 
             initialNickname={nickname}
             initialFocus={careerFocus}
             onSave={(n, f) => { setNickname(n); setCareerFocus(f); }}
             onClose={() => setIsProfileOpen(false)} 
           />
        )}
      </AnimatePresence>

      {/* Tour tooltip */}
      <AnimatePresence>
        {showTour && avatarUrl && !isAnyOverlayOpen && (
          <TourTooltip onClose={() => {
            setShowTour(false);
            localStorage.setItem('nobcche_tour_seen', 'true');
          }} />
        )}
      </AnimatePresence>

      {/* Voice Chat overlay */}
      <AnimatePresence>
        {isVoiceChatOpen && (
          <VoiceChatWidget onClose={() => setIsVoiceChatOpen(false)} />
        )}
      </AnimatePresence>

      {/* Tier Celebration setup */}
      <AnimatePresence>
        {celebratingTier && (
           <TierCelebrationOverlay 
             tier={celebratingTier} 
             onComplete={() => setCelebratingTier(null)} 
           />
        )}
      </AnimatePresence>
      
      {/* Brand logo & HUD */}
      <div className="absolute top-6 left-6 z-40 pointer-events-none flex flex-col gap-3">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between pointer-events-auto cursor-pointer" onClick={() => setIsProfileOpen(true)}>
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-blue-800">NOBCChE</span>
              <span className="text-gray-400 mx-2">|</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 leading-tight">{nickname}</span>
                {careerFocus && <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider leading-tight">{careerFocus}</span>}
                {!careerFocus && <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-tight">Edit Profile</span>}
              </div>
            </div>
        </div>

        {/* Mobile icons placed directly under logo */}
        {avatarUrl && !isAnyOverlayOpen && (
          <div className="lg:hidden flex flex-wrap gap-2 pointer-events-none w-full max-w-[280px]">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={takeSnapshot}
              className="bg-purple-600/50 hover:bg-purple-600/80 backdrop-blur text-white p-3 rounded-xl shadow-lg border border-white/20 transition-all pointer-events-auto"
            >
              <Camera size={20} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAchievementsOpen(true)}
              className="bg-pink-600/50 hover:bg-pink-600/80 backdrop-blur text-white p-3 rounded-xl shadow-lg border border-white/20 transition-all pointer-events-auto"
            >
              <Award size={20} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSpotlightOpen(true)}
              className="bg-yellow-600/50 hover:bg-yellow-600/80 backdrop-blur text-white p-3 rounded-xl shadow-lg border border-white/20 transition-all pointer-events-auto"
            >
              <Star size={20} className="fill-white" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDirectoryOpen(true)}
              className="bg-blue-600/50 hover:bg-blue-600/80 backdrop-blur text-white p-3 rounded-xl shadow-lg border border-white/20 transition-all pointer-events-auto"
            >
              <Users size={20} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsJournalOpen(true);
                const newCount = consecutiveDays < 5 ? consecutiveDays + 1 : 5;
                setConsecutiveDays(newCount);
                localStorage.setItem('nobcche_consecutive_days', newCount.toString());
              }}
              className="bg-black/50 hover:bg-black/70 backdrop-blur text-white p-3 rounded-xl shadow-lg border border-white/20 transition-all pointer-events-auto"
            >
              <BookOpen size={20} />
            </motion.button>
          </div>
        )}
      </div>

      {avatarUrl && !isAnyOverlayOpen && (
        <div className="absolute top-6 right-6 z-40 hidden lg:flex flex-row flex-wrap justify-end gap-3 pointer-events-none w-max">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={takeSnapshot}
            className="bg-purple-600/50 hover:bg-purple-600/80 backdrop-blur text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 transition-all flex items-center gap-2 pointer-events-auto"
          >
            <Camera size={20} />
            <span className="font-semibold hidden lg:inline">Snapshot</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAchievementsOpen(true)}
            className="bg-pink-600/50 hover:bg-pink-600/80 backdrop-blur text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 transition-all flex items-center gap-2 pointer-events-auto"
          >
            <Award size={20} />
            <span className="font-semibold hidden lg:inline">Badges</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSpotlightOpen(true)}
            className="bg-yellow-600/50 hover:bg-yellow-600/80 backdrop-blur text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 transition-all flex items-center gap-2 pointer-events-auto"
          >
            <Star size={20} className="fill-white" />
            <span className="font-semibold hidden lg:inline">Spotlight</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDirectoryOpen(true)}
            className="bg-blue-600/50 hover:bg-blue-600/80 backdrop-blur text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 transition-all flex items-center gap-2 pointer-events-auto"
          >
            <Users size={20} />
            <span className="font-semibold hidden lg:inline">Directory</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsJournalOpen(true);
              const newCount = consecutiveDays < 5 ? consecutiveDays + 1 : 5;
              setConsecutiveDays(newCount);
              localStorage.setItem('nobcche_consecutive_days', newCount.toString());
            }}
            className="bg-black/50 hover:bg-black/70 backdrop-blur text-white px-4 py-3 rounded-xl shadow-lg border border-white/20 transition-all flex items-center gap-2 pointer-events-auto"
          >
            <BookOpen size={20} />
            <span className="font-semibold hidden lg:inline">Journal</span>
          </motion.button>
        </div>
      )}

      {/* Instructions */}
      {!isAnyOverlayOpen && avatarUrl && (
        <div className="absolute bottom-6 right-20 pointer-events-none text-white/50 text-sm flex flex-col items-end gap-1">
          <div><kbd className="bg-white/20 px-2 py-0.5 rounded">W A S D</kbd> or Joystick to Move</div>
          <div>Click inside the world to aim. <kbd className="bg-white/20 px-2 py-0.5 rounded">ESC</kbd> to unlock mouse.</div>
        </div>
      )}

      {/* Voice Chat Toggle */}
      {avatarUrl && !isAnyOverlayOpen && (
        <div className="absolute bottom-6 right-6 z-40 pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVoiceChatOpen(true)}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-400/50 hover:bg-blue-500 transition-colors"
          >
            <MessageSquare size={24} className="text-white" />
          </motion.button>
        </div>
      )}
      
      {/* Daily Inspiration Widget */}
      {avatarUrl && !isAnyOverlayOpen && <DailyInspirationWidget />}
    </div>
  );
}
