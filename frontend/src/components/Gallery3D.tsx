import { useEffect, useState } from 'react'
import { getTimeline } from '../api/client'

interface ImageData {
  id: number
  path: string
  emotion: string
  importance_score: number
  timestamp: string
}

export default function Gallery3D() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const response = await getTimeline()
      setImages(response.timeline)
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-300 flex items-center justify-center animate-pulse border-4 border-amber-800/50 shadow-xl">
          <span className="text-3xl">⏳</span>
        </div>
        <p className="text-amber-900 font-serif text-xl mt-4">Đang tải gallery...</p>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative inline-block">
          {/* Vintage empty album */}
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 flex items-center justify-center shadow-2xl border-4 border-amber-800/50 mb-6">
            <span className="text-6xl filter sepia">📭</span>
          </div>
          {/* Ornate corners */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-amber-800/40"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-amber-800/40"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-amber-800/40"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-amber-800/40"></div>
        </div>
        <p className="text-amber-900 font-serif text-2xl font-bold vintage-text">Chưa có ảnh nào</p>
        <p className="text-amber-700/70 font-serif italic mt-2">Hãy upload ảnh để bắt đầu tạo album kỷ niệm!</p>
      </div>
    )
  }

  return (
    <div className="w-full animate-fade-in">
      {/* Vintage Album Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-700/50"></div>
          <span className="text-amber-700/50 text-3xl">❖</span>
          <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-700/50"></div>
        </div>
        <h2 className="text-4xl font-serif font-bold text-amber-900 mb-2 vintage-text">
          🎞️ Album Ký Ức
        </h2>
        <p className="text-amber-800/70 font-serif italic">Những khoảnh khắc đẹp nhất của bạn</p>
      </div>
      
      {/* Vintage Photo Album Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img, index) => (
          <div 
            key={img.id} 
            className="group relative animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Vintage photo frame */}
            <div className="relative backdrop-blur-sm bg-gradient-to-br from-amber-50/90 to-orange-50/90 rounded-xl p-4 border-4 border-amber-700/50 hover:border-amber-600 transition-all duration-300 transform hover:scale-105 hover:rotate-1 hover:shadow-2xl">
              {/* Old paper texture */}
              <div className="absolute inset-0 opacity-30 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] rounded-xl"></div>
              
              {/* Sepia glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Photo placeholder with sepia effect */}
              <div className="relative aspect-square bg-gradient-to-br from-amber-200/60 to-orange-200/60 rounded-lg mb-3 flex items-center justify-center border-2 border-amber-700/30 overflow-hidden">
                <span className="text-5xl filter sepia">🖼️</span>
                {/* Film grain overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJncmFpbiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjEuNSIgbnVtT2N0YXZlcz0iMyIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNncmFpbikiLz48L3N2Zz4=')]"></div>
              </div>
              
              {/* Vintage photo info */}
              <div className="relative z-10">
                <p className="text-amber-900 font-serif text-sm font-semibold truncate mb-1">{img.path}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-700/70 font-serif italic">
                    {img.emotion === 'happy' ? '😊 Vui' : 
                     img.emotion === 'sad' ? '😢 Buồn' : 
                     img.emotion === 'angry' ? '😠 Giận' : '😐 Bình thường'}
                  </span>
                  <span className="text-amber-700/70 font-serif">
                    ⭐ {(img.importance_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              {/* Vintage corner decorations */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-900/40"></div>
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-900/40"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-900/40"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-900/40"></div>
            </div>
            
            {/* Vintage tape effect */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-amber-200/80 border border-amber-700/30 rounded-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
      
      {/* Vintage Album Stats */}
      <div className="mt-8 text-center">
        <div className="inline-block backdrop-blur-sm bg-gradient-to-br from-amber-100/80 to-orange-100/80 rounded-xl px-8 py-4 border-4 border-amber-700/40 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-serif font-bold text-amber-900">{images.length}</p>
              <p className="text-sm font-serif text-amber-700/70 italic">Ảnh</p>
            </div>
            <div className="w-px h-12 bg-amber-700/30"></div>
            <div className="text-center">
              <p className="text-3xl font-serif font-bold text-amber-900">
                {images.filter(img => img.importance_score > 0.7).length}
              </p>
              <p className="text-sm font-serif text-amber-700/70 italic">Quan trọng</p>
            </div>
            <div className="w-px h-12 bg-amber-700/30"></div>
            <div className="text-center">
              <p className="text-3xl font-serif font-bold text-amber-900">
                {new Set(images.map(img => img.emotion)).size}
              </p>
              <p className="text-sm font-serif text-amber-700/70 italic">Cảm xúc</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vintage Note */}
      <div className="mt-8 backdrop-blur-sm bg-amber-100/60 rounded-xl p-6 border-4 border-amber-700/30 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-orange-300 flex items-center justify-center flex-shrink-0 border-2 border-amber-800/50">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <p className="text-amber-900 font-serif font-semibold mb-2">Lưu ý về Gallery 3D</p>
            <p className="text-amber-800/80 font-serif text-sm">
              Gallery hiện đang hiển thị dạng album ảnh vintage cổ điển. 
              Để xem không gian 3D đầy đủ với WebGL, cần cài thêm @react-three/fiber và @react-three/drei.
              Album này đã được tối ưu với hiệu ứng sepia, film grain và phong cách ảnh cũ đặc trưng.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .vintage-text {
          text-shadow: 2px 2px 4px rgba(120, 53, 15, 0.3);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
