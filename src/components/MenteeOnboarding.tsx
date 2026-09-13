import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { googleSignIn } from '../lib/auth';
import { saveUserDataToSheet } from '../lib/sheets';

export function MenteeOnboarding({ 
  onComplete,
}: { 
  onComplete: (data: { name: string, focus: string }) => void,
}) {
  const [name, setName] = useState('');
  const [focus, setFocus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSkip = () => {
    // Default values if skipped
    onComplete({ name: name || 'Guest', focus: focus || 'Explorer' });
  };

  const handleSave = async () => {
    if (!name || !focus) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      const confirm = window.confirm("To save your information to Google Sheets, you need to sign in with Google. Do you want to proceed?");
      if (!confirm) {
        setIsSaving(false);
        return;
      }
      
      await googleSignIn();
      await saveUserDataToSheet('Mentee', { name, title: focus });
      onComplete({ name, focus });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl relative"
      >
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-sm"
        >
          Skip (Don't Save)
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Mentee Profile Setup</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Provide some basic information to get started. Your data will be saved to your Google Sheets for future assistance.
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Area of Interest / Focus</label>
            <input 
              type="text"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Organic Chemistry, Software Engineering"
            />
          </div>

          <button
            disabled={!name || !focus || isSaving}
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 font-bold py-3 rounded-xl transition-colors mt-2"
          >
            {isSaving ? "Connecting to Google..." : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                Sign in & Continue
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
