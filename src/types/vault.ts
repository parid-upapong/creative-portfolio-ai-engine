export type AssetStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface AssetAnalysis {
  primaryStyle: string;
  medium: string;
  moodTags: string[];
  colorPalette: { hex: string; weight: number }[];
  compositionScore: number;
}

export interface Asset {
  id: string;
  title: string;
  thumbnailUrl: string;
  status: AssetStatus;
  analysis?: AssetAnalysis;
  createdAt: string;
}

export interface ClientBrief {
  id: string;
  clientName: string;
  description: string;
  matchedAssets: string[]; // Asset IDs
}