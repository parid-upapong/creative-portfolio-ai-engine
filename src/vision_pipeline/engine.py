import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from typing import List, Dict, Any
import numpy as np

class VisionEngine:
    """
    The core AI engine responsible for extracting semantic meaning 
    and visual features from digital art.
    """
    def __init__(self, model_name: str, device: str):
        self.device = device
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)
        
        # Pre-defined taxonomy for artist-specific tagging
        self.style_candidates = [
            "digital painting", "pixel art", "3d render", "concept art", 
            "vector illustration", "sketch", "vaporwave", "cyberpunk", 
            "minimalist", "high fantasy", "dark fantasy", "anime style"
        ]

    def process_asset(self, image_path: str) -> Dict[str, Any]:
        image = Image.open(image_path).convert("RGB")
        
        # 1. Generate Vector Embedding (The Chameleon's DNA)
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)
            # Normalize for cosine similarity
            embedding = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
            embedding_list = embedding.cpu().numpy().tolist()[0]

        # 2. Zero-Shot Style Classification
        style_tags = self._get_zero_shot_tags(image, self.style_candidates)
        
        # 3. Dominant Color Extraction (Simplified)
        colors = self._extract_colors(image)

        return {
            "embedding": embedding_list,
            "styles": style_tags,
            "palette": colors,
            "resolution": f"{image.width}x{image.height}"
        }

    def _get_zero_shot_tags(self, image: Image, candidates: List[str]) -> Dict[str, float]:
        inputs = self.processor(
            text=candidates, 
            images=image, 
            return_tensors="pt", 
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)

        results = {candidates[i]: float(probs[0][i]) for i in range(len(candidates))}
        # Filter by threshold
        return {k: v for k, v in results.items() if v > 0.1}

    def _extract_colors(self, image: Image, num_colors: int = 5) -> List[str]:
        # Resize for speed
        small_img = image.resize((50, 50))
        result = small_img.getcolors(50 * 50)
        # Sort by count and convert to Hex
        sorted_colors = sorted(result, key=lambda x: x[0], reverse=True)
        dominant_hex = []
        for count, rgb in sorted_colors[:num_colors]:
            hex_val = '#%02x%02x%02x' % rgb[:3]
            dominant_hex.append(hex_val)
        return dominant_hex