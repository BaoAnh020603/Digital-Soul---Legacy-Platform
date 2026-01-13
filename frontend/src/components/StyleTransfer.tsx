import { useState } from 'react'
import { trainStyle, generateInStyle } from '../api/client'

export default function StyleTransfer() {
  const [tab, setTab] = useState<'train' | 'generate'>('train')
  
  const [trainingFiles, setTrainingFiles] = useState<File[]>([])
  const [styleName, setStyleName] = useState('')
  const [stylePrompt, setStylePrompt] = useState('')
  const [training, setTraining] = useState(false)

  const [modelId, setModelId] = useState<number>(1)
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const handleTrain = async () => {
    if (!styleName || !stylePrompt || trainingFiles.length < 5) {
      alert('Vui lòng điền đầy đủ thông tin và upload ít nhất 5 ảnh')
      return
    }

    setTraining(true)
    try {
      await trainStyle(styleName, stylePrompt, trainingFiles)
      alert('✅ Training hoàn tất!')
    } catch (error) {
      alert('❌ Lỗi: ' + error)
    } finally {
      setTraining(false)
    }
  }

  const handleGenerate = async () => {
    if (!prompt) {
      alert('Vui lòng nhập prompt')
      return
    }

    setGenerating(true)
    try {
      const response = await generateInStyle(modelId, prompt)
      setGeneratedImages(response.images)
    } catch (error) {
      alert('❌ Lỗi: ' + error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="relative backdrop-blur-sm bg-gradient-to-br from-amber-50/90 to-orange-50/90 rounded-2xl p-8 border-4 border-amber-700/40 shadow-2xl">
        <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] rounded-2xl"></div>
        
        <div className="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-amber-800/40 rounded-tl-xl"></div>
        <div className="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-amber-800/40 rounded-tr-xl"></div>
        <div className="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-amber-800/40 rounded-bl-xl"></div>
        <div className="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-amber-800/40 rounded-br-xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-700/50"></div>
              <span className="text-amber-700/50 text-3xl">❖</span>
              <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-700/50"></div>
            </div>
            <h2 className="text-4xl font-serif font-bold text-amber-900 mb-2 vintage-text flex items-center justify-center gap-3">
              <span className="text-5xl">🖌️</span>
              Personal Style Transfer
            </h2>
            <p className="text-amber-800/70 font-serif italic">Xưởng nghệ thuật phong cách cá nhân</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTab('train')}
              className={`flex-1 px-6 py-3 rounded-lg font-serif font-semibold transition-all duration-300 transform hover:scale-105 border-2 ${
                tab === 'train' 
                  ? 'bg-gradient-to-br from-amber-300 to-orange-300 text-amber-900 border-amber-700/50 shadow-xl' 
                  : 'bg-amber-50/50 text-amber-800 border-amber-600/30 hover:bg-amber-100/70'
              }`}
            >
              🎓 Training
            </button>
            <button
              onClick={() => setTab('generate')}
              className={`flex-1 px-6 py-3 rounded-lg font-serif font-semibold transition-all duration-300 transform hover:scale-105 border-2 ${
                tab === 'generate' 
                  ? 'bg-gradient-to-br from-amber-300 to-orange-300 text-amber-900 border-amber-700/50 shadow-xl' 
                  : 'bg-amber-50/50 text-amber-800 border-amber-600/30 hover:bg-amber-100/70'
              }`}
            >
              ✨ Generate
            </button>
          </div>

          {tab === 'train' && (
            <div className="space-y-4">
              <div className="backdrop-blur-sm bg-amber-100/60 rounded-lg p-4 mb-4 border-2 border-amber-700/30">
                <p className="text-amber-900 font-serif text-sm flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <span>Upload 10-50 ảnh mẫu của bạn (vẽ, chụp ảnh, v.v.) để AI học phong cách nghệ thuật của bạn.
                  Sau đó bạn có thể tạo ra những tác phẩm mới "đúng phong cách" của mình!</span>
                </p>
              </div>

              <input
                type="text"
                placeholder="Tên phong cách (vd: My Watercolor Style)"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                className="w-full bg-amber-50/80 border-2 border-amber-700/40 rounded-lg px-4 py-3 text-amber-900 placeholder-amber-700/50 font-serif focus:border-amber-600 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Style prompt (vd: in the style of [your_name])"
                value={stylePrompt}
                onChange={(e) => setStylePrompt(e.target.value)}
                className="w-full bg-amber-50/80 border-2 border-amber-700/40 rounded-lg px-4 py-3 text-amber-900 placeholder-amber-700/50 font-serif focus:border-amber-600 focus:outline-none"
              />

              <div className="border-4 border-dashed border-amber-700/50 rounded-xl p-8 text-center bg-amber-50/50 hover:bg-amber-100/60 hover:border-amber-600 transition-all">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && setTrainingFiles(Array.from(e.target.files))}
                  className="hidden"
                  id="training-upload"
                />
                <label htmlFor="training-upload" className="cursor-pointer">
                  <div className="text-5xl mb-2">🖼️</div>
                  <p className="text-amber-900 font-serif font-semibold">Upload ảnh mẫu (10-50 ảnh)</p>
                  {trainingFiles.length > 0 && (
                    <p className="text-amber-800 font-serif text-sm mt-2">Đã chọn {trainingFiles.length} ảnh</p>
                  )}
                </label>
              </div>

              <button
                onClick={handleTrain}
                disabled={training}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-500 text-amber-900 font-serif font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 border-2 border-amber-800/50 shadow-lg"
              >
                {training ? '⏳ Đang training... (5-10 phút)' : '🎓 Bắt đầu Training'}
              </button>
            </div>
          )}

          {tab === 'generate' && (
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Model ID"
                value={modelId}
                onChange={(e) => setModelId(Number(e.target.value))}
                className="w-full bg-amber-50/80 border-2 border-amber-700/40 rounded-lg px-4 py-3 text-amber-900 font-serif focus:border-amber-600 focus:outline-none"
              />

              <textarea
                placeholder="Nhập prompt (vd: a beautiful sunset over mountains)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full bg-amber-50/80 border-2 border-amber-700/40 rounded-lg px-4 py-3 text-amber-900 placeholder-amber-700/50 font-serif focus:border-amber-600 focus:outline-none"
              />

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-500 text-amber-900 font-serif font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 border-2 border-amber-800/50 shadow-lg"
              >
                {generating ? '⏳ Đang tạo...' : '✨ Tạo ảnh theo phong cách của bạn'}
              </button>

              {generatedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {generatedImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`Generated ${i}`}
                        className="w-full rounded-lg border-4 border-amber-700/40 shadow-lg hover:shadow-2xl transition-all"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .vintage-text {
          text-shadow: 2px 2px 4px rgba(120, 53, 15, 0.3);
        }
      `}</style>
    </div>
  )
}
