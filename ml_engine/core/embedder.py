import torch
from PIL import Image
from sentence_transformers import SentenceTransformer
from ml_engine.config import Config

class EmbeddingEngine:
    """
    Generates unified embeddings for both text (briefs) and images (portfolio assets).
    """
    def __init__(self):
        self.model = SentenceTransformer(Config.MODEL_NAME, device=Config.DEVICE)

    def get_text_embedding(self, text: str):
        """Converts client brief text into a vector."""
        with torch.no_grad():
            embedding = self.model.encode(text)
        return embedding.tolist()

    def get_image_embedding(self, image_path: str):
        """Converts an artwork image into a vector."""
        img = Image.open(image_path)
        with torch.no_grad():
            embedding = self.model.encode(img)
        return embedding.tolist()

# Singleton instance
engine = EmbeddingEngine()