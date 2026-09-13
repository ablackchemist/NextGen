import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, FileText, Trash2, Download } from "lucide-react";
import { jsPDF } from "jspdf";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export function MentorshipJournalOverlay({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nobcche_mentorship_journal");
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse journal entries", e);
      }
    }
  }, []);

  const saveEntry = () => {
    if (!newEntry.trim()) return;
    
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      content: newEntry.trim(),
    };
    
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("nobcche_mentorship_journal", JSON.stringify(updated));
    setNewEntry("");
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("nobcche_mentorship_journal", JSON.stringify(updated));
  };

  const filteredEntries = entries.filter(e => e.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Mentorship & Professional Development Journal", 20, 20);
    
    doc.setFontSize(12);
    let y = 30;
    
    [...entries].reverse().forEach((entry) => {
      const dateStr = new Date(entry.date).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      
      doc.setFont("helvetica", "bold");
      doc.text(dateStr, 20, y);
      y += 6;
      
      doc.setFont("helvetica", "normal");
      
      const splitText = doc.splitTextToSize(entry.content, 170);
      doc.text(splitText, 20, y);
      
      y += (splitText.length * 6) + 10;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    
    doc.save("Mentorship_Journal.pdf");
  };

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
            <FileText className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Mentorship Journal</h2>
          </div>
          <div className="flex gap-4">
            {entries.length > 0 && (
              <button 
                onClick={exportToPDF} 
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-semibold transition-colors border border-gray-600"
              >
                <Download size={16} /> Export PDF
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left: Input */}
          <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 border-r border-white/10">
            <h3 className="text-white font-medium text-lg">New Entry</h3>
            <p className="text-gray-400 text-sm">
              Log your professional development goals, mentor feedback, or daily reflections.
            </p>
            <textarea
              className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
              placeholder="What are your goals for this week?"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
            />
            <button 
              onClick={saveEntry}
              disabled={!newEntry.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-4 rounded-xl font-bold tracking-wide flex justify-center items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Save size={20} />
              Save to Local Record
            </button>
          </div>

          {/* Right: History */}
          <div className="w-full md:w-1/2 bg-black/40 p-6 overflow-y-auto flex flex-col gap-4">
            <div className="sticky top-0 bg-[#0d131f] pb-2 z-10 flex flex-col gap-3">
              <h3 className="text-white font-medium text-lg">Past Entries</h3>
              <input 
                type="text" 
                placeholder="Search entries..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            {filteredEntries.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50 space-y-4 pt-10">
                <FileText size={48} />
                <p>No journal entries found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className="bg-white/5 border border-white/10 rounded-xl p-4 group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-blue-400 tracking-wider">
                        {new Date(entry.date).toLocaleDateString(undefined, {
                          weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap text-sm">{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
