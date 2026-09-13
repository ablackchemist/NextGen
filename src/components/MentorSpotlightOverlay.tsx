import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ChevronLeft, ChevronRight, GraduationCap, Briefcase, Mail, Linkedin } from "lucide-react";

type Mentor = {
  id: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  skills: string[];
  color: string;
  avatar?: string;
  linkedin?: string;
};

const mentors: Mentor[] = [
  {
    id: "m1",
    name: "Dr. Percy Julian",
    role: "Research Chemist & Pioneer",
    bio: "Pioneered the chemical synthesis of medicinal drugs from plants, such as physostigmine and cortisone. His work laid the foundation for the steroid drug industry.",
    quote: "I have had one goal in my life, that of playing some role in making life a little easier for the persons who come after me.",
    skills: ["Organic Synthesis", "Phytochemistry", "Industrial Chemistry"],
    color: "from-blue-600/40 to-blue-900/40"
  },
  {
    id: "m2",
    name: "Dr. Marie Maynard Daly",
    role: "Biochemist",
    bio: "The first African American woman in the United States to earn a Ph.D. in chemistry (awarded by Columbia University in 1947). She conducted pioneering research on the relationship between high cholesterol and heart attacks.",
    quote: "Courage is like — it's a habitus, a habit, a virtue: you get it by courageous acts.",
    skills: ["Biochemistry", "Cardiovascular Research", "Protein Synthesis"],
    color: "from-purple-600/40 to-purple-900/40"
  },
  {
    id: "m3",
    name: "Dr. St. Elmo Brady",
    role: "Chemist & Educator",
    bio: "The first African American to obtain a Ph.D. in chemistry in the United States. He built strong undergraduate chemistry curricula at four historically black colleges and universities.",
    quote: "We must build a legacy of research and education for the generations to follow.",
    skills: ["Organic Chemistry", "Curriculum Development", "Academic Leadership"],
    color: "from-emerald-600/40 to-emerald-900/40"
  },
  {
    id: "m4",
    name: "Alice Ball",
    role: "Chemist",
    bio: "Developed the \"Ball Method,\" the most effective treatment for leprosy during the early 20th century. She was the first woman and first African American to receive a master's degree from the University of Hawaii.",
    quote: "I work until I'm exhausted, but the results are worth it.",
    skills: ["Pharmacognosy", "Chemical Extraction", "Medical Research"],
    color: "from-amber-600/40 to-amber-900/40"
  },
  {
    id: "m5",
    name: "Dr. Mae Jemison",
    role: "Engineer, Physician & Astronaut",
    bio: "The first African American woman to travel in space when she went into orbit aboard the Space Shuttle Endeavour in 1992. She holds a B.S. in chemical engineering from Stanford University.",
    quote: "Never be limited by other people's limited imaginations.",
    skills: ["Chemical Engineering", "Aerospace Engineering", "Medicine"],
    color: "from-pink-600/40 to-pink-900/40"
  }
];

export function MentorSpotlightOverlay({ onClose }: { onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [allMentors, setAllMentors] = useState(mentors);
  
  useEffect(() => {
    try {
      const savedMentor = localStorage.getItem("nobcche_custom_mentor");
      if (savedMentor) {
        const parsed = JSON.parse(savedMentor);
        if (parsed.name) {
          setAllMentors(prev => [...prev, {
            id: parsed.id,
            name: parsed.name,
            role: parsed.role,
            bio: parsed.company ? `Working at ${parsed.company}.` : "Community Mentor",
            color: "from-blue-500 to-cyan-500",
            avatar: parsed.avatar,
            linkedin: parsed.showLinkedin ? parsed.linkedin : undefined,
            quote: "Sharing knowledge to empower the NextGen.",
            skills: []
          }]);
        }
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    setIsOnline(Math.random() > 0.5);
  }, [currentIndex]);

  const nextMentor = () => {
    setCurrentIndex((prev) => (prev + 1) % allMentors.length);
  };

  const prevMentor = () => {
    setCurrentIndex((prev) => (prev - 1 + allMentors.length) % allMentors.length);
  };

  const mentor = allMentors[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 pointer-events-auto bg-black/80 backdrop-blur-md"
    >
      <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-gray-900 border border-gray-700 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40 z-10">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
            <h2 className="text-2xl font-bold text-white tracking-tight">Mentor Spotlight</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 p-8 sm:p-12 overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={mentor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 bg-gradient-to-br ${mentor.color} opacity-20`}
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div 
              key={mentor.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="z-10 w-full flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center mb-6 shadow-xl backdrop-blur-sm relative">
                {mentor.avatar ? (
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <GraduationCap size={40} className="text-white/80" />
                )}
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-[3px] border-gray-900 shadow-[0_0_10px_rgba(34,197,94,0.8)] z-10" />
                )}
              </div>
              
              <h3 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-3">
                {mentor.name}
                {mentor.linkedin && (
                  <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                    <Linkedin size={28} />
                  </a>
                )}
              </h3>
              <div className="flex items-center gap-2 text-blue-300 font-medium mb-8 bg-blue-900/40 px-4 py-1.5 rounded-full border border-blue-500/30">
                <Briefcase size={16} />
                {mentor.role}
              </div>

              <blockquote className="text-xl sm:text-2xl font-serif italic text-gray-200 mb-8 max-w-2xl leading-relaxed">
                "{mentor.quote}"
              </blockquote>

              <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-2xl leading-relaxed">
                {mentor.bio}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {mentor.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => {
                  const entry = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    content: `Interest Log: Initiated chat with Spotlight Mentor ${mentor.name} (${mentor.role}).`
                  };
                  const saved = localStorage.getItem("nobcche_mentorship_journal");
                  const entries = saved ? JSON.parse(saved) : [];
                  localStorage.setItem("nobcche_mentorship_journal", JSON.stringify([entry, ...entries]));
                  alert(`Message initiated! Log saved to your journal.`);
                }}
                className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Direct Message
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <button 
            onClick={prevMentor}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-white transition-all hover:scale-110 z-20"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button 
            onClick={nextMentor}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-white transition-all hover:scale-110 z-20"
          >
            <ChevronRight size={32} />
          </button>
          
        </div>
        
        {/* Indicators */}
        <div className="bg-black/60 p-4 border-t border-white/10 flex justify-center gap-2 z-10">
          {mentors.map((m, idx) => (
            <div 
              key={m.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
