import { PrismaClient } from "@prisma/client";
import { StorageService } from "./storage.service";
import Queue from "bull";

const prisma = new PrismaClient();
const storage = new StorageService();

// Queue for triggering the AI Vision Pipeline (ML Engine)
const analysisQueue = new Queue("asset-analysis-pipeline", process.env.REDIS_URL!);

export class AssetService {
  async initiateUpload(userId: string, data: { title: string; fileName: string; contentType: string; fileSize: number }) {
    // 1. Get Pre-signed URL from S3
    const { uploadUrl, fileKey, publicUrl } = await storage.getPresignedUploadUrl(userId, data.fileName, data.contentType);

    // 2. Create Asset record in 'UPLOADING' state
    const asset = await prisma.asset.create({
      data: {
        userId,
        title: data.title,
        originalUrl: publicUrl,
        fileSize: data.fileSize,
        mimeType: data.contentType,
        status: "UPLOADING",
      },
    });

    return {
      assetId: asset.id,
      uploadUrl,
    };
  }

  async finalizeUpload(assetId: string) {
    // 1. Update status
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: { status: "PROCESSING" },
    });

    // 2. Trigger AI Pipeline (The Vault Logic)
    // This job is picked up by the ML Engine or a worker that calls the Vision Pipeline
    await analysisQueue.add({
      assetId: asset.id,
      imageUrl: asset.originalUrl,
    }, {
      attempts: 3,
      backoff: 5000,
    });

    return asset;
  }

  async getVault(userId: string, filters: { style?: string; tag?: string }) {
    return prisma.asset.findMany({
      where: {
        userId,
        status: "READY",
        ...(filters.style && {
          analysis: {
            primaryStyle: filters.style,
          },
        }),
      },
      include: {
        analysis: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}