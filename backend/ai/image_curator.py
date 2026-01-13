import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import numpy as np
from typing import List, Dict, Tuple
from dataclasses import dataclass

@dataclass
class CuratedImage:
    """Thông tin ảnh đã được curator"""
    path: str
    emotion_score: float
    aesthetic_score: float
    semantic_tags: List[str]
    importance_score: float

class ImageCurator:
    """
    AI Curator - Tự động chọn lọc và phân loại ảnh
    Sử dụng CLIP để hiểu ngữ nghĩa và đánh giá thẩm mỹ
    """
    
    # Các tiêu chí đánh giá thẩm mỹ
    AESTHETIC_PROMPTS = [
        "a beautiful photograph with good composition",
        "a professional high quality photo",
        "an artistic and creative image",
        "a photo with good lighting and colors",
        "a memorable and meaningful moment"
    ]
    
    # Các chủ đề quan trọng trong cuộc đời
    LIFE_THEMES = [
        "family gathering", "celebration", "wedding", "birthday",
        "travel and adventure", "achievement and success",
        "friendship", "childhood memories", "love and romance",
        "nature and landscape", "pets and animals",
        "work and career", "hobbies and interests"
    ]
    
    def __init__(self, model_name: str = "openai/clip-vit-base-patch32", device: str = 'cuda'):
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)
        self.model.eval()
    
    def calculate_aesthetic_score(self, image: Image.Image) -> float:
        """Đánh giá thẩm mỹ của ảnh (0-1)"""
        inputs = self.processor(
            text=self.AESTHETIC_PROMPTS,
            images=image,
            return_tensors="pt",
            padding=True
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)
        
        # Trung bình các scores
        aesthetic_score = probs.mean().item()
        return aesthetic_score
    
    def extract_semantic_tags(self, image: Image.Image, top_k: int = 5) -> List[Tuple[str, float]]:
        """Trích xuất các tags ngữ nghĩa từ ảnh"""
        inputs = self.processor(
            text=self.LIFE_THEMES,
            images=image,
            return_tensors="pt",
            padding=True
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)[0]
        
        # Lấy top_k tags
        top_indices = torch.topk(probs, k=min(top_k, len(self.LIFE_THEMES))).indices
        tags = [(self.LIFE_THEMES[i], probs[i].item()) for i in top_indices]
        return tags
    
    def calculate_importance_score(
        self,
        emotion_score: float,
        aesthetic_score: float,
        semantic_relevance: float
    ) -> float:
        """
        Tính điểm quan trọng tổng hợp
        
        Formula: weighted average của các yếu tố
        """
        weights = {
            'emotion': 0.4,      # Cảm xúc quan trọng nhất
            'aesthetic': 0.3,    # Thẩm mỹ
            'semantic': 0.3      # Ý nghĩa ngữ nghĩa
        }
        
        importance = (
            weights['emotion'] * emotion_score +
            weights['aesthetic'] * aesthetic_score +
            weights['semantic'] * semantic_relevance
        )
        
        return importance
    
    def curate_images(
        self,
        images: List[Tuple[str, Image.Image]],
        emotion_scores: Dict[str, float],
        top_n: int = 50
    ) -> List[CuratedImage]:
        """
        Chọn lọc top_n ảnh quan trọng nhất
        
        Args:
            images: List of (path, PIL.Image)
            emotion_scores: Dict mapping path -> emotion_intensity
            top_n: Số lượng ảnh cần chọn
        
        Returns:
            List of CuratedImage sorted by importance
        """
        curated = []
        
        for path, image in images:
            # Đánh giá thẩm mỹ
            aesthetic_score = self.calculate_aesthetic_score(image)
            
            # Trích xuất tags
            tags = self.extract_semantic_tags(image)
            semantic_relevance = tags[0][1] if tags else 0.0
            
            # Tính importance
            emotion_score = emotion_scores.get(path, 0.0)
            importance = self.calculate_importance_score(
                emotion_score,
                aesthetic_score,
                semantic_relevance
            )
            
            curated.append(CuratedImage(
                path=path,
                emotion_score=emotion_score,
                aesthetic_score=aesthetic_score,
                semantic_tags=[tag for tag, _ in tags],
                importance_score=importance
            ))
        
        # Sort by importance và lấy top_n
        curated.sort(key=lambda x: x.importance_score, reverse=True)
        return curated[:top_n]
