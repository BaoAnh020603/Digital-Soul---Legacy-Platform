from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from PIL import Image
import io

from db.database import get_db
from db.models import StyleModel
from ai.style_transfer_model import PersonalStyleTransfer
from core.config import settings

router = APIRouter()

# Global style transfer model
style_model = None

def get_style_model():
    global style_model
    if style_model is None:
        style_model = PersonalStyleTransfer(device=settings.DEVICE)
    return style_model

@router.post("/train")
async def train_personal_style(
    name: str,
    description: str,
    style_prompt: str,
    files: List[UploadFile] = File(...),
    num_epochs: int = 100,
    db: Session = Depends(get_db)
):
    """
    Huấn luyện LoRA model trên phong cách cá nhân
    
    Args:
        name: Tên model
        description: Mô tả phong cách
        style_prompt: Prompt mô tả phong cách (vd: "in the style of [your_name]")
        files: Ảnh mẫu (10-50 ảnh)
        num_epochs: Số epochs training
    """
    if len(files) < 5:
        raise HTTPException(400, "Cần ít nhất 5 ảnh để training")
    
    # Load images
    training_images = []
    for file in files:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        training_images.append(image)
    
    # Train model
    model = get_style_model()
    model.train_personal_style(
        training_images=training_images,
        style_prompt=style_prompt,
        num_epochs=num_epochs
    )
    
    # Save LoRA weights
    model_path = f"./models/lora_{name}.safetensors"
    model.save_lora_weights(model_path)
    
    # Save to database
    style_record = StyleModel(
        name=name,
        description=description,
        model_path=model_path,
        num_training_images=len(files),
        training_epochs=num_epochs,
        style_prompt=style_prompt
    )
    db.add(style_record)
    db.commit()
    
    return {
        "message": "Training hoàn tất!",
        "model_id": style_record.id,
        "model_path": model_path
    }

@router.post("/generate")
async def generate_in_style(
    model_id: int,
    prompt: str,
    num_images: int = 1,
    seed: int = None,
    db: Session = Depends(get_db)
):
    """
    Tạo ảnh mới theo phong cách đã học
    """
    # Get model info
    style_record = db.query(StyleModel).filter(StyleModel.id == model_id).first()
    if not style_record:
        raise HTTPException(404, "Model không tồn tại")
    
    # Load LoRA weights
    model = get_style_model()
    model.load_lora_weights(style_record.model_path)
    
    # Generate images
    results = []
    for i in range(num_images):
        current_seed = seed + i if seed else None
        image = model.generate_in_personal_style(
            prompt=f"{prompt}, {style_record.style_prompt}",
            seed=current_seed
        )
        
        # Save image
        output_path = f"./output/generated_{model_id}_{i}.png"
        image.save(output_path)
        results.append(output_path)
    
    return {
        "message": f"Đã tạo {num_images} ảnh",
        "images": results
    }

@router.get("/models")
async def list_style_models(db: Session = Depends(get_db)):
    """Liệt kê các style models đã train"""
    models = db.query(StyleModel).all()
    
    return {
        "total": len(models),
        "models": [
            {
                "id": m.id,
                "name": m.name,
                "description": m.description,
                "training_images": m.num_training_images,
                "created_at": m.created_at
            }
            for m in models
        ]
    }
