import { useState } from 'react'
import { uploadImages } from '../api/client'

export default function UploadSection() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    try {
      const response = await uploadImages(files)
      setResults(response.results)
    } catch (error) {
      alert('❌ Lỗi khi upload: ' + error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Vintage Title with ornate design */}
      <div className="text-center relative">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-700/50"></div>
          <span className="text-amber-700/50 text-2xl">❖</span>
          <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-700/50"></div>
        </div>
        <h2 className="text-4xl font-serif font-bold text-amber-900 mb-2 vintage-text">
          📸 Upload & Phân tích Ảnh
        </h2>
        <p className="text-amber-800/70 font-serif italic">AI sẽ tự động phát hiện cảm xúc và đánh giá thẩm mỹ</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-700/50"></div>
          <span className="text-amber-700/50 text-2xl">❖</span>
          <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-700/50"></div>
        </div>
      </div>

      {/* Vintage Upload Area with ornate border */}
      <div 
        className={`relative group ${dragActive ? 'scale-105' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className={`
          relative backdrop-blur-sm bg-gradient-to-br from-amber-50/80 to-orange-50/80
          border-4 rounded-2xl p-16 text-center
          transition-all duration-300 transform
          ${dragActive 
            ? 'border-amber-600 bg-amber-100/60 scale-105 shadow-2xl' 
            : 'border-amber-700/50 border-dashed hover:border-amber-600 hover:bg-amber-50/90 hover:shadow-xl'
          }
        `}>
          {/* Old paper texture overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] rounded-2xl"></div>
          
          {/* Vintage corner decorations */}
          <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-800/40 rounded-tl-xl"></div>
          <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-800/40 rounded-tr-xl"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-800/40 rounded-bl-xl"></div>
          <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-800/40 rounded-br-xl"></div>
          
          {/* Sepia glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer relative z-10"
          >
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <div className="w-24 h-24 mx-auto rounded-lg bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-300 flex items-center justify-center shadow-2xl border-4 border-amber-800/50 animate-pulse-slow">
                <span className="text-5xl filter drop-shadow-lg">📁</span>
              </div>
            </div>
            <p className="text-2xl font-serif font-bold text-amber-900 mb-2 vintage-text">
              Kéo thả ảnh vào đây
            </p>
            <p className="text-amber-800/70 font-serif">
              hoặc click để chọn file
            </p>
            <p className="text-sm text-amber-700/60 font-serif italic mt-4">
              Hỗ trợ JPG, PNG, WebP
            </p>
          </label>
        </div>
      </div>

      {/* Selected Files with vintage photo cards */}
      {files.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-amber-900 text-lg font-serif font-semibold">
            ✨ Đã chọn {files.length} ảnh
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, i) => (
              <div 
                key={i} 
                className="group relative backdrop-blur-sm bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-xl p-4 border-4 border-amber-700/40 hover:border-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Old photo texture */}
                <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] rounded-xl"></div>
                
                {/* Sepia glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="w-full h-32 bg-gradient-to-br from-amber-200/50 to-orange-200/50 rounded-lg mb-3 flex items-center justify-center border-2 border-amber-700/30">
                    <span className="text-4xl filter sepia">🖼️</span>
                  </div>
                  <p className="text-xs text-amber-900 font-serif truncate">{file.name}</p>
                  <p className="text-xs text-amber-700/70 font-serif mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vintage Upload Button with ornate design */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="group relative w-full py-5 rounded-xl font-serif font-bold text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 border-4 border-amber-800/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-amber-400/50 to-orange-400/50 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        
        {/* Vintage corner decorations */}
        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-amber-900/50"></div>
        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-amber-900/50"></div>
        <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-amber-900/50"></div>
        <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-amber-900/50"></div>
        
        <span className="relative z-10 text-amber-900 flex items-center justify-center gap-3 drop-shadow-lg">
          {uploading ? (
            <>
              <span className="animate-spin">⏳</span>
              Đang phân tích với AI...
            </>
          ) : (
            <>
              <span>🚀</span>
              Upload & Phân tích với AI
            </>
          )}
        </span>
      </button>

      {/* Results with vintage cards */}
      {results.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-700/50"></div>
              <span className="text-amber-700/50 text-2xl">❖</span>
              <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-700/50"></div>
            </div>
            <h3 className="text-3xl font-serif font-bold text-amber-900 vintage-text">
              ✨ Kết quả phân tích AI
            </h3>
          </div>
          
          <div className="grid gap-4">
            {results.map((result, i) => (
              <div 
                key={i} 
                className="group backdrop-blur-sm bg-gradient-to-br from-amber-50/90 to-orange-50/90 rounded-2xl p-6 border-4 border-amber-700/40 hover:border-amber-600 transition-all duration-300 transform hover:scale-102 hover:shadow-2xl"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Old paper texture */}
                <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] rounded-2xl"></div>
                
                {/* Sepia glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-300 flex items-center justify-center shadow-lg border-4 border-amber-800/50">
                      <span className="text-3xl">
                        {result.emotion === 'happy' ? '😊' : 
                         result.emotion === 'sad' ? '😢' : 
                         result.emotion === 'angry' ? '😠' : '😐'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-serif font-bold text-amber-900">{result.filename}</p>
                      <p className="text-amber-700/70 font-serif text-sm italic">Phân tích hoàn tất</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="backdrop-blur-sm bg-amber-100/50 rounded-xl p-4 border-2 border-amber-700/30">
                      <p className="text-amber-700/70 font-serif text-sm mb-1">Cảm xúc</p>
                      <p className="text-2xl font-serif font-bold text-amber-900 capitalize">{result.emotion}</p>
                    </div>
                    <div className="backdrop-blur-sm bg-amber-100/50 rounded-xl p-4 border-2 border-amber-700/30">
                      <p className="text-amber-700/70 font-serif text-sm mb-1">Độ tin cậy</p>
                      <p className="text-2xl font-serif font-bold text-orange-800">{(result.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <div className="backdrop-blur-sm bg-amber-100/50 rounded-xl p-4 border-2 border-amber-700/30">
                      <p className="text-amber-700/70 font-serif text-sm mb-1">Cường độ</p>
                      <p className="text-2xl font-serif font-bold text-yellow-800">{(result.intensity * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .vintage-text {
          text-shadow: 2px 2px 4px rgba(120, 53, 15, 0.3);
        }
      `}</style>
    </div>
  )
}
