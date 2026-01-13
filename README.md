# 🎨 Artistic Memory Vault

> Transform your digital memories into an AI-powered personal art museum

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)

## 🎯 What is This?

An AI-driven platform that turns your photo collection into a curated artistic experience. Upload your memories, and let AI analyze emotions, generate personalized art styles, create ambient music, and build an interactive 3D gallery—all running **100% locally** on your machine.

## ✨ Core Features

- 🤖 **Smart Curation** - AI automatically selects your most meaningful moments
- � **E3motion Analysis** - Detects emotions from facial expressions
- 🎨 **Style Learning** - Learns and recreates your unique artistic style
- 🎵 **Music Generation** - Creates ambient soundtracks based on emotions
- 🎬 **Life Reel** - Generates artistic video summaries of your life
- 🖼️ **3D Gallery** - Explore memories in an immersive 3D space

## 🔒 Privacy-First Design

- ✅ **100% Local AI** - No external APIs or cloud services
- ✅ **Your Data Stays Yours** - Everything runs on your machine
- ✅ **Open Source** - Fully transparent and auditable
- ✅ **Zero Tracking** - No telemetry or data collection

## � System ANrchitecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Upload  │  │ Gallery  │  │   Life   │  │    Style     │   │
│  │ Section  │  │   3D     │  │   Reel   │  │  Transfer    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────────────┐
│                      Backend (FastAPI)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes Layer                       │  │
│  │  /upload  │  /gallery  │  /life-reel  │  /style-transfer │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐ │
│  │                    AI Processing Layer                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │   CLIP   │  │ ResNet50 │  │  Stable  │  │ MusicGen │ │ │
│  │  │ Curator  │  │ Emotion  │  │ Diffusion│  │  Audio   │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐ │
│  │                   Storage Layer                            │ │
│  │         Local Files  │  SQLite DB  │  Model Cache         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 User Workflow

```
┌─────────────┐
│   Upload    │  User uploads photos
│   Photos    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              AI Analysis Pipeline                        │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐     │
│  │  CLIP    │───▶│ Emotion  │───▶│   Quality    │     │
│  │ Features │    │ Detection│    │   Scoring    │     │
│  └──────────┘    └──────────┘    └──────────────┘     │
└────────────────────────┬────────────────────────────────┘
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────┐      ┌──────────┐     ┌──────────────┐
│   3D     │      │   Life   │     │    Style     │
│ Gallery  │      │   Reel   │     │   Transfer   │
│ Explorer │      │ Creator  │     │   Training   │
└──────────┘      └────┬─────┘     └──────┬───────┘
                       │                   │
                       ▼                   ▼
                ┌──────────────┐    ┌──────────────┐
                │   MusicGen   │    │   Generate   │
                │  Soundtrack  │    │   New Art    │
                └──────────────┘    └──────────────┘
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
```

### Option 2: Manual Setup

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance async Python framework
- **PyTorch** - Deep learning inference engine
- **CLIP** (OpenAI) - Image understanding and curation
- **Stable Diffusion** - Style transfer and generation
- **MusicGen** (Meta) - Emotion-based music synthesis

### Frontend
- **React + TypeScript** - Type-safe UI development
- **Three.js** - WebGL-powered 3D gallery
- **TailwindCSS** - Utility-first styling
- **Vite** - Lightning-fast build tool

### AI Models (All Local)
| Model | Size | Purpose |
|-------|------|---------|
| CLIP | 600MB | Image curation & understanding |
| ResNet50 | 100MB | Facial emotion detection |
| Stable Diffusion | 4GB | Style transfer & generation |
| MusicGen | 300MB | Ambient music creation |

## 📊 System Requirements

### Minimum
- **CPU**: 4 cores
- **RAM**: 16GB
- **Storage**: 50GB free space
- **OS**: Windows 10/11, Linux, macOS

### Recommended
- **CPU**: 8+ cores
- **RAM**: 32GB
- **GPU**: NVIDIA RTX 3060+ (8GB VRAM)
- **Storage**: 100GB SSD

## 🐳 Docker Deployment

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## 🎨 Key Use Cases

### 1. Personal Memory Museum
Transform scattered photos into a curated, emotion-aware digital gallery that tells your life story.

### 2. Artistic Style Learning
Train AI on your favorite art styles or photos to generate new artwork in your unique aesthetic.

### 3. Life Reel Creation
Automatically generate cinematic video summaries with AI-composed music matching the emotional tone.

### 4. Privacy-Conscious Archiving
Keep your memories safe and private—no cloud uploads, no data mining, no third-party access.

## 📝 License

MIT License - Free for personal and commercial use.

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🌟 Roadmap

- [ ] **Blockchain Integration** - Immutable digital legacy storage
- [ ] **VR/AR Gallery** - WebXR-powered immersive experiences
- [ ] **Video Analysis** - Extend AI capabilities to video memories
- [ ] **Voice Cloning** - Preserve personality through voice modeling
- [ ] **Mobile Apps** - iOS and Android native applications
- [ ] **Multi-language UI** - Internationalization support

## 💡 Why This Exists

Most people have thousands of photos scattered across devices and cloud services, rarely revisited and poorly organized. This project aims to transform that chaos into a meaningful, artistic experience—while keeping your data completely private and under your control.

Instead of letting tech companies mine your memories, you own the entire pipeline: from AI analysis to artistic generation, everything runs on your hardware.

---

**Made with ❤️ for preserving digital memories**

*Star ⭐ this repo if you believe in privacy-first AI!*
