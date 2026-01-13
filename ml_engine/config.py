import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/overlord_db")
    # Using CLIP for multi-modal alignment (text-to-image)
    MODEL_NAME = "sentence-transformers/clip-ViT-B-32"
    DEVICE = "cuda" if os.getenv("USE_CUDA") == "True" else "cpu"
    # Threshold for matching
    MATCH_THRESHOLD = 0.25