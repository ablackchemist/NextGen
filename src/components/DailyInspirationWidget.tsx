import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Quote, Target } from "lucide-react";

const goals = [
  "Reach out to an old mentor for a 15 min chat.",
  "Optimize your LinkedIn headline.",
  "Review and document an accomplishment from this past week.",
  "Join a STEM-focused online community.",
  "Set a schedule for continuous learning.",
  "Complete one coding or technical challenge today."
];

const quotes = [
  {
    text: "Never be limited by other people's limited imaginations.",
    author: "Dr. Mae Jemison",
    role: "Engineer, Physician & Astronaut"
  },
  {
    text: "Don't just sit and wait for the opportunities to come, you have to get up and make them.",
    author: "Madam C.J. Walker",
    role: "Entrepreneur & Philanthropist"
  },
  {
    text: "I have had one goal in my life, that of playing some role in making life a little easier for the persons who come after me.",
    author: "Dr. Percy Julian",
    role: "Pioneering Chemist"
  },
  {
    text: "I work until I'm exhausted, but the results are worth it.",
    author: "Alice Ball",
    role: "Chemist, developed leprosy treatment"
  },
  {
    text: "Courage is like — it's a habitus, a habit, a virtue: you get it by courageous acts.",
    author: "Dr. Marie Maynard Daly",
    role: "Biochemist"
  },
  {
    text: "We must build a legacy of research and education for the generations to follow.",
    author: "Dr. St. Elmo Brady",
    role: "Chemist & Educator"
  },
  {
    text: "Science is not a boy's game, it's not a girl's game. It's everyone's game.",
    author: "Nichelle Nichols",
    role: "NASA Ambassador & Actress"
  },
  {
    text: "You can't be what you can't see.",
    author: "Marian Wright Edelman",
    role: "Activist for Children's Rights"
  }
];

export function DailyInspirationWidget() {
  const [quote, setQuote] = useState(quotes[0]);
  const [goal, setGoal] = useState(goals[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pick a random quote and goal
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomGoal = goals[Math.floor(Math.random() * goals.length)];
    setQuote(randomQuote);
    setGoal(randomGoal);
    
    // Show after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // 2 seconds after mount

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="fixed bottom-6 left-6 z-40 w-80 sm:w-96 bg-gray-900/80 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-3 text-yellow-400">
            <Lightbulb size={20} className="fill-yellow-400/50" />
            <span className="text-sm font-bold tracking-wider uppercase">Daily Inspiration</span>
          </div>
          
          <div className="relative mb-4">
            <Quote size={24} className="text-white/10 absolute -top-1 -left-2 rotate-180" />
            <p className="text-white font-medium italic relative z-10 pl-6 pr-2 text-sm leading-relaxed text-pretty">
              "{quote.text}"
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col gap-1">
            <div className="flex items-center gap-1 text-emerald-400">
              <Target size={14} className="fill-emerald-400/20" />
              <span className="text-xs font-bold uppercase tracking-wider">Daily Goal</span>
            </div>
            <p className="text-gray-300 text-xs">{goal}</p>
          </div>
          
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold">{quote.author}</span>
              <span className="text-gray-400 text-xs">{quote.role}</span>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
