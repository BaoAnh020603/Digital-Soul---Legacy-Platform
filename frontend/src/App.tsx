import { useState, useEffect } from 'react'
import UploadSection from './components/UploadSection'
import Gallery3D from './components/Gallery3D'
import LifeReelCreator from './components/LifeReelCreator'
import StyleTransfer from './components/StyleTransfer'

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'reel' | 'style'>('upload')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    
    const timer = setInterval(() => setTime(new Date()), 1000)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden vintage-container">
      {/* Vintage Background with old paper texture */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Old paper texture overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')]"></div>
        
        {/* Sepia gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-800/10 to-yellow-900/20"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)]"></div>
        
        {/* Film grain animation */}
        <div className="absolute inset-0 opacity-20 animate-grain bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJncmFpbiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjEuNSIgbnVtT2N0YXZlcz0iMyIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNncmFpbikiLz48L3N2Zz4=')]"></div>
        
        {/* Vintage light leaks */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-yellow-300/30 to-transparent blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-orange-300/30 to-transparent blur-3xl animate-float-delayed"></div>
        
        {/* Old photo corners */}
        <div className="absolute top-4 left-4 w-32 h-32 border-t-4 border-l-4 border-amber-800/30 rounded-tl-3xl"></div>
        <div className="absolute top-4 right-4 w-32 h-32 border-t-4 border-r-4 border-amber-800/30 rounded-tr-3xl"></div>
        <div className="absolute bottom-4 left-4 w-32 h-32 border-b-4 border-l-4 border-amber-800/30 rounded-bl-3xl"></div>
        <div className="absolute bottom-4 right-4 w-32 h-32 border-b-4 border-r-4 border-amber-800/30 rounded-br-3xl"></div>
        
        {/* Vintage spotlight effect */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-500 opacity-30"
          style={{
            left: mousePos.x - 300,
            top: mousePos.y - 300,
            background: 'radial-gradient(circle, rgba(255,200,100,0.4) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        ></div>
      </div>

      {/* Vintage container */}
      <div className="relative z-10">
        {/* Vintage Header with ornate design */}
        <header className="relative backdrop-blur-sm bg-gradient-to-r from-amber-100/80 via-orange-50/80 to-yellow-100/80 border-b-4 border-amber-800/40 shadow-2xl">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700"></div>
          
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Vintage ornate frame */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                  <div className="relative w-20 h-20 rounded-lg bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 flex items-center justify-center shadow-2xl border-4 border-amber-700/50 transform group-hover:scale-110 transition-all duration-300">
                    <span className="text-4xl filter drop-shadow-lg">🎨</span>
                    {/* Corner decorations */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-900"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-900"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-900"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-900"></div>
                  </div>
                </div>
                
                <div>
                  <h1 className="text-5xl font-serif font-bold text-amber-900 drop-shadow-lg tracking-wide vintage-text">
                    Artistic Memory Vault
                  </h1>
                  <p className="text-amber-800/80 mt-2 text-sm font-serif italic tracking-wider">
                    ✨ Di sản Số Cá nhân - Nơi ký ức trở thành nghệ thuật vĩnh cửu
                  </p>
                </div>
              </div>
              
              {/* Vintage clock */}
              <div className="hidden md:flex flex-col items-center gap-2 px-6 py-3 bg-amber-100/60 rounded-lg border-2 border-amber-700/30 shadow-lg">
                <div className="text-2xl font-serif font-bold text-amber-900">
                  {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs font-serif text-amber-700 tracking-wider">
                  {time.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
        </header>

        {/* Vintage Navigation with ornate tabs */}
        <nav className="backdrop-blur-sm bg-gradient-to-r from-amber-100/70 via-orange-50/70 to-yellow-100/70 border-b-2 border-amber-800/30 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-6">
            <div className="flex gap-2 py-3">
              {[
                { id: 'upload', label: '📤 Upload', icon: '📸' },
                { id: 'gallery', label: '🖼️ Gallery', icon: '�️' ,},
                { id: 'reel', label: '🎬 Life Reel', icon: '🎥' },
                { id: 'style', label: '🎨 Style', icon: '🖌️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group relative px-6 py-3 font-serif font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 text-amber-900 shadow-xl border-2 border-amber-700/50'
                      : 'bg-amber-50/50 text-amber-800 hover:bg-amber-100/70 border-2 border-amber-600/30'
                  } rounded-lg`}
                >
                  {/* Vintage corner decorations */}
                  {activeTab === tab.id && (
                    <>
                      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-amber-900"></div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-amber-900"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-amber-900"></div>
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-amber-900"></div>
                    </>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-orange-300/30 rounded-lg blur-sm"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content with vintage paper card effect */}
        <main className="container mx-auto px-6 py-12 animate-fade-in">
          <div className="relative backdrop-blur-sm bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-yellow-50/90 rounded-2xl border-4 border-amber-800/40 shadow-2xl p-8 min-h-[600px]">
            {/* Old paper texture */}
            <div className="absolute inset-0 opacity-30 mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] rounded-2xl"></div>
            
            {/* Vintage corner ornaments */}
            <div className="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-amber-800/40 rounded-tl-2xl"></div>
            <div className="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-amber-800/40 rounded-tr-2xl"></div>
            <div className="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-amber-800/40 rounded-bl-2xl"></div>
            <div className="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-amber-800/40 rounded-br-2xl"></div>
            
            <div className="relative z-10">
              {activeTab === 'upload' && <UploadSection />}
              {activeTab === 'gallery' && <Gallery3D />}
              {activeTab === 'reel' && <LifeReelCreator />}
              {activeTab === 'style' && <StyleTransfer />}
            </div>
          </div>
        </main>

        {/* Vintage Footer with ornate design */}
        <footer className="backdrop-blur-sm bg-gradient-to-r from-amber-100/80 via-orange-50/80 to-yellow-100/80 border-t-4 border-amber-800/40 mt-16 shadow-2xl">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
          
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-center gap-4">
              {/* Vintage seal/badge */}
              <div className="relative group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-300 flex items-center justify-center shadow-lg border-2 border-amber-800/50 animate-pulse-slow">
                  <span className="text-lg">🔒</span>
                </div>
                {/* Ornate circle decoration */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-700/30 animate-spin-slow"></div>
              </div>
              
              <div className="text-center">
                <p className="text-amber-900 font-serif font-semibold text-sm">
                  100% Local AI - Dữ liệu của bạn, quyền riêng tư của bạn
                </p>
                <p className="text-amber-700/70 font-serif text-xs mt-1 italic">
                  ✨ Bảo vệ ký ức của bạn với công nghệ AI hiện đại
                </p>
              </div>
            </div>
            
            {/* Vintage decorative line */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-700/50"></div>
              <span className="text-amber-700/50 text-xs">❖</span>
              <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-700/50"></div>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-grain { animation: grain 8s steps(10) infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .vintage-text {
          text-shadow: 2px 2px 4px rgba(120, 53, 15, 0.3);
        }
      `}</style>
    </div>
  )
}

export default App
