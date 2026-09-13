import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, Link as LinkIcon, User } from 'lucide-react';
import { googleSignIn } from '../lib/auth';
import { saveUserDataToSheet } from '../lib/sheets';

export function MentorOnboarding({ 
  onComplete,
  onSkip
}: { 
  onComplete: (data: { name: string, title: string, linkedin: string, avatarUrl: string }) => void,
  onSkip: () => void
}) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePublish = async () => {
    if (!name || !title || !linkedin || !previewUrl) return;
    
    setIsSaving(true);
    setError('');

    try {
      const confirm = window.confirm("To publish your profile and save your data, you need to sign in with Google. Do you want to proceed?");
      if (!confirm) {
        setIsSaving(false);
        return;
      }
      
      await googleSignIn();
      await saveUserDataToSheet('Mentor', { name, title, linkedin });
      onComplete({ name, title, linkedin, avatarUrl: previewUrl });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during sign in or saving to Sheets");
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
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-sm"
        >
          Skip (Join as Mentee)
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Mentor Profile Setup</h2>
        <p className="text-gray-400 mb-6 text-sm">
          A professional profile picture and credentials are required to be published in the Mentor Directory.
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600 mb-3 flex flex-col items-center justify-center group">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-500" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer">
                <Camera className="text-white mb-1" size={24} />
                <span className="text-xs font-semibold text-white">Upload</span>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {!previewUrl && <span className="text-xs text-red-400 font-medium">Photo required</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dr. Percy Julian"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Professional Title & Credentials</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Research Chemist / Professor"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">LinkedIn URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 text-gray-500" size={20} />
              <input 
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
          
          <button
            disabled={!name || !title || !linkedin || !previewUrl || isSaving}
            onClick={handlePublish}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-colors mt-2"
          >
            {isSaving ? "Connecting to Google..." : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-1" />
                Sign in & Publish Profile
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
