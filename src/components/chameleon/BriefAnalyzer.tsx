'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';

export const BriefAnalyzer = () => {
  const [brief, setBrief] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerate = async () => {
    setIsAnalyzing(true);
    // Simulate Chameleon Matching Logic
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 border border-purple-500/30 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-purple-400 w-5 h-5" />
        <h2 className="text-lg font-semibold text-white">The Chameleon: Brief Analyzer</h2>
      </div>
      
      <p className="text-zinc-400 text-sm mb-4">
        Paste a job description, client email, or creative brief. Our AI will automatically select and layout the most relevant pieces from your Vault.
      </p>

      <div className="relative">
        <textarea
          className="w-full h-32 bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 text-zinc-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g. Looking for a concept artist for a dark cyberpunk RPG. Need character designs with high-tech details and moody lighting..."
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
        
        <button
          onClick={handleGenerate}
          disabled={!brief || isAnalyzing}
          className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all font-medium text-sm shadow-lg shadow-purple-900/20"
        >
          {isAnalyzing ? (
            <>Analyzing <Wand2 className="w-4 h-4 animate-bounce" /></>
          ) : (
            <>Generate Portfolio <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
};