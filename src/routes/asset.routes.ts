import { Router } from "express";
import { 
  initiateAssetUpload, 
  completeAssetUpload, 
  getArtistVault 
} from "../controllers/asset.controller";
import { authenticate } from "../middleware/auth"; // Standard JWT Auth

const router = Router();

/**
 * @route POST /api/v1/assets/upload/init
 * @desc Get presigned URL for the Vault
 */
router.post("/upload/init", authenticate, initiateAssetUpload);

/**
 * @route POST /api/v1/assets/:assetId/finalize
 * @desc Notify system that S3 upload is done; trigger AI tagging
 */
router.post("/:assetId/finalize", authenticate, completeAssetUpload);

/**
 * @route GET /api/v1/assets/vault
 * @desc Fetch analyzed assets with filter options
 */
router.get("/vault", authenticate, getArtistVault);

export default router;