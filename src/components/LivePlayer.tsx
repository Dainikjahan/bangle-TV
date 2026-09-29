import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Crown, Radio, Clock, ShieldCheck, CheckCircle2, 
  Sparkles, Layers, RefreshCw, Eye, Repeat, Globe, 
  Tv, Film, Search, Smartphone, Monitor, Activity,
  Sliders, Compass, ArrowRight, PlayCircle
} from 'lucide-react';
import { BroadcastItem } from '../types/broadcast';
import { BREAKING_NEWS_ITEMS } from '../data/initialBroadcasts';

interface LivePlayerProps {
  currentProgram: BroadcastItem;
  playlist: BroadcastItem[];
  onProgramChange: (program: BroadcastItem) => void;
  logoPosition?: 'top-right' | 'top-left';
  onToggleLogoPosition?: () => void;
}

type ScreenSize = 'tv' | 'mobile';

export default function LivePlayer({
  currentProgram,
  playlist,
  onProgramChange,
}: LivePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [screenSize, setScreenSize] = useState<ScreenSize>('tv');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLowerThird, setShowLowerThird] = useState<boolean>(true);
  const [autoLoop, setAutoLoop] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [streamElapsed, setStreamElapsed] = useState<number>(0);

  // Dual World Studio Clocks (Dhaka BST & New York EST)
  const [timeBST, setTimeBST] = useState<string>('');
  const [timeEST, setTimeEST] = useState<string>('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeBST(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dhaka',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      setTimeEST(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format MM:SS helper
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset stream elapsed on program change
  useEffect(() => {
    setStreamElapsed(0);
  }, [currentProgram.id]);

  // Real-time loop stream synchronizer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStreamElapsed((prev) => {
        const programDuration = currentProgram.duration || 300;
        if (autoLoop && prev >= programDuration) {
          handleNextInLoop();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, autoLoop, currentProgram.id, currentProgram.duration, playlist]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Next documentary in automated loop
  const handleNextInLoop = () => {
    const currentIndex = playlist.findIndex((p) => p.id === currentProgram.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    onProgramChange(playlist[nextIndex]);
  };

  const handlePrevInLoop = () => {
    const currentIndex = playlist.findIndex((p) => p.id === currentProgram.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    onProgramChange(playlist[prevIndex]);
  };

  // Filter playlist for the documentary carousel
  const filteredPlaylist = playlist.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNetwork = 
      networkFilter === 'all' ? true :
      networkFilter === 'uksoa' ? (item.sourceNetwork?.includes('UK SOA')) :
      networkFilter === 'aljazeera' ? (item.sourceNetwork?.includes('Al Jazeera')) :
      networkFilter === 'bbc' ? (item.sourceNetwork?.includes('BBC')) :
      networkFilter === 'shorts' ? (item.isShort) : true;

    return matchesSearch && matchesNetwork;
  });

  const citizenShorts = playlist.filter(item => item.isShort);

  const isYouTube = !!currentProgram.youtubeId;
  const currentProgramIndex = playlist.findIndex((p) => p.id === currentProgram.id);

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 1. AMERICAN BROADCAST NETWORK MASTER CONTROL BAR               */}
      {/* ============================================================== */}
      <div className="bg-[#050814] border border-[#172033] rounded-2xl p-4 sm:p-5 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          {/* Channel Identification & Master Ingest Telemetry */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#996515] via-[#d4af37] to-[#fef08a] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 text-[#02040a] shrink-0 border border-[#fef08a]/60">
              <Crown size={28} className="stroke-[2.5]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  BENGAL TELEVISION
                </span>
                <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-[#fbbf24] to-[#d4af37] text-[#02040a] font-black uppercase shadow-sm">
                  bengaltv.com
                </span>
                <span className="bg-red-600 text-white text-[10px] font-mono font-black tracking-widest px-2 py-0.5 rounded uppercase flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  LIVE ON-AIR
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                <span className="text-emerald-400 font-semibold">1080p60 MASTER FEED</span>
                <span>•</span>
                <span>US-EAST CLOUD CDN</span>
                <span>•</span>
                <span className="text-[#fbbf24]">{playlist.length} INVESTIGATIVE EDITIONS</span>
              </div>
            </div>
          </div>

          {/* Master Control Operations: Dual Clocks, Viewport & Loop Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Viewport Format Switcher (16:9 Smart TV vs Mobile) */}
            <div className="flex items-center bg-[#081021] border border-[#172033] p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setScreenSize('tv')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  screenSize === 'tv'
                    ? 'bg-[#d4af37] text-[#02040a] shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="16:9 Smart TV Broadcast Display"
              >
                <Monitor size={14} />
                <span>16:9 TV VIEW</span>
              </button>

              <button
                onClick={() => setScreenSize('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  screenSize === 'mobile'
                    ? 'bg-[#d4af37] text-[#02040a] shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="9:16 Mobile Handheld View"
              >
                <Smartphone size={14} />
                <span>MOBILE</span>
              </button>
            </div>

            {/* Studio World Clocks */}
            <div className="flex items-center gap-3 bg-[#081021] border border-[#172033] px-3.5 py-1.5 rounded-xl font-mono text-[11px] shadow-inner text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-[#fbbf24] font-bold">BST:</span>
                <span>{timeBST || '12:00:00 PM'}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-blue-400 font-bold">EST:</span>
                <span>{timeEST || '02:00:00 AM'}</span>
              </div>
            </div>

            {/* Auto Loop Toggle */}
            <button
              onClick={() => setAutoLoop(!autoLoop)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer border ${
                autoLoop 
                  ? 'bg-[#d4af37]/15 text-[#fbbf24] border-[#d4af37]/40 shadow-sm' 
                  : 'bg-[#081021] text-slate-400 border-[#172033] hover:text-white'
              }`}
              title="24/7 Continuous Loop Automated Playout"
            >
              <Repeat size={13} className={autoLoop ? 'animate-spin-slow' : ''} />
              <span>{autoLoop ? '24/7 LOOP: ON' : 'LOOP: MANUAL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CINEMATIC 16:9 WIDESCREEN BROADCAST STAGE                   */}
      {/* ============================================================== */}
      {screenSize === 'tv' ? (
        <div 
          ref={containerRef}
          className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#172033] group select-none flex flex-col justify-between"
        >
          {/* VIDEO FEED: YouTube Iframe or HTML5 Ingest */}
          {isYouTube ? (
            <div className="absolute inset-0 w-full h-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${currentProgram.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&enablejsapi=1&loop=1&playlist=${currentProgram.youtubeId}&controls=1&modestbranding=1&rel=0`}
                title={currentProgram.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={currentProgram.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              autoPlay
              muted={isMuted}
            />
          )}

          {/* PERMANENT, UNMOVABLE CROWN LOGO BUG (TOP-RIGHT CORNER OF BROADCAST VIEWPORT) */}
          <div 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 pointer-events-none select-none transition-transform"
          >
            <div className="bg-[#02040a]/92 backdrop-blur-md border border-[#d4af37]/70 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xl shadow-black/95 flex items-center gap-2.5 ring-1 ring-[#fbbf24]/30 pointer-events-auto">
              {/* Crown Icon */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-[#996515] via-[#d4af37] to-[#fef08a] rounded-lg flex items-center justify-center shadow-lg shadow-[#d4af37]/35 text-[#02040a] shrink-0 border border-[#fef08a]/60">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </div>

              {/* Brand text & Live indicator */}
              <div className="text-left leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs sm:text-sm tracking-wider text-white drop-shadow font-sans">
                    BENGAL TV
                  </span>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[9px] sm:text-[10px] text-[#fbbf24] font-mono">
                  <span className="font-bold tracking-widest uppercase">bengaltv.com</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-semibold">{timeBST || 'BST LIVE'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Left Corner: Source Network Feed Badge */}
          <div 
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 pointer-events-none"
          >
            <div className="flex flex-col gap-1 items-start">
              <span className="bg-[#02040a]/92 backdrop-blur-md border border-[#172033] text-white text-[10px] font-mono px-3 py-1 rounded-lg flex items-center gap-2 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-bold text-slate-100">{currentProgram.sourceNetwork || 'bengaltv.com Special'}</span>
              </span>
              <span className="bg-[#d4af37]/20 backdrop-blur-md border border-[#d4af37]/40 text-[#fbbf24] text-[9px] font-mono px-2 py-0.5 rounded">
                US-EAST MASTER INGEST · 1080p
              </span>
            </div>
          </div>

          {/* Bottom Overlay: Professional Broadcast Lower-Third & News Ticker */}
          <div className="relative z-30 mt-auto bg-gradient-to-t from-[#02040a] via-[#02040a]/95 to-transparent pt-12 pointer-events-auto">
            {/* .live-player-info Lower Third */}
            {showLowerThird && (
              <div className="px-4 sm:px-6 pb-2.5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="live-player-info max-w-2xl rounded-r-xl p-3 sm:p-4 text-white shadow-2xl relative overflow-hidden">
                  {/* Top metadata kicker */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs mb-1.5">
                    {/* Category Label */}
                    <span className="bg-gradient-to-r from-[#fbbf24] to-[#d4af37] text-[#02040a] font-black px-2 py-0.5 rounded text-[10px] tracking-wide uppercase shadow-sm">
                      {currentProgram.categoryLabel || currentProgram.category}
                    </span>

                    {/* Source Network Badge */}
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center gap-1.5 ${
                      currentProgram.sourceNetwork?.includes('Al Jazeera')
                        ? 'bg-amber-950/80 text-[#fbbf24] border border-[#d4af37]/50'
                        : currentProgram.sourceNetwork?.includes('BBC')
                        ? 'bg-red-950/80 text-rose-200 border border-red-500/50'
                        : 'bg-[#081021] text-slate-200 border border-[#172033]'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {currentProgram.sourceNetwork || 'Broadcast Network'}
                    </span>

                    {/* Real-time Stream Sync Counter */}
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <span>SYNC:</span>
                      <span className="font-bold">{formatTime(streamElapsed)}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-400">{formatTime(currentProgram.duration || 300)}</span>
                    </span>

                    {currentProgram.location && (
                      <span className="text-slate-400 text-[10px] hidden md:inline">
                        • {currentProgram.location}
                      </span>
                    )}
                  </div>

                  {/* Main Documentary Title */}
                  <h3 className="font-extrabold text-sm sm:text-base leading-snug text-white line-clamp-2 tracking-tight">
                    {currentProgram.title}
                  </h3>

                  {/* Real-time Stream Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#172033]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#fbbf24] to-[#d4af37] transition-all duration-1000 ease-linear"
                      style={{ 
                        width: `${Math.min(100, (streamElapsed / (currentProgram.duration || 300)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Playout Sequence Controller */}
                <div className="flex items-center gap-2 bg-[#050814]/95 backdrop-blur-md border border-[#172033] px-3.5 py-1.5 rounded-xl text-xs text-slate-300 self-end shadow-lg">
                  <button
                    onClick={handlePrevInLoop}
                    className="px-2 py-1 bg-[#081021] hover:bg-[#101e3d] text-slate-300 hover:text-white rounded-lg transition-colors text-[11px] font-bold cursor-pointer"
                    title="Previous Broadcast Edition"
                  >
                    ◀ PREV
                  </button>
                  <span className="font-mono text-[#fbbf24] font-bold px-1 text-xs">
                    {currentProgramIndex + 1} / {playlist.length}
                  </span>
                  <button
                    onClick={handleNextInLoop}
                    className="px-2 py-1 bg-gradient-to-r from-[#fbbf24] to-[#d4af37] hover:brightness-110 text-[#02040a] rounded-lg transition-colors text-[11px] font-extrabold cursor-pointer"
                    title="Next Broadcast Edition"
                  >
                    NEXT ▶
                  </button>
                </div>
              </div>
            )}

            {/* Bloomberg / CNN-Grade Real-Time Breaking News Ticker */}
            <div className="w-full bg-[#991b1b] text-white flex items-center overflow-hidden h-8 sm:h-9 border-t border-red-500 shadow-md">
              <div className="bg-[#02040a] text-[#fbbf24] px-3 sm:px-4 h-full flex items-center font-black text-[11px] sm:text-xs tracking-wider shrink-0 uppercase border-r border-[#172033]">
                <Radio size={14} className="mr-1.5 text-red-500 animate-pulse" />
                bengaltv.com
              </div>
              <div className="flex-1 overflow-hidden whitespace-nowrap">
                <div className="inline-block animate-marquee font-semibold text-xs sm:text-sm pl-4">
                  {BREAKING_NEWS_ITEMS.map((item, idx) => (
                    <span key={idx} className="mx-6">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Master Control Utility Strip */}
            <div className="bg-[#02040a] px-4 sm:px-6 py-2 flex items-center justify-between text-slate-300 border-t border-[#172033] text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="px-3 py-1 rounded-lg bg-[#081021] hover:bg-[#101e3d] border border-[#172033] text-slate-200 flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isMuted ? 'UNMUTE MASTER' : 'MUTE'}</span>
                </button>

                <button
                  onClick={() => setShowLowerThird(!showLowerThird)}
                  className={`px-3 py-1 rounded-lg transition-colors hidden sm:block ${
                    showLowerThird ? 'bg-[#101e3d] text-[#fbbf24] border border-[#d4af37]/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {showLowerThird ? 'LOWER-THIRD: ON' : 'LOWER-THIRD: OFF'}
                </button>
              </div>

              {/* Stereo Audio VU Meter Simulation */}
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <div className="hidden sm:flex items-center gap-1">
                  <span>VU L/R:</span>
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-xs"></span>
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-xs"></span>
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-xs"></span>
                    <span className="w-1.5 h-3 bg-[#fbbf24] rounded-xs animate-pulse"></span>
                    <span className="w-1.5 h-3 bg-slate-700 rounded-xs"></span>
                  </div>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Fullscreen Theater Mode"
                >
                  {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* 2B. 9:16 MOBILE HANDHELD BROADCAST SIMULATOR                   */
        /* ============================================================== */
        <div className="flex justify-center py-4">
          <div className="w-[360px] sm:w-[390px] h-[700px] bg-[#02040a] rounded-[48px] p-3.5 border-[6px] border-[#081021] shadow-2xl relative flex flex-col justify-between overflow-hidden ring-1 ring-[#172033]">
            {/* Mobile Island / Camera Notch */}
            <div className="w-28 h-4 bg-black rounded-full mx-auto z-40 relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
            </div>

            <div className="relative flex-1 w-full h-full rounded-[36px] overflow-hidden flex flex-col justify-between bg-black mt-1">
              {/* Mobile Video Feed */}
              {isYouTube ? (
                <div className="absolute inset-0 w-full h-full bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${currentProgram.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&enablejsapi=1&loop=1&playlist=${currentProgram.youtubeId}&controls=1`}
                    title={currentProgram.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={currentProgram.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  autoPlay
                  muted={isMuted}
                />
              )}

              {/* PERMANENT TOP-RIGHT CROWN BUG ON MOBILE */}
              <div className="absolute top-4 right-3 z-40 pointer-events-none select-none">
                <div className="bg-[#02040a]/92 backdrop-blur-md border border-[#d4af37]/70 rounded-xl px-2.5 py-1.5 shadow-2xl shadow-black flex items-center gap-1.5 ring-1 ring-[#fbbf24]/30 pointer-events-auto">
                  <div className="w-6 h-6 bg-gradient-to-tr from-[#996515] via-[#d4af37] to-[#fef08a] rounded-md flex items-center justify-center text-[#02040a] font-bold shrink-0 border border-[#fef08a]/50">
                    <Crown size={14} className="stroke-[2.5]" />
                  </div>
                  <div className="text-left leading-none">
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-[11px] tracking-wider text-white">BENGAL TV</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    </div>
                    <span className="text-[8px] text-[#fbbf24] font-mono font-bold">bengaltv.com</span>
                  </div>
                </div>
              </div>

              {/* Top-Left Source Network Badge */}
              <div className="absolute top-4 left-3 z-20 pointer-events-none">
                <span className="bg-[#02040a]/85 backdrop-blur-sm border border-[#172033] text-white text-[9px] font-mono px-2 py-0.5 rounded">
                  {currentProgram.sourceNetwork || 'bengaltv.com'}
                </span>
              </div>

              {/* Mobile Lower-Third & Controls */}
              <div className="relative z-30 mt-auto bg-gradient-to-t from-[#02040a] via-[#02040a]/95 to-transparent pt-8 p-3 text-white pointer-events-auto">
                <div className="live-player-info p-2.5 rounded-r-xl mb-2 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-1 text-[9px] mb-1">
                    <span className="font-bold text-[#fbbf24] uppercase truncate">
                      {currentProgram.categoryLabel}
                    </span>
                    <span className="font-mono text-emerald-400 text-[8px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {currentProgram.sourceNetwork} • {formatTime(streamElapsed)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug line-clamp-2 text-white">
                    {currentProgram.title}
                  </h4>
                  {/* Real-time Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#172033]">
                    <div 
                      className="h-full bg-[#fbbf24] transition-all duration-1000 ease-linear"
                      style={{ 
                        width: `${Math.min(100, (streamElapsed / (currentProgram.duration || 300)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Mobile Ticker */}
                <div className="bg-red-800 text-white rounded text-[10px] font-medium py-1 px-2 mb-2 flex items-center overflow-hidden">
                  <span className="font-bold text-[#fbbf24] mr-2 shrink-0">bengaltv.com</span>
                  <div className="truncate">
                    {BREAKING_NEWS_ITEMS[0]}
                  </div>
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#172033]">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 bg-[#081021] rounded text-slate-300 hover:text-white"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#fbbf24]">
                    <button onClick={handlePrevInLoop} className="px-1.5 py-0.5 bg-[#081021] rounded">◀</button>
                    <span>{currentProgramIndex + 1} / {playlist.length}</span>
                    <button onClick={handleNextInLoop} className="px-1.5 py-0.5 bg-[#081021] rounded">▶</button>
                  </div>

                  <span className="text-[9px] text-emerald-400 font-mono font-bold">24/7 LIVE</span>
                </div>
              </div>
            </div>

            <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. CURATED 32+ DOCUMENTARY CHANNEL GUIDE & EPG ARCHIVE         */}
      {/* ============================================================== */}
      <div className="bg-[#050814] rounded-2xl border border-[#172033] p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#172033] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Film size={18} className="text-[#fbbf24]" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Curated Investigative Archive & Playout Catalog ({playlist.length} Editions)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Acclaimed international investigative documentaries on Bangladesh from Al Jazeera and BBC World Service. Click any edition to tune in live.
            </p>
          </div>

          {/* Search Input & Network Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documentaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-[#081021] border border-[#172033] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#081021] border border-[#172033] p-1 rounded-xl text-xs overflow-x-auto">
              <button
                onClick={() => setNetworkFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all whitespace-nowrap ${
                  networkFilter === 'all' ? 'bg-[#d4af37] text-[#02040a]' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setNetworkFilter('uksoa')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all whitespace-nowrap ${
                  networkFilter === 'uksoa' ? 'bg-[#d4af37] text-[#02040a]' : 'text-[#fbbf24] hover:text-white'
                }`}
              >
                ★ UK SOA Intelligence
              </button>
              <button
                onClick={() => setNetworkFilter('aljazeera')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all whitespace-nowrap ${
                  networkFilter === 'aljazeera' ? 'bg-[#d4af37] text-[#02040a]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Al Jazeera
              </button>
              <button
                onClick={() => setNetworkFilter('bbc')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all whitespace-nowrap ${
                  networkFilter === 'bbc' ? 'bg-[#d4af37] text-[#02040a]' : 'text-slate-400 hover:text-white'
                }`}
              >
                BBC News
              </button>
              <button
                onClick={() => setNetworkFilter('shorts')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all whitespace-nowrap ${
                  networkFilter === 'shorts' ? 'bg-[#d4af37] text-[#02040a]' : 'text-rose-400 hover:text-white'
                }`}
              >
                ⚡ Mobile Shorts
              </button>
            </div>
          </div>
        </div>

        {/* DEDICATED CITIZEN & SATIRICAL SHORTS (9:16 VERTICAL CAROUSEL) */}
        {networkFilter !== 'aljazeera' && networkFilter !== 'bbc' && citizenShorts.length > 0 && (
          <div className="bg-[#081021]/70 border border-[#172033] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-rose-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  নাগরিক ও ব্যঙ্গাত্মক শর্ট ডিসপ্যাচ (Vertical Mobile Shorts)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{citizenShorts.length} Shorts Online</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {citizenShorts.map((short) => {
                const isPlaying = short.id === currentProgram.id;
                return (
                  <div
                    key={short.id}
                    onClick={() => {
                      onProgramChange(short);
                      // If user clicks short, optionally switch to mobile view or stay in tv view
                    }}
                    className={`rounded-xl p-2 border transition-all cursor-pointer group flex flex-col justify-between ${
                      isPlaying 
                        ? 'bg-[#050814] border-[#d4af37] ring-1 ring-[#d4af37]/40 shadow-lg' 
                        : 'bg-[#050814]/70 border-[#172033] hover:border-slate-500'
                    }`}
                  >
                    <div className="relative aspect-[9/14] rounded-lg overflow-hidden bg-black mb-2">
                      <img
                        src={short.thumbnailUrl}
                        alt={short.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-600 text-white uppercase">
                          SHORTS
                        </span>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5">
                        <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-black/80 text-[#fbbf24]">
                          {short.duration}s
                        </span>
                      </div>
                      {isPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Radio size={16} className="text-red-500 animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-[#fbbf24] block truncate">
                        {short.categoryLabel}
                      </span>
                      <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-tight group-hover:text-[#fbbf24] transition-colors mt-0.5">
                        {short.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Documentary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPlaylist.map((doc, idx) => {
            const isCurrentlyPlaying = doc.id === currentProgram.id;
            return (
              <div
                key={doc.id}
                onClick={() => onProgramChange(doc)}
                className={`group rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrentlyPlaying
                    ? 'bg-[#081021] border-[#d4af37] ring-1 ring-[#d4af37]/40 shadow-xl'
                    : 'bg-[#081021]/60 border-[#172033] hover:border-slate-600 hover:bg-[#081021]'
                }`}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={doc.thumbnailUrl}
                    alt={doc.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Network Watermark Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-white backdrop-blur-sm border border-white/10">
                      {doc.sourceNetwork}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/85 text-[#fbbf24] font-bold">
                      {formatTime(doc.duration || 300)}
                    </span>
                  </div>

                  {/* On Air Indicator */}
                  {isCurrentlyPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-lg animate-pulse">
                        <Radio size={12} />
                        NOW ON AIR
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="text-[#fbbf24] font-semibold">{doc.categoryLabel}</span>
                      <span>#{idx + 1}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#fbbf24] transition-colors">
                      {doc.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#172033] flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[120px]">{doc.location}</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      Tune In <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
