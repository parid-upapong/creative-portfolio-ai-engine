import os
from pydantic import BaseSettings

class VisionConfig(BaseSettings):
    # Model Settings
    CLIP_MODEL: str = "openai/clip-vit-base-patch32"
    DEVICE: str = "cuda" if os.getenv("USE_GPU") == "1" else "cpu"
    
    # Thresholds
    TAG_CONFIDENCE_THRESHOLD: float = 0.65
    MAX_TAGS_PER_IMAGE: int = 15
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/overlord")
    
    # Asset Storage
    S3_ENDPOINT: str = os.getenv("S3_ENDPOINT", "s3.amazonaws.com")
    ASSET_BUCKET: str = "artist-vault-production"

settings = VisionConfig()