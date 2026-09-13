import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Award, Shield, Zap, BookOpen, User, Star, Clock, CalendarDays, Flame, Target, TrendingUp, Medal, Trophy } from "lucide-react";

export const getAchievements = (consecutiveDays: number = 0) => [
  {
    id: "a1",
    title: "Avatar Claimed",
    description: "Joined the NextGen Studio campus.",
    icon: User,
    color: "text-blue-400",
    bg: "bg-blue-400/20",
    border: "border-blue-500/50",
    unlocked: true,
  },
  {
    id: "a2",
    title: "First Reflection",
    description: "Logged your first journal entry in the Mentorship Journal.",
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-400/20",
    border: "border-emerald-500/50",
    unlocked: consecutiveDays > 0,
  },
  {
    id: "a3",
    title: "STEM Pioneer",
    description: "Completed the Tier 1 High School milestone.",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-400/20",
    border: "border-purple-500/50",
    unlocked: true,
  },
  {
    id: "a4",
    title: "Lab Innovator",
    description: "Completed the Tier 2 Undergraduate milestone.",
    icon: Shield,
    color: "text-amber-400",
    bg: "bg-amber-400/20",
    border: "border-amber-500/50",
    unlocked: false,
  },
  {
    id: "a5",
    title: "Research Fellow",
    description: "Completed the Tier 3 Graduate milestone.",
    icon: Star,
    color: "text-pink-400",
    bg: "bg-pink-400/20",
    border: "border-pink-500/50",
    unlocked: false,
  },
  {
    id: "a6",
    title: "Industry Leader",
    description: "Completed the Tier 4 Professional milestone.",
    icon: Award,
    color: "text-yellow-400",
    bg: "bg-yellow-400/20",
    border: "border-yellow-500/50",
    unlocked: false,
  },
  {
    id: "a7",
    title: "Consistent Contributor",
    description: "Opened the journal for 5 consecutive days.",
    icon: CalendarDays,
    color: "text-cyan-400",
    bg: "bg-cyan-400/20",
    border: "border-cyan-500/50",
    unlocked: consecutiveDays >= 5,
  },
  {
    id: "a8",
    title: "Habit Builder",
    description: "Opened the journal for 10 consecutive days.",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/20",
    border: "border-orange-500/50",
    unlocked: consecutiveDays >= 10,
  },
  {
    id: "a9",
    title: "Dedicated Scholar",
    description: "Opened the journal for 20 consecutive days.",
    icon: Target,
    color: "text-rose-400",
    bg: "bg-rose-400/20",
    border: "border-rose-500/50",
    unlocked: consecutiveDays >= 20,
  },
  {
    id: "a10",
    title: "Monthly Master",
    description: "Opened the journal for 30 consecutive days.",
    icon: TrendingUp,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-400/20",
    border: "border-fuchsia-500/50",
    unlocked: consecutiveDays >= 30,
  },
  {
    id: "a11",
    title: "Relentless Explorer",
    description: "Opened the journal for 60 consecutive days.",
    icon: Medal,
    color: "text-indigo-400",
    bg: "bg-indigo-400/20",
    border: "border-indigo-500/50",
    unlocked: consecutiveDays >= 60,
  },
  {
    id: "a12",
    title: "Unstoppable Force",
    description: "Opened the journal for 90 consecutive days.",
    icon: Trophy,
    color: "text-yellow-300",
    bg: "bg-yellow-300/20",
    border: "border-yellow-400/50",
    unlocked: consecutiveDays >= 90,
  }
];

export function AchievementsOverlay({ consecutiveDays, onClose }: { consecutiveDays: number, onClose: () => void }) {
  const achievements = getAchievements(consecutiveDays);
  const earnedCount = achievements.filter((a) => a.unlocked).length;
  
  // Fake countdown timer for demo
  const [countdown, setCountdown] = useState("03:14:59");
  
  useEffect(() => {
    // Just a visual decrementing timer for effect
    const interval = setInterval(() => {
      setCountdown(prev => {
        let [h, m, s] = prev.split(':').map(Number);
        if(s > 0) s--;
        else {
          s = 59;
          if(m > 0) m--;
          else { m = 59; h > 0 ? h-- : h = 0;}
        }
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 pointer-events-auto bg-black/60 backdrop-blur-md"
    >
      <div className="w-full max-w-4xl h-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-gray-900 border border-gray-700">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <Award className="text-pink-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Achievements</h2>
              <p className="text-gray-400 text-sm font-medium">{earnedCount} of {achievements.length} Badges Earned</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* Weekly Challenge Banner */}
          <div className="mb-8 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/20 p-3 rounded-xl border border-cyan-500/50 text-cyan-400 mt-1 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <CalendarDays size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Weekly Challenge</h3>
                  <p className="text-cyan-100/70 text-sm">Open your journal for 5 consecutive days to earn the <span className="font-bold text-cyan-300">Consistent Contributor</span> badge.</p>
                  <div className="flex gap-2 mt-3">
                     {[1, 2, 3, 4, 5].map(day => (
                        <div key={day} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                          consecutiveDays >= day ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-black/50 border-white/10 text-gray-500'
                        }`}>
                          {day}
                        </div>
                     ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-black/40 px-6 py-3 rounded-xl border border-white/5 md:ml-auto w-full md:w-auto">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Clock size={12} /> Resets In
                </div>
                <div className="text-2xl font-mono font-bold text-white tracking-widest">{countdown}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id}
                  className={`
                    relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center
                    ${achievement.unlocked 
                      ? `bg-gray-800 ${achievement.border} shadow-lg shadow-black/50` 
                      : 'bg-black/40 border-white/5 opacity-60 grayscale'
                    }
                  `}
                >
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2 shadow-inner
                    ${achievement.unlocked ? `${achievement.bg} ${achievement.border} ${achievement.color}` : 'bg-gray-800 border-gray-700 text-gray-500'}
                  `}>
                    <Icon size={36} />
                  </div>
                  
                  <h3 className={`text-lg font-bold mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 pb-4">
                    {achievement.description}
                  </p>

                  <div className={`mt-auto text-xs font-bold tracking-widest px-3 py-1 rounded-full border ${
                     achievement.unlocked 
                       ? `${achievement.color} ${achievement.border} ${achievement.bg}` 
                       : 'text-gray-500 border-gray-700 bg-gray-800'
                  }`}>
                    {achievement.unlocked ? 'UNLOCKED' : 'LOCKED'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
