from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict
from PIL import Image
import cv2
import numpy as np

from db.database import get_db
from db.models import ImageRecord, LifeReelJob
from ai.music_generator import EmotionalMusicGenerator
from core.config import settings

router = APIRouter()

# Initialize music generator
music_gen = None

def get_music_generator():
    global music_gen
    if music_gen is None:
        music_gen = EmotionalMusicGenerator(model_size='small', device=settings.DEVICE)
    return music_gen

@router.post("/create")
async def create_life_reel(
    duration_per_image: float = 3.0,
    transition_duration: float = 1.0,
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """
    Tạo Life-art Reel từ ảnh đã curate
    """
    # Get curated images
    images = db.query(ImageRecord).order_by(
        ImageRecord.importance_score.desc()
    ).limit(20).all()
    
    if len(images) == 0:
        raise HTTPException(404, "Chưa có ảnh nào để tạo reel")
    
    # Create job
    job = LifeReelJob(
        status="processing",
        total_images=len(images)
    )
    db.add(job)
    db.commit()
    
    # Process in background
    if background_tasks:
        background_tasks.add_task(
            process_life_reel,
            job.id,
            images,
            duration_per_image,
            transition_duration
        )
    
    return {
        "job_id": job.id,
        "status": "processing",
        "message": "Đang tạo Life Reel..."
    }

def process_life_reel(
    job_id: int,
    images: List[ImageRecord],
    duration_per_image: float,
    transition_duration: float
):
    """
    Background task để tạo video
    """
    from db.database import SessionLocal
    db = SessionLocal()
    
    try:
        # Prepare emotion timeline
        emotion_timeline = []
        for img in images:
            emotion_timeline.append({
                'emotion': img.emotion,
                'duration': duration_per_image,
                'intensity': img.emotion_intensity
            })
        
        # Generate music
        music_gen = get_music_generator()
        total_duration = len(images) * duration_per_image
        audio = music_gen.generate_life_reel_soundtrack(
            emotion_timeline,
            total_duration
        )
        
        # Save audio
        audio_path = f"./output/life_reel_{job_id}.wav"
        music_gen.save_audio(audio, audio_path)
        
        # Create video
        video_path = f"./output/life_reel_{job_id}.mp4"
        create_video_with_transitions(
            images,
            video_path,
            duration_per_image,
            transition_duration
        )
        
        # Merge audio + video
        final_path = f"./output/life_reel_{job_id}_final.mp4"
        merge_audio_video(video_path, audio_path, final_path)
        
        # Update job
        job = db.query(LifeReelJob).filter(LifeReelJob.id == job_id).first()
        job.status = "completed"
        job.output_path = final_path
        db.commit()
        
    except Exception as e:
        job = db.query(LifeReelJob).filter(LifeReelJob.id == job_id).first()
        job.status = "failed"
        job.error_message = str(e)
        db.commit()
    finally:
        db.close()

def create_video_with_transitions(
    images: List[ImageRecord],
    output_path: str,
    duration_per_image: float,
    transition_duration: float
):
    """
    Tạo video với transitions
    """
    fps = 30
    size = (1920, 1080)
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, size)
    
    for i, img_record in enumerate(images):
        # Load image
        img = Image.open(img_record.file_path)
        img = img.resize(size)
        frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        
        # Write frames
        num_frames = int(duration_per_image * fps)
        for _ in range(num_frames):
            out.write(frame)
        
        # Transition to next image
        if i < len(images) - 1:
            next_img = Image.open(images[i + 1].file_path).resize(size)
            next_frame = cv2.cvtColor(np.array(next_img), cv2.COLOR_RGB2BGR)
            
            # Crossfade transition
            transition_frames = int(transition_duration * fps)
            for t in range(transition_frames):
                alpha = t / transition_frames
                blended = cv2.addWeighted(frame, 1 - alpha, next_frame, alpha, 0)
                out.write(blended)
    
    out.release()

def merge_audio_video(video_path: str, audio_path: str, output_path: str):
    """
    Merge audio và video bằng ffmpeg
    """
    import subprocess
    
    cmd = [
        'ffmpeg',
        '-i', video_path,
        '-i', audio_path,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-strict', 'experimental',
        output_path
    ]
    
    subprocess.run(cmd, check=True)

@router.get("/status/{job_id}")
async def get_job_status(job_id: int, db: Session = Depends(get_db)):
    """Check trạng thái job"""
    job = db.query(LifeReelJob).filter(LifeReelJob.id == job_id).first()
    
    if not job:
        raise HTTPException(404, "Job không tồn tại")
    
    return {
        "job_id": job.id,
        "status": job.status,
        "output_path": job.output_path,
        "error": job.error_message
    }
