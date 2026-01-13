import React from 'react';
import Image from 'next/image';

/**
 * Client-Facing Dynamic Portfolio (The Chameleon Result)
 * This page is statically generated or SSR based on a specific "Pitch ID"
 */
export default async function ClientViewerPage({ params }: { params: { slug: string } }) {
  // Logic here would fetch specific assets matched by the AI for this client
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-purple-500/30">
      <nav className="p-8 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter">OVERLORD <span className="text-purple-500">//</span> ARTIST_NAME</div>
        <div className="px-4 py-1 border border-zinc-800 rounded-full text-xs text-zinc-400">
          Curated for: {params.slug.toUpperCase()}
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 tracking-tight">Project Proposal Portfolio</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          Based on your brief regarding "Cyberpunk Character Design", I have selected these works from my archive that demonstrate the specific aesthetic and technical skill required for your project.
        </p>
      </section>

      <section className="columns-1 md:columns-2 lg:columns-3 gap-4 p-8">
        {/* Waterfall gallery layout for the client */}
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="mb-4 relative group cursor-pointer break-inside-avoid">
            <img 
              src={`https://picsum.photos/seed/${i + 20}/800/${i % 2 === 0 ? '1200' : '800'}`} 
              alt="Matched Asset"
              className="rounded-lg grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        ))}
      </section>

      <footer className="py-20 text-center border-t border-zinc-900">
        <button className="bg-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform">
          Start Project Discussion
        </button>
      </footer>
    </div>
  );
}