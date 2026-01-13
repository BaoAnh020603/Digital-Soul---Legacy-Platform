from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text
from sqlalchemy.sql import func
from db.database import Base

class ImageRecord(Base):
    """Bảng lưu thông tin ảnh"""
    __tablename__ = "images"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    
    # Emotion analysis
    emotion = Column(String)
    emotion_confidence = Column(Float)
    emotion_intensity = Column(Float)
    emotion_scores = Column(JSON)
    
    # Curation scores
    aesthetic_score = Column(Float)
    importance_score = Column(Float)
    semantic_tags = Column(JSON)
    
    # Metadata
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    width = Column(Integer)
    height = Column(Integer)
    file_size = Column(Integer)

class LifeReelJob(Base):
    """Bảng theo dõi job tạo Life Reel"""
    __tablename__ = "life_reel_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    total_images = Column(Integer)
    output_path = Column(String)
    error_message = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class StyleModel(Base):
    """Bảng lưu thông tin LoRA models"""
    __tablename__ = "style_models"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    model_path = Column(String, nullable=False)
    
    # Training info
    num_training_images = Column(Integer)
    training_epochs = Column(Integer)
    style_prompt = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
