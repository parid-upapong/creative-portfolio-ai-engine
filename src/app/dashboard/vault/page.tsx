import { AssetCard } from '@/components/vault/AssetCard';
import { BriefAnalyzer } from '@/components/chameleon/BriefAnalyzer';

// This would typically come from a Server Action or API
const mockAssets = [
  {
    id: '1',
    title: 'Neon District 2049',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=500',
    status: 'READY',
    analysis: {
      primaryStyle: 'Cyberpunk',
      moodTags: ['Neon', 'Gritty', 'Futuristic'],
      medium: 'Digital 2D',
      compositionScore: 0.92,
      colorPalette: []
    }
  },
  {
    id: '2',
    title: 'Character Concept A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=500',
    status: 'PROCESSING',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Organic Wasteland',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500',
    status: 'READY',
    analysis: {
      primaryStyle: 'Surrealism',
      moodTags: ['Dreamy', 'Soft', 'Nature'],
      medium: '3D Render',
      compositionScore: 0.85,
      colorPalette: []
    }
  }
];

export default function VaultPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">The Vault</h1>
            <p className="text-zinc-500">Your AI-managed creative intelligence hub.</p>
          </div>
          <button className="bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-zinc-200 transition-colors">
            Upload New Work
          </button>
        </header>

        {/* Dynamic Portfolio Generator (The Chameleon) */}
        <BriefAnalyzer />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset as any} />
          ))}
        </div>
      </div>
    </main>
  );
}