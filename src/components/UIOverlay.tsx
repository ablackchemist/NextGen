import { useState } from "react";
import { Tier, JournalResponse } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Book,
  FileText,
  ChevronRight,
  Loader2,
  Map,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Roadmap3D } from "./Roadmap3D";
import { roadmapDataMock } from "../data";

const tierConfig = {
  "Tier 1": {
    title: "Grade 9-12 | Immersive STEM Fair",
    prompt:
      "What was the most surprising thing you learned in your latest STEM project or class?",
    theme: "from-blue-500/20 to-cyan-500/10",
  },
  "Tier 2": {
    title: "Undergraduate | Maker Space",
    prompt:
      "What was the single biggest technical bottleneck you cleared in your lab project this week, and how did you resolve it?",
    theme: "from-emerald-500/20 to-teal-500/10",
  },
  "Tier 3": {
    title: "Graduate | Campus Innovation Lab",
    prompt:
      "What specific technical hurdle did you clear in your lab work or data analysis this week as you prepare your research?",
    theme: "from-purple-500/20 to-indigo-500/10",
  },
  "Tier 4": {
    title: "Professional | Command Center",
    prompt:
      "Reflecting on your recent sessions, how have you adapted your communication style to better support underrepresented talent?",
    theme: "from-amber-500/20 to-orange-500/10",
  },
};

export function UIOverlay({
  tier,
  onClose,
}: {
  tier: Tier;
  onClose: () => void;
}) {
  const config = tierConfig[tier as keyof typeof tierConfig];
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JournalResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"journal" | "roadmap">("journal");
  const [showFocus, setShowFocus] = useState(true);

  const focusHint = roadmapDataMock[tier as string]?.milestones[0]?.notebooklm_focus || "Focus on detailing specific technical challenges and resolutions.";

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, prompt: config.prompt, input }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Failed to process journal entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-auto bg-black/60 backdrop-blur-md"
    >
      <div
        className={`w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-gray-900 border border-gray-700 bg-gradient-to-br ${config.theme}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm font-semibold tracking-wider">
              NEXTGEN STUDIO VAULT
            </span>
            <h2 className="text-2xl font-bold text-white">{config.title}</h2>
          </div>
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 mx-4">
            <button
              onClick={() => setActiveTab("journal")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "journal"
                  ? "bg-white/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Book size={16} /> Journal
            </button>
            <button
              onClick={() => setActiveTab("roadmap")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "roadmap"
                  ? "bg-emerald-600/50 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Map size={16} /> 3D Roadmap Map
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === "journal" ? (
              <motion.div
                key="journal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex flex-col md:flex-row"
              >
                {/* Left Panel: Reflection Canvas */}
                <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 border-r border-white/10 overflow-y-auto">
                  <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                    <h3 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                      <Book size={16} /> Journal Prompt
                    </h3>
                    <p className="text-white text-lg font-serif">
                      "{config.prompt}"
                    </p>
                  </div>
                  
                  <AnimatePresence>
                    {showFocus && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl relative"
                        >
                          <button 
                            onClick={() => setShowFocus(false)}
                            className="absolute top-2 right-2 p-1 text-emerald-500/70 hover:text-emerald-400 hover:bg-white/10 rounded-full transition-colors"
                          >
                            <X size={14} />
                          </button>
                          <h4 className="text-emerald-400 font-bold mb-1 text-sm tracking-wide">AI KNOWLEDGE FOCUS:</h4>
                          <p className="text-emerald-100/80 text-sm pr-6 leading-relaxed">
                            {focusHint}
                          </p>
                        </motion.div>
                    )}
                  </AnimatePresence>

                  <textarea
                    className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                    placeholder="Start reflecting here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !input.trim()}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold tracking-wide flex items-center gap-3 transition-transform hover:scale-[1.02]"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Send />
                      )}
                      Activate Storage Vault
                    </button>
                  </div>
                </div>

                {/* Right Panel: Vault Output */}
                <div className="w-full md:w-1/2 bg-black/60 p-6 overflow-y-auto flex flex-col gap-6">
                  {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 space-y-4">
                      <FileText size={64} />
                      <p>
                        Submit your reflection to process into NotebookLM and
                        LinkedIn assets.
                      </p>
                    </div>
                  )}

                  {loading && (
                    <div className="h-full flex flex-col items-center justify-center text-blue-400 space-y-4 animate-pulse">
                      <Loader2 size={64} className="animate-spin" />
                      <p>Synthesizing Knowledge Pack & Thought Leadership...</p>
                    </div>
                  )}

                  {result && result.follow_up_question && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-2xl">
                      <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                        Scaffolding Active <ChevronRight size={16} />
                      </h4>
                      <p className="text-white text-lg">
                        {result.follow_up_question}
                      </p>
                      <p className="text-gray-400 text-sm mt-4">
                        Please expand your reflection on the left.
                      </p>
                    </div>
                  )}

                  {result && !result.follow_up_question && (
                    <>
                      {/* NotebookLM Section */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-indigo-400 font-bold tracking-widest text-xs">
                          ASSET 1: NOTEBOOKLM KNOWLEDGE PACK
                        </h4>
                        <div className="bg-white/5 border border-indigo-500/30 p-5 rounded-2xl prose prose-invert max-w-none text-sm markdown-body overflow-x-hidden">
                          <ReactMarkdown>
                            {result.notebooklm_markdown || ""}
                          </ReactMarkdown>
                        </div>
                      </div>

                      {/* LinkedIn Section */}
                      <div className="flex flex-col gap-3 pb-8">
                        <h4 className="text-sky-400 font-bold tracking-widest text-xs">
                          ASSET 2: LINKEDIN DRAFT
                        </h4>
                        <div className="bg-sky-900/20 border border-sky-500/30 p-5 rounded-2xl">
                          <p className="text-white whitespace-pre-wrap">
                            {result.linkedin_draft}
                          </p>
                          <div className="mt-6 flex justify-end">
                            <button className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                              Copy for LinkedIn
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 bg-black/80"
              >
                {roadmapDataMock[tier] && (
                  <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Environment preset="city" />
                    <OrbitControls
                      makeDefault
                      enablePan={true}
                      enableZoom={true}
                    />
                    <Roadmap3D
                      data={roadmapDataMock[tier]}
                      position={[0, 0, 0]}
                      onClose={() => setActiveTab("journal")}
                    />
                  </Canvas>
                )}
                {!roadmapDataMock[tier] && (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>No roadmap data available for this tier.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
