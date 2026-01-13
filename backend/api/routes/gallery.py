from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict

from db.database import get_db
from db.models import ImageRecord

router = APIRouter()

@router.get("/timeline")
async def get_timeline(db: Session = Depends(get_db)):
    """
    Lấy timeline ảnh theo thời gian và cảm xúc
    Dùng cho 3D gallery
    """
    images = db.query(ImageRecord).order_by(
        ImageRecord.uploaded_at
    ).all()
    
    timeline = []
    for img in images:
        timeline.append({
            "id": img.id,
            "filename": img.filename,
            "path": img.file_path,
            "emotion": img.emotion,
            "emotion_intensity": img.emotion_intensity,
            "importance_score": img.importance_score,
            "tags": img.semantic_tags,
            "timestamp": img.uploaded_at.isoformat()
        })
    
    return {
        "total": len(timeline),
        "timeline": timeline
    }

@router.get("/by-emotion/{emotion}")
async def get_by_emotion(emotion: str, db: Session = Depends(get_db)):
    """Lấy ảnh theo cảm xúc"""
    images = db.query(ImageRecord).filter(
        ImageRecord.emotion == emotion
    ).order_by(
        ImageRecord.emotion_confidence.desc()
    ).all()
    
    return {
        "emotion": emotion,
        "count": len(images),
        "images": [
            {
                "id": img.id,
                "filename": img.filename,
                "path": img.file_path,
                "confidence": img.emotion_confidence
            }
            for img in images
        ]
    }

@router.get("/highlights")
async def get_highlights(limit: int = 20, db: Session = Depends(get_db)):
    """Lấy ảnh highlights (importance cao nhất)"""
    images = db.query(ImageRecord).order_by(
        ImageRecord.importance_score.desc()
    ).limit(limit).all()
    
    return {
        "count": len(images),
        "highlights": [
            {
                "id": img.id,
                "filename": img.filename,
                "path": img.file_path,
                "importance": img.importance_score,
                "emotion": img.emotion,
                "tags": img.semantic_tags
            }
            for img in images
        ]
    }
