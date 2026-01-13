from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Database
    DATABASE_URL: str = "sqlite:///./artistic_vault.db"
    
    # Storage
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "artistic-vault"
    
    # AI Models
    MODELS_DIR: str = "./models"
    DEVICE: str = "cuda"  # hoặc "cpu"
    
    # Processing
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    SUPPORTED_FORMATS: List[str] = [".jpg", ".jpeg", ".png", ".webp"]
    
    class Config:
        env_file = ".env"

settings = Settings()
