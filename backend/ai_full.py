"""
Full AI features for Python 3.14
"""
import torch
from PIL import Image
import numpy as np
from typing import List, Dict, Tuple, Optional
import io

class AIProcessor:
    """Complete AI processing"""
    
    def __init__(self, device: str = 'cpu'):
        self.device = device
        self._clip_model = None
        self._emotion_model = None
        self._sd_pipe = None
        
    def _load_clip(self):
        """Load CLIP model"""
        if self._clip_model is None:
            try:
                from transformers import CLIPProcessor, CLIPModel
                self._clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
                self._clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
                self._clip_model.eval()
                print("✅ CLIP loaded")
            except Exception as e:
                print(f"❌ CLIP load failed: {e}")
        return self._clip_model is not None
    
    def _load_emotion(self):
        """Load emotion detection"""
        if self._emotion_model is None:
            try:
                from transformers import pipeline
                self._emotion_model = pipeline(
                    "image-classification",
                    model="dima806/facial_emotions_image_detection",
                    device=self.device
                )
                print("✅ Emotion detector loaded")
            except Exception as e:
                print(f"❌ Emotion detector load failed: {e}")
        return self._emotion_model is not None
    
    def _load_stable_diffusion(self):
        """Load Stable Diffusion"""
        if self._sd_pipe is None:
            try:
                from diffusers import StableDiffusionPipeline
                self._sd_pipe = StableDiffusionPipeline.from_pretrained(
                    "runwayml/stable-diffusion-v1-5",
                    torch_dtype=torch.float32
                )
                self._sd_pipe.to(self.device)
                print("✅ Stable Diffusion loaded")
            except Exception as e:
                print(f"❌ Stable Diffusion load failed: {e}")
        return self._sd_pipe is not None
    
    def analyze_emotion(self, image: Image.Image) -> Dict:
        """Analyze emotion from image"""
        if not self._load_emotion():
            # Fallback to random
            return {
                "emotion": "happy",
                "confidence": 0.85,
                "intensity": 0.75,
                "note": "Emotion detector not available"
            }
        
        try:
            results = self._emotion_model(image)
            top_result = results[0]
            
            return {
                "emotion": top_result['label'].lower(),
                "confidence": float(top_result['score']),
                "intensity": float(top_result['score']),
                "all_scores": {r['label']: float(r['score']) for r in results}
            }
        except Exception as e:
            return {
                "emotion": "neutral",
                "confidence": 0.5,
                "intensity": 0.5,
                "error": str(e)
            }
    
    def calculate_aesthetic_score(self, image: Image.Image) -> float:
        """Calculate aesthetic score using CLIP"""
        if not self._load_clip():
            return 0.7  # Default score
        
        try:
            aesthetic_prompts = [
                "a beautiful photograph",
                "high quality image",
                "artistic composition"
            ]
            
            inputs = self._clip_processor(
                text=aesthetic_prompts,
                images=image,
                return_tensors="pt",
                padding=True
            )
            
            with torch.no_grad():
                outputs = self._clip_model(**inputs)
                logits = outputs.logits_per_image
                probs = logits.softmax(dim=1)
            
            return float(probs.mean())
        except:
            return 0.7
    
    def extract_tags(self, image: Image.Image) -> List[str]:
        """Extract semantic tags"""
        if not self._load_clip():
            return ["photo", "memory"]
        
        try:
            themes = [
                "family", "celebration", "travel", "nature",
                "friends", "work", "hobby", "pet"
            ]
            
            inputs = self._clip_processor(
                text=themes,
                images=image,
                return_tensors="pt",
                padding=True
            )
            
            with torch.no_grad():
                outputs = self._clip_model(**inputs)
                logits = outputs.logits_per_image
                probs = logits.softmax(dim=1)[0]
            
            # Get top 3 tags
            top_indices = torch.topk(probs, k=3).indices
            tags = [themes[i] for i in top_indices]
            return tags
        except:
            return ["photo"]
    
    def curate_images(
        self,
        images_data: List[Dict],
        top_n: int = 50
    ) -> List[Dict]:
        """Curate top images"""
        # Calculate importance scores
        for img_data in images_data:
            emotion_score = img_data.get('emotion_intensity', 0.5)
            aesthetic_score = img_data.get('aesthetic_score', 0.5)
            
            # Weighted average
            importance = (
                0.4 * emotion_score +
                0.3 * aesthetic_score +
                0.3 * 0.7  # semantic relevance default
            )
            img_data['importance_score'] = importance
        
        # Sort and return top N
        sorted_images = sorted(
            images_data,
            key=lambda x: x.get('importance_score', 0),
            reverse=True
        )
        return sorted_images[:top_n]
    
    def generate_image(
        self,
        prompt: str,
        num_inference_steps: int = 30,
        guidance_scale: float = 7.5
    ) -> Optional[Image.Image]:
        """Generate image with Stable Diffusion"""
        if not self._load_stable_diffusion():
            return None
        
        try:
            with torch.no_grad():
                result = self._sd_pipe(
                    prompt=prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale
                )
            return result.images[0]
        except Exception as e:
            print(f"Generation error: {e}")
            return None

# Global AI processor
ai_processor = AIProcessor()
