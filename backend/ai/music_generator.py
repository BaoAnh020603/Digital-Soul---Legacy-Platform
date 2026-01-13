import torch
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
import numpy as np
from typing import List, Dict

class EmotionalMusicGenerator:
    """
    Sinh nhạc nền từ cảm xúc sử dụng MusicGen (Meta)
    100% local, không cần API
    """
    
    # Mapping cảm xúc -> music prompt
    EMOTION_TO_MUSIC = {
        'happy': 'upbeat cheerful melody with bright piano and strings',
        'sad': 'melancholic slow piano with soft strings',
        'angry': 'intense dramatic orchestral music',
        'fear': 'suspenseful ambient music with low tones',
        'surprise': 'playful unexpected melody with bells',
        'neutral': 'calm ambient background music',
        'disgust': 'dissonant unsettling tones'
    }
    
    def __init__(self, model_size: str = 'small', device: str = 'cuda'):
        """
        Args:
            model_size: 'small', 'medium', 'large' (small = 300M params)
            device: 'cuda' hoặc 'cpu'
        """
        self.device = device
        self.model = MusicGen.get_pretrained(f'facebook/musicgen-{model_size}', device=device)
        self.model.set_generation_params(duration=10)  # 10 giây mỗi đoạn
    
    def generate_from_emotion(
        self,
        emotion: str,
        duration: float = 10.0,
        temperature: float = 1.0
    ) -> np.ndarray:
        """
        Sinh nhạc từ cảm xúc
        
        Args:
            emotion: Tên cảm xúc
            duration: Độ dài (giây)
            temperature: Creativity (0.5-1.5)
        
        Returns:
            Audio array (sample_rate = 32000)
        """
        prompt = self.EMOTION_TO_MUSIC.get(emotion, self.EMOTION_TO_MUSIC['neutral'])
        
        self.model.set_generation_params(
            duration=duration,
            temperature=temperature
        )
        
        with torch.no_grad():
            wav = self.model.generate([prompt])
        
        return wav[0].cpu().numpy()
    
    def generate_life_reel_soundtrack(
        self,
        emotion_timeline: List[Dict[str, any]],
        total_duration: float = 60.0
    ) -> np.ndarray:
        """
        Tạo soundtrack cho Life Reel dựa trên timeline cảm xúc
        
        Args:
            emotion_timeline: List of {'emotion': str, 'duration': float, 'intensity': float}
            total_duration: Tổng độ dài video
        
        Returns:
            Complete audio array
        """
        segments = []
        
        for segment in emotion_timeline:
            emotion = segment['emotion']
            duration = segment['duration']
            intensity = segment.get('intensity', 0.7)
            
            # Temperature dựa trên intensity
            temperature = 0.5 + (intensity * 0.5)
            
            audio = self.generate_from_emotion(
                emotion=emotion,
                duration=duration,
                temperature=temperature
            )
            segments.append(audio)
        
        # Concatenate và crossfade
        full_audio = self._crossfade_segments(segments)
        
        return full_audio
    
    def _crossfade_segments(
        self,
        segments: List[np.ndarray],
        crossfade_duration: float = 1.0
    ) -> np.ndarray:
        """
        Nối các đoạn nhạc với crossfade
        
        Args:
            segments: List of audio arrays
            crossfade_duration: Độ dài crossfade (giây)
        
        Returns:
            Merged audio
        """
        if len(segments) == 0:
            return np.array([])
        
        if len(segments) == 1:
            return segments[0]
        
        sample_rate = 32000  # MusicGen default
        crossfade_samples = int(crossfade_duration * sample_rate)
        
        result = segments[0]
        
        for i in range(1, len(segments)):
            # Tạo fade curve
            fade_out = np.linspace(1, 0, crossfade_samples)
            fade_in = np.linspace(0, 1, crossfade_samples)
            
            # Apply fade
            overlap_length = min(crossfade_samples, len(result), len(segments[i]))
            result[-overlap_length:] *= fade_out[:overlap_length]
            segments[i][:overlap_length] *= fade_in[:overlap_length]
            
            # Merge
            result[-overlap_length:] += segments[i][:overlap_length]
            result = np.concatenate([result, segments[i][overlap_length:]])
        
        return result
    
    def save_audio(self, audio: np.ndarray, path: str, sample_rate: int = 32000):
        """Lưu audio ra file"""
        audio_write(
            path,
            audio,
            sample_rate,
            strategy="loudness",
            loudness_compressor=True
        )
