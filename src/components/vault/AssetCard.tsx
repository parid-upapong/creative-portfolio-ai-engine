'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Asset } from '@/types/vault';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors"
    >
      <div className="aspect-square relative overflow-hidden bg-zinc-950">
        {asset.status === 'READY' ? (
          <Image 
            src={asset.thumbnailUrl} 
            alt={asset.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest">AI Analyzing...</span>
          </div>
        )}
        
        {/* Hover Overlay with AI Metadata */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <p className="text-sm font-medium text-white mb-1">{asset.title}</p>
          {asset.analysis && (
            <div className="flex flex-wrap gap-1">
              {asset.analysis.moodTags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 flex justify-between items-center border-t border-zinc-800">
        <span className="text-xs text-zinc-500">{asset.analysis?.primaryStyle || 'Generic'}</span>
        {asset.status === 'READY' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        {asset.status === 'FAILED' && <AlertCircle className="w-4 h-4 text-red-500" />}
      </div>
    </motion.div>
  );
};