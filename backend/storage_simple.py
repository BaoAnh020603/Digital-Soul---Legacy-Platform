"""
Simple JSON-based storage (no SQLAlchemy needed)
Python 3.14 compatible
"""
import json
import os
from datetime import datetime
from typing import List, Dict, Optional

class SimpleStorage:
    """Simple JSON file storage"""
    
    def __init__(self, db_path: str = "data.json"):
        self.db_path = db_path
        self.data = self._load()
    
    def _load(self) -> Dict:
        """Load data from JSON file"""
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        return {
            "images": [],
            "style_models": [],
            "life_reel_jobs": []
        }
    
    def _save(self):
        """Save data to JSON file"""
        with open(self.db_path, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
    
    # Images
    def add_image(self, image_data: Dict) -> Dict:
        """Add image record"""
        image_data['id'] = len(self.data['images']) + 1
        image_data['uploaded_at'] = datetime.now().isoformat()
        self.data['images'].append(image_data)
        self._save()
        return image_data
    
    def get_images(self) -> List[Dict]:
        """Get all images"""
        return self.data['images']
    
    def get_image(self, image_id: int) -> Optional[Dict]:
        """Get image by ID"""
        for img in self.data['images']:
            if img['id'] == image_id:
                return img
        return None
    
    def update_image(self, image_id: int, updates: Dict):
        """Update image"""
        for img in self.data['images']:
            if img['id'] == image_id:
                img.update(updates)
                self._save()
                return img
        return None
    
    def get_images_by_emotion(self, emotion: str) -> List[Dict]:
        """Get images by emotion"""
        return [img for img in self.data['images'] if img.get('emotion') == emotion]
    
    def get_top_images(self, limit: int = 20) -> List[Dict]:
        """Get top images by importance"""
        sorted_images = sorted(
            self.data['images'],
            key=lambda x: x.get('importance_score', 0),
            reverse=True
        )
        return sorted_images[:limit]
    
    # Style Models
    def add_style_model(self, model_data: Dict) -> Dict:
        """Add style model"""
        model_data['id'] = len(self.data['style_models']) + 1
        model_data['created_at'] = datetime.now().isoformat()
        self.data['style_models'].append(model_data)
        self._save()
        return model_data
    
    def get_style_models(self) -> List[Dict]:
        """Get all style models"""
        return self.data['style_models']
    
    def get_style_model(self, model_id: int) -> Optional[Dict]:
        """Get style model by ID"""
        for model in self.data['style_models']:
            if model['id'] == model_id:
                return model
        return None
    
    # Life Reel Jobs
    def add_job(self, job_data: Dict) -> Dict:
        """Add life reel job"""
        job_data['id'] = len(self.data['life_reel_jobs']) + 1
        job_data['created_at'] = datetime.now().isoformat()
        self.data['life_reel_jobs'].append(job_data)
        self._save()
        return job_data
    
    def update_job(self, job_id: int, updates: Dict):
        """Update job"""
        for job in self.data['life_reel_jobs']:
            if job['id'] == job_id:
                job.update(updates)
                self._save()
                return job
        return None
    
    def get_job(self, job_id: int) -> Optional[Dict]:
        """Get job by ID"""
        for job in self.data['life_reel_jobs']:
            if job['id'] == job_id:
                return job
        return None
    
    # Stats
    def get_stats(self) -> Dict:
        """Get statistics"""
        emotions = {}
        for img in self.data['images']:
            emotion = img.get('emotion', 'unknown')
            emotions[emotion] = emotions.get(emotion, 0) + 1
        
        return {
            "total_images": len(self.data['images']),
            "total_models": len(self.data['style_models']),
            "total_jobs": len(self.data['life_reel_jobs']),
            "emotions": emotions
        }

# Global storage instance
storage = SimpleStorage()
