# 🎨 Artistic Memory Vault - Di sản Số Cá nhân

> Nền tảng AI-Driven giúp chuyển hóa ký ức số thành bảo tàng nghệ thuật cá nhân

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)

## ✨ Tính năng

- 🤖 **AI Curation** - Tự động chọn lọc khoảnh khắc quan trọng nhất
- 😊 **Emotion Detection** - Phát hiện cảm xúc từ khuôn mặt
- 🎨 **Style Transfer** - Học và tái tạo phong cách nghệ thuật cá nhân
- 🎵 **Music Generation** - Sinh nhạc nền từ cảm xúc
- 🎬 **Life Reel** - Video nghệ thuật tóm tắt cuộc đời
- 🖼️ **3D Gallery** - Không gian triển lãm tương tác

## 🔒 Cam kết

- ✅ **100% Local AI** - Không có API bên ngoài
- ✅ **Privacy First** - Dữ liệu không rời khỏi máy bạn
- ✅ **Open Source** - Mã nguồn mở, minh bạch
- ✅ **No Tracking** - Không thu thập dữ liệu người dùng

## 🚀 Cài đặt Nhanh (Windows)

### Cách 1: Tự động (Khuyến nghị)

```bash
# Bước 1: Cài đặt dependencies
INSTALL.bat

# Bước 2: Chạy ứng dụng
RUN.bat
```

### Cách 2: Thủ công

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install

# Chạy (2 terminals)
# Terminal 1:
cd backend
python main.py

# Terminal 2:
cd frontend
npm run dev
```

## 📖 Tài liệu

- [QUICKSTART.md](QUICKSTART.md) - Hướng dẫn bắt đầu nhanh
- [SETUP.md](SETUP.md) - Hướng dẫn cài đặt chi tiết
- [ARCHITECTURE.md](ARCHITECTURE.md) - Kiến trúc hệ thống

## 🎯 Workflow

1. **Upload ảnh** → AI phân tích cảm xúc và đánh giá
2. **Xem Gallery** → Khám phá ảnh trong không gian 3D
3. **Tạo Life Reel** → Video nghệ thuật tự động với nhạc nền
4. **Train Style** → Học phong cách nghệ thuật của bạn
5. **Generate** → Tạo tác phẩm mới theo phong cách

## 🛠️ Công nghệ

### Backend
- **FastAPI** - Modern Python web framework
- **PyTorch** - Deep learning framework
- **CLIP** - Image understanding (OpenAI)
- **Stable Diffusion** - Image generation
- **MusicGen** - Music generation (Meta)

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D graphics
- **TailwindCSS** - Styling

### AI Models (Local)
- CLIP (600MB) - Image curation
- ResNet50 (100MB) - Emotion detection
- Stable Diffusion (4GB) - Style transfer
- MusicGen (300MB) - Music generation

## 📊 Yêu cầu Hệ thống

### Tối thiểu
- CPU: 4 cores
- RAM: 16GB
- Disk: 50GB free
- OS: Windows 10/11, Linux, macOS

### Khuyến nghị
- CPU: 8+ cores
- RAM: 32GB
- GPU: NVIDIA RTX 3060+ (8GB VRAM)
- Disk: 100GB SSD

## 🐳 Docker

```bash
# Chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại

## 🤝 Đóng góp

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Liên hệ

- Issues: [GitHub Issues](https://github.com/yourusername/artistic-memory-vault/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/artistic-memory-vault/discussions)

## 🌟 Roadmap

- [ ] Blockchain integration cho digital legacy
- [ ] VR/AR gallery với WebXR
- [ ] Video analysis và processing
- [ ] Voice cloning và personality modeling
- [ ] Mobile app (iOS/Android)
- [ ] Multi-language support

## 💡 Inspiration

Dự án này được tạo ra với mục đích giúp mọi người lưu giữ và truyền tải di sản số của mình một cách nghệ thuật và có ý nghĩa, thay vì để dữ liệu nằm lộn xộn trên cloud.

---

Made with ❤️ for preserving digital memories
