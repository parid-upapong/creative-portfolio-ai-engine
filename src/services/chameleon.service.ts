import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const ML_ENGINE_URL = process.env.ML_ENGINE_URL;

export class ChameleonService {
  /**
   * Generates a curated portfolio by matching a client brief to the artist's vault.
   */
  static async generateSmartPortfolio(userId: string, briefText: string) {
    // 1. Get Text Embedding from ML Engine
    const { data: { embedding } } = await axios.post(`${ML_ENGINE_URL}/embed-text`, {
      text: briefText
    });

    // 2. Vector Search using pgvector via Prisma Raw Query
    // The <=> operator denotes cosine distance
    const matchedAssets: any[] = await prisma.$queryRaw`
      SELECT 
        a.id, 
        a.title, 
        a."thumbnailUrl",
        aa.primary_style,
        1 - (a.embedding <=> ${embedding}::vector) as similarity
      FROM "Asset" a
      JOIN asset_analysis aa ON a.id = aa.asset_id
      WHERE a."userId" = ${userId}
      AND a.status = 'READY'
      ORDER BY similarity DESC
      LIMIT 15;
    `;

    // 3. Create a public portfolio record
    const portfolio = await prisma.portfolio.create({
      data: {
        userId,
        slug: `pitch-${Date.now()}`,
        assets: {
          connect: matchedAssets.map(asset => ({ id: asset.id }))
        },
        metadata: {
          generatedFrom: briefText,
          matchScore: matchedAssets[0]?.similarity || 0
        }
      }
    });

    return {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/p/${portfolio.slug}`,
      assets: matchedAssets
    };
  }
}