import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCircle, Briefcase } from "lucide-react";

export function ProfileOverlay({ 
  initialNickname, 
  initialFocus, 
  onSave, 
  onClose 
}: { 
  initialNickname: string;
  initialFocus: string;
  onSave: (nickname: string, focus: string) => void;
  onClose: () => void; 
}) {
  const [nickname, setNickname] = useState(initialNickname);
  const [focus, setFocus] = useState(initialFocus);
  
  // Mentor fields
  const [isMentor, setIsMentor] = useState(false);
  const [mentorRole, setMentorRole] = useState("");
  const [mentorCompany, setMentorCompany] = useState("");
  const [mentorLinkedIn, setMentorLinkedIn] = useState("");
  const [showLinkedIn, setShowLinkedIn] = useState(true);

  useEffect(() => {
    const savedMentor = localStorage.getItem("nobcche_custom_mentor");
    if (savedMentor) {
      try {
        const parsed = JSON.parse(savedMentor);
        setIsMentor(true);
        setMentorRole(parsed.role || "");
        setMentorCompany(parsed.company || "");
        setMentorLinkedIn(parsed.linkedin || "");
        setShowLinkedIn(parsed.showLinkedin ?? true);
      } catch (e) {}
    }
  }, []);

  const focusOptions = [
    "Biochemistry",
    "Chemical Engineering",
    "Analytical Chemistry",
    "Materials Science",
    "Organic Chemistry",
    "Physical Chemistry",
    "Environmental Science",
    "Pharmacology",
    "Undecided"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 pointer-events-auto bg-black/60 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg overflow-hidden shadow-2xl flex flex-col bg-gray-900 rounded-3xl border border-gray-700 my-auto mt-10 mb-10 sm:my-auto"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <UserCircle className="text-blue-400" size={28} />
            <h2 className="text-xl font-bold text-white tracking-tight">User Profile</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2">Nickname</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-400 text-sm font-bold mb-2">Primary Career Focus</label>
            <select 
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              <option value="" disabled>Select your focus...</option>
              {focusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 mt-7 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Mentor Details Section */}
          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 transition-colors">
               <input 
                 type="checkbox" 
                 checked={isMentor}
                 onChange={(e) => setIsMentor(e.target.checked)}
                 className="w-5 h-5 rounded border-gray-600 bg-gray-800 focus:ring-blue-500/50 focus:ring-offset-gray-900"
               />
               <span className="text-white font-bold flex items-center gap-2"><Briefcase size={18} className="text-blue-400"/> Register as a Mentor</span>
            </label>

            <AnimatePresence>
              {isMentor && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4 p-5 rounded-xl border border-blue-500/20 bg-blue-900/10">
                    <div>
                      <label className="block text-gray-400 text-xs font-bold mb-1">Role / Title</label>
                      <input 
                        type="text" 
                        value={mentorRole}
                        onChange={(e) => setMentorRole(e.target.value)}
                        placeholder="e.g. Research Scientist"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-bold mb-1">Company / Institution</label>
                      <input 
                        type="text" 
                        value={mentorCompany}
                        onChange={(e) => setMentorCompany(e.target.value)}
                        placeholder="e.g. NextGen Labs"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-bold mb-1">LinkedIn URL</label>
                      <input 
                        type="url" 
                        value={mentorLinkedIn}
                        onChange={(e) => setMentorLinkedIn(e.target.value)}
                        placeholder="https://linkedin.com/..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                       <input 
                         type="checkbox" 
                         checked={showLinkedIn}
                         onChange={(e) => setShowLinkedIn(e.target.checked)}
                         className="w-4 h-4 rounded border-gray-600 bg-gray-800"
                       />
                       <span className="text-gray-300 text-sm">Show LinkedIn on my profile</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => {
              onSave(nickname, focus);
              if (isMentor && focus) {
                localStorage.setItem("nobcche_custom_mentor", JSON.stringify({
                  id: "custom-" + Date.now(),
                  name: nickname,
                  role: mentorRole,
                  company: mentorCompany,
                  linkedin: mentorLinkedIn,
                  showLinkedin: showLinkedIn,
                  focus: focus,
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}&backgroundColor=d1d4f9`
                }));
              } else if (!isMentor) {
                localStorage.removeItem("nobcche_custom_mentor");
              }
              onClose();
            }}
            disabled={!nickname.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold rounded-xl transition-colors shadow-lg"
          >
            Save Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
