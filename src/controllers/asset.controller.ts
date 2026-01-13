import { Request, Response } from "express";
import { AssetService } from "../services/asset.service";

const assetService = new AssetService();

export const initiateAssetUpload = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // From Auth Middleware
    const { title, fileName, contentType, fileSize } = req.body;

    const result = await assetService.initiateUpload(userId, {
      title,
      fileName,
      contentType,
      fileSize,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to initiate upload" });
  }
};

export const completeAssetUpload = async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    const asset = await assetService.finalizeUpload(assetId);
    res.status(200).json({ message: "Asset queued for AI analysis", asset });
  } catch (error) {
    res.status(500).json({ error: "Failed to finalize upload" });
  }
};

export const getArtistVault = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { style, tag } = req.query;
    const assets = await assetService.getVault(userId, { 
      style: style as string, 
      tag: tag as string 
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vault" });
  }
};