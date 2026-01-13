import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
from typing import Dict, Tuple

class EmotionDetector:
    """
    Phát hiện cảm xúc từ khuôn mặt trong ảnh
    Sử dụng ResNet50 được fine-tune trên FER2013 dataset
    """
    
    EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
    
    def __init__(self, model_path: str = None, device: str = 'cuda'):
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        self.model = self._build_model()
        
        if model_path:
            self.load_weights(model_path)
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.Grayscale(num_output_channels=3),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
    
    def _build_model(self) -> nn.Module:
        """Xây dựng model ResNet50 cho emotion detection"""
        model = models.resnet50(weights=None)
        num_features = model.fc.in_features
        model.fc = nn.Linear(num_features, len(self.EMOTIONS))
        return model.to(self.device)
    
    def load_weights(self, path: str):
        """Load pre-trained weights"""
        self.model.load_state_dict(torch.load(path, map_location=self.device))
        self.model.eval()
    
    def detect(self, image: Image.Image) -> Dict[str, float]:
        """
        Phát hiện cảm xúc từ ảnh
        
        Returns:
            Dict với emotion scores
        """
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            scores = probabilities[0].cpu().numpy()
        
        return {
            emotion: float(score) 
            for emotion, score in zip(self.EMOTIONS, scores)
        }
    
    def get_dominant_emotion(self, image: Image.Image) -> Tuple[str, float]:
        """Lấy cảm xúc chủ đạo"""
        scores = self.detect(image)
        dominant = max(scores.items(), key=lambda x: x[1])
        return dominant
    
    def calculate_emotional_intensity(self, scores: Dict[str, float]) -> float:
        """
        Tính độ mạnh cảm xúc (0-1)
        Dựa trên entropy - ảnh có cảm xúc rõ ràng sẽ có intensity cao
        """
        values = np.array(list(scores.values()))
        # Normalize
        values = values / values.sum()
        # Calculate entropy
        entropy = -np.sum(values * np.log(values + 1e-10))
        max_entropy = np.log(len(values))
        # Intensity = 1 - normalized_entropy
        intensity = 1 - (entropy / max_entropy)
        return float(intensity)
