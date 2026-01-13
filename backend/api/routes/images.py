from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from PIL import Image
import io

from db.database import get_db
from db.models import ImageRecord
from ai.image_curator import ImageCurator
from ai.emotion_detector import EmotionDetector
from core.config import settings

router = APIRouter()

# Initialize AI models (singleton)
curator = None
emotion_detector = None

def get_curator():
    global curator
    if curator is None:
        curator = ImageCurator(device=settings.DEVICE)
    return curator

def get_emotion_detector():
    global emotion_detector
    if emotion_detector is None:
        emotion_detector = EmotionDetector(device=settings.DEVICE)
    return emotion_detector

@router.post("/upload")
async def upload_images(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload và phân tích ảnh
    """
    results = []
    
    for file in files:
        # Validate
        if not file.content_type.startswith('image/'):
            raise HTTPException(400, f"File {file.filename} không phải ảnh")
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Detect emotion
        detector = get_emotion_detector()
        emotion_scores = detector.detect(image)
        dominant_emotion, confidence = detector.get_dominant_emotion(image)
        intensity = detector.calculate_emotional_intensity(emotion_scores)
        
        # Save to database
        record = ImageRecord(
            filename=file.filename,
            emotion=dominant_emotion,
            emotion_confidence=confidence,
            emotion_intensity=intensity,
            emotion_scores=emotion_scores
        )
        db.add(record)
        
        results.append({
            "filename": file.filename,
            "emotion": dominant_emotion,
            "confidence": confidence,
            "intensity": intensity,
            "all_scores": emotion_scores
        })
    
    db.commit()
    
    return {
        "message": f"Đã upload {len(files)} ảnh",
        "results": results
    }

@router.post("/curate")
async def curate_collection(
    top_n: int = 50,
    db: Session = Depends(get_db)
):
    """
    Chọn lọc top_n ảnh quan trọng nhất
    """
    # Get all images from DB
    images = db.query(ImageRecord).all()
    
    if len(images) == 0:
        raise HTTPException(404, "Chưa có ảnh nào được upload")
    
    # Prepare data for curator
    image_data = []
    emotion_scores = {}
    
    for img_record in images:
        # Load image
        image = Image.open(img_record.file_path)
        image_data.append((img_record.file_path, image))
        emotion_scores[img_record.file_path] = img_record.emotion_intensity
    
    # Run curation
    curator_model = get_curator()
    curated = curator_model.curate_images(image_data, emotion_scores, top_n)
    
    return {
        "message": f"Đã chọn lọc {len(curated)} ảnh",
        "curated_images": [
            {
                "path": img.path,
                "emotion_score": img.emotion_score,
                "aesthetic_score": img.aesthetic_score,
                "importance_score": img.importance_score,
                "tags": img.semantic_tags
            }
            for img in curated
        ]
    }

@router.get("/stats")
async def get_collection_stats(db: Session = Depends(get_db)):
    """Thống kê collection"""
    total = db.query(ImageRecord).count()
    
    if total == 0:
        return {"total": 0, "emotions": {}}
    
    # Count by emotion
    emotions = {}
    for record in db.query(ImageRecord).all():
        emotions[record.emotion] = emotions.get(record.emotion, 0) + 1
    
    return {
        "total": total,
        "emotions": emotions
    }
