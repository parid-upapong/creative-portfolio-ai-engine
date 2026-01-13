import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Globe } from 'lucide-react';

export const ChameleonGenerator = () => {
  const [brief, setBrief] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ url: string; matchCount: number } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulated API Call
    setTimeout(() => {
      setResult({
        url: "https://overlord.art/p/cyberpunk-pitch-2024",
        matchCount: 12
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-purple-400 w-5 h-5" />
        <h2 className="text-xl font-bold text-white">Chameleon AI Portfolio</h2>
      </div>

      <textarea
        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-zinc-300 focus:ring-2 focus:ring-purple-500 outline-none transition-all h-32"
        placeholder="Paste client brief, job description, or a link to their brand guidelines..."
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !brief}
        className="mt-4 w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        {isGenerating ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ) : (
          <><Send className="w-4 h-4" /> Generate Custom Portfolio</>
        )}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg"
          >
            <p className="text-green-400 text-sm mb-2 font-medium">
              ✨ Success! Found {result.matchCount} assets matching the brief.
            </p>
            <div className="flex items-center gap-2">
              <input 
                readOnly 
                value={result.url} 
                className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs p-2 rounded"
              />
              <button className="bg-zinc-800 p-2 rounded hover:bg-zinc-700 text-white transition-colors">
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};