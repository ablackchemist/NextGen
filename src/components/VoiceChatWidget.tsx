import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, MessageSquare, X, Send } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function VoiceChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your AI Mentor. How can I assist you with your career and studies today?" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setInputText(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('en')) || null;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputText('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async (textToSend: string = inputText) => {
    if (!textToSend.trim()) return;
    
    setInputText("");
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const newMessages = [...messages, { role: 'user', text: textToSend } as Message];
    setMessages(newMessages);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      if (data.text) {
        setMessages([...newMessages, { role: 'model', text: data.text }]);
        speak(data.text);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'model', text: "Sorry, I had trouble connecting." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute bottom-24 right-6 w-80 sm:w-96 max-h-[500px] flex flex-col bg-gray-900 border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 pointer-events-auto"
    >
      <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/20 px-4 py-3 flex items-center justify-between border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-400" />
          <span className="font-bold text-white tracking-wider">AI Mentor</span>
        </div>
        <button onClick={() => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          onClose();
        }} className="text-gray-400 hover:text-white p-1">
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto min-h-[300px] flex flex-col gap-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 border border-gray-700 justify-start rounded-bl-none'
            }`}>
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 rounded-2xl rounded-bl-none px-4 py-2 border border-gray-700 text-sm flex gap-1">
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type or use voice..."
          className="flex-1 bg-gray-800 text-sm text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={toggleListening}
          className={`p-2 rounded-full transition-colors ${
            isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button
          onClick={() => handleSend()}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors"
        >
          <Send size={20} className="-ml-0.5 mt-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
