import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Tv, Radio, Clock, ChevronUp, ChevronDown, ListFilter,
  ShieldCheck, Search, Info, HelpCircle, Layers,
  Compass, ArrowLeft, ArrowRight, Star, RotateCcw, RotateCw,
  FastForward, Rewind, Lock, Settings, Database, HardDrive,
  AlertTriangle, CheckCircle2, History, Smartphone, Monitor,
  RefreshCw, PlayCircle, Zap, Sparkles
} from 'lucide-react';
import { BroadcastItem, ContentCategory, TimeshiftPolicy } from '../types/broadcast';
import UniversalVideoPlayer from './UniversalVideoPlayer';

interface TvViewerConsoleProps {
  channels: BroadcastItem[];
  activeChannel: BroadcastItem;
  onSelectChannel: (channel: BroadcastItem) => void;
  onOpenEpgModal: () => void;
  onOpenM3uModal: () => void;
  onOpenGovernanceModal: () => void;
}

const CATEGORY_TABS = [
  { id: 'ALL', label: 'সব চ্যানেল (All)' },
  { id: 'FAVORITES', label: '★ ফেভারিট (Pinned)' },
  { id: 'ENTERTAINMENT', label: 'নাটক ও মেগা সিরিয়াল (Drama)' },
  { id: 'CHILDREN', label: 'বাচ্চাদের কার্টুন (Kids)' },
  { id: 'LIVE_NEWS', label: 'লাইভ নিউজ (Live News)' },
  { id: 'SPORTS', label: 'খেলাধুলা ও ক্রিকেট (Sports)' },
  { id: 'CULTURE', label: 'রান্না ও রেসিপি (Cooking)' },
  { id: 'MUSIC', label: 'গান ও কনসার্ট (Music)' },
  { id: 'RELIGION', label: 'ইসলামিক ও ধর্মীয় (Spiritual)' },
  { id: 'SCIENCE', label: 'বিজ্ঞান ও মহাকাশ (Science)' },
  { id: 'DOCUMENTARY', label: 'প্রকৃতি ও সিনেমা (Movies)' },
  { id: 'COMMUNITY', label: 'প্রবাসী ও কমিউনিটি (Diaspora)' },
];

export default function TvViewerConsole({
  channels,
  activeChannel,
  onSelectChannel,
  onOpenEpgModal,
  onOpenM3uModal,
  onOpenGovernanceModal,
}: TvViewerConsoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Playback & Audio State (Default muted for 100% mobile browser autoplay compliance)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState<boolean>(false);

  // Pinned Favorites persisted in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('open_iptv_favorites');
      return saved ? JSON.parse(saved) : ['ch-channel-i', 'ch-duronto-kids-hd', 'ch-somoy-tv', 'ch-banglar-darpan'];
    } catch {
      return ['ch-channel-i', 'ch-duronto-kids-hd'];
    }
  });

  // Timeshift configuration
  const timeshiftPolicy: TimeshiftPolicy = activeChannel.timeshiftPolicy || {
    allowed: true,
    maxBufferMinutes: 60,
    storagePolicy: 'IN_MEMORY_EPHEMERAL',
    rightsHolderAttribution: 'Standard Community Federation License',
  };

  const isTimeshiftAllowed = timeshiftPolicy.allowed;
  const maxBufferSeconds = (timeshiftPolicy.maxBufferMinutes || 60) * 60;
  const [timeshiftOffset, setTimeshiftOffset] = useState<number>(0);

  // Reset timeshift offset whenever channel changes
  useEffect(() => {
    setTimeshiftOffset(0);
    setIsPlaying(true);
  }, [activeChannel.id]);

  // World Studio Clocks (Dhaka BST & London GMT / New York EST)
  const [timeDhaka, setTimeDhaka] = useState<string>('');
  const [timeLondon, setTimeLondon] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeDhaka(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setTimeLondon(now.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds to -MM:SS
  const formatOffset = (secs: number) => {
    if (secs <= 0) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Timeshift Rewind / Forward handlers
  const handleRewind = (seconds: number) => {
    if (!isTimeshiftAllowed) return;
    setTimeshiftOffset((prev) => Math.min(maxBufferSeconds, prev + seconds));
  };

  const handleForward = (seconds: number) => {
    if (!isTimeshiftAllowed) return;
    setTimeshiftOffset((prev) => Math.max(0, prev - seconds));
  };

  const handleJumpToLive = () => {
    setTimeshiftOffset(0);
    setIsPlaying(true);
  };

  const handleTogglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Channel switching helper (Delta +/- 1)
  const switchChannelByDelta = useCallback((delta: number) => {
    const currentIndex = channels.findIndex((c) => c.id === activeChannel.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + delta + channels.length) % channels.length;
    onSelectChannel(channels[nextIndex]);
  }, [channels, activeChannel, onSelectChannel]);

  // Keyboard navigation shortcuts for 10-foot remote / PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleTogglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleRewind(e.shiftKey ? 30 : 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleForward(e.shiftKey ? 30 : 10);
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          handleJumpToLive();
          break;
        case 'm':
        case 'M':
          handleToggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'ArrowUp':
          e.preventDefault();
          switchChannelByDelta(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          switchChannelByDelta(1);
          break;
        case 'g':
        case 'G':
          e.preventDefault();
          onOpenEpgModal();
          break;
        case 'z':
        case 'Z':
          e.preventDefault();
          setIsDrawerOpen((prev) => !prev);
          break;
        case '?':
          setShowShortcutsHelp((prev) => !prev);
          break;
        case 'Escape':
          setIsDrawerOpen(false);
          setShowShortcutsHelp(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switchChannelByDelta, onOpenEpgModal, isPlaying, isTimeshiftAllowed]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleFavorite = (channelId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId];
      try {
        localStorage.setItem('open_iptv_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filter channels based on selected category and query
  const filteredChannels = channels.filter((c) => {
    const matchesCat = selectedCategory === 'ALL' || 
                       (selectedCategory === 'FAVORITES' && favorites.includes(c.id)) ||
                       c.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
                          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          String(c.channelNumber || '').includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-[#02040a] text-slate-100 flex flex-col select-none overflow-x-hidden ${
        isFullscreen ? 'h-screen w-screen' : 'min-h-[calc(100vh-64px)]'
      }`}
    >
      {/* ============================================================== */}
      {/* 1. UNIVERSAL RESILIENT VIDEO PLAYER (MOBILE-FIRST 16:9 VIEW)    */}
      {/* ============================================================== */}
      <div className="relative w-full aspect-video md:flex-1 md:aspect-auto md:min-h-[460px] max-h-[75vh] bg-black flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
        <UniversalVideoPlayer
          channel={activeChannel}
          isMuted={isMuted}
          isPlaying={isPlaying}
          timeshiftOffset={timeshiftOffset}
          maxBufferSeconds={maxBufferSeconds}
          isTimeshiftAllowed={isTimeshiftAllowed}
          onTogglePlayPause={handleTogglePlayPause}
          onToggleMute={handleToggleMute}
          onRewind={handleRewind}
          onForward={handleForward}
          onJumpToLive={handleJumpToLive}
          onSwitchChannel={switchChannelByDelta}
          onFullscreenToggle={toggleFullscreen}
          isFullscreen={isFullscreen}
        />
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE TOUCH-OPTIMIZED CONTROLS & TIMESHIFT SCRUBBER       */}
      {/* ============================================================== */}
      <div className="bg-[#050814] border-b border-white/10 px-3 sm:px-4 py-2.5 flex flex-col gap-2">
        {/* Scrubber & Live Sync Row */}
        <div className="flex items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
            <span className="font-bold text-white truncate text-xs sm:text-sm">{activeChannel.title}</span>
            <span className="text-slate-500">·</span>
            <span className="text-[#fbbf24] shrink-0 text-[11px] sm:text-xs">{activeChannel.categoryLabel}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {timeshiftOffset > 0 ? (
              <button
                onClick={handleJumpToLive}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[10px] flex items-center gap-1 shrink-0 animate-pulse cursor-pointer shadow-lg"
              >
                <Radio size={11} />
                <span>লাইভ সিঙ্ক (-{formatOffset(timeshiftOffset)})</span>
              </button>
            ) : (
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                ● লাইভ সম্প্রচার
              </span>
            )}
          </div>
        </div>

        {/* Timeshift Scrub Bar */}
        {isTimeshiftAllowed && (
          <div className="relative flex items-center gap-2 pt-0.5">
            <input
              type="range"
              min="0"
              max={maxBufferSeconds}
              step="5"
              value={maxBufferSeconds - timeshiftOffset}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTimeshiftOffset(maxBufferSeconds - val);
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              title="Drag to rewind or forward stream"
            />
            <span className="text-[10px] font-mono text-slate-400 shrink-0 min-w-[42px] text-right">
              {timeshiftOffset === 0 ? 'LIVE' : `-${formatOffset(timeshiftOffset)}`}
            </span>
          </div>
        )}

        {/* Mobile Touch Action Button Row (Minimum 44px Touch Targets) */}
        <div className="flex items-center justify-between gap-1.5 pt-1 overflow-x-auto no-scrollbar">
          {/* Channel Prev */}
          <button
            onClick={() => switchChannelByDelta(-1)}
            className="flex-1 min-w-[50px] py-2.5 bg-slate-900/90 hover:bg-slate-800 active:bg-slate-700 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
            title="Previous Channel (CH -)"
          >
            <ChevronUp size={16} />
            <span className="text-[11px]">CH -</span>
          </button>

          {/* Rewind 10s */}
          <button
            onClick={() => handleRewind(10)}
            disabled={!isTimeshiftAllowed}
            className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 active:bg-slate-700 disabled:opacity-40 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
            title="Rewind 10s"
          >
            <RotateCcw size={15} />
            <span className="text-[11px]">-10s</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={handleTogglePlayPause}
            className="py-2.5 px-5 bg-gradient-to-r from-[#d4af37] to-[#fbbf24] text-black font-extrabold rounded-xl shadow-lg flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            title="Play/Pause"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-black" />}
          </button>

          {/* Forward 10s */}
          <button
            onClick={() => handleForward(10)}
            disabled={!isTimeshiftAllowed || timeshiftOffset === 0}
            className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 active:bg-slate-700 disabled:opacity-40 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
            title="Forward 10s"
          >
            <RotateCw size={15} />
            <span className="text-[11px]">+10s</span>
          </button>

          {/* Channel Next */}
          <button
            onClick={() => switchChannelByDelta(1)}
            className="flex-1 min-w-[50px] py-2.5 bg-slate-900/90 hover:bg-slate-800 active:bg-slate-700 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
            title="Next Channel (CH +)"
          >
            <span className="text-[11px]">CH +</span>
            <ChevronDown size={16} />
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={handleToggleMute}
            className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 active:bg-slate-700 border border-slate-700/60 rounded-xl text-slate-200 flex items-center justify-center cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-400" />}
          </button>

          {/* Channel Drawer Toggle */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer ${
              isDrawerOpen 
                ? 'bg-[#d4af37] text-black font-extrabold' 
                : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-200'
            }`}
            title="All Channels"
          >
            <ListFilter size={16} />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MOBILE THUMB-FRIENDLY CHANNEL STRIP & CATEGORY FILTER       */}
      {/* ============================================================== */}
      <div className="flex-1 bg-[#02040a] p-3 sm:p-4 space-y-4">
        {/* Horizontal Category Pill Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === tab.id 
                  ? 'bg-[#d4af37] text-black font-extrabold shadow-md' 
                  : 'bg-slate-900/80 text-slate-300 border border-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Thumb-Zapper Horizontal Strip for Mobile */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-white flex items-center gap-2">
              <Tv size={14} className="text-[#fbbf24]" />
              <span>তাত্ক্ষণিক চ্যানেল জ্যাপিং ({filteredChannels.length} Feeds)</span>
            </span>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="text-[#fbbf24] hover:underline cursor-pointer"
            >
              সকল চ্যানেল দেখুন ({channels.length}) →
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2">
            {filteredChannels.slice(0, 24).map((c) => {
              const isActive = c.id === activeChannel.id;
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectChannel(c)}
                  className={`w-32 shrink-0 p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-b from-[#d4af37]/25 to-black border-[#d4af37] shadow-xl'
                      : 'bg-slate-900/70 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center mb-1.5 overflow-hidden">
                    {c.logoUrl ? (
                      <img src={c.logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Tv size={16} className={isActive ? 'text-[#fbbf24]' : 'text-slate-400'} />
                    )}
                  </div>
                  <span className={`text-[11px] font-bold truncate w-full ${isActive ? 'text-[#fbbf24]' : 'text-white'}`}>
                    {c.title}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                    CH {c.channelNumber || '00'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel Info & EPG Current Show Card */}
        <div className="bg-[#070b14] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">{activeChannel.title}</span>
              <button
                onClick={() => toggleFavorite(activeChannel.id)}
                className="text-slate-400 hover:text-amber-400 cursor-pointer"
                title="Add to Favorites"
              >
                <Star size={16} className={favorites.includes(activeChannel.id) ? 'fill-amber-400 text-amber-400' : ''} />
              </button>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono">
                ১০০% অটোমেটেড অডিট
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">{activeChannel.description}</p>
            {activeChannel.currentProgramTitle && (
              <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5 pt-1">
                <Radio size={12} className="text-red-400 shrink-0" />
                <span className="text-[#fbbf24]">NOW ON-AIR:</span>
                <span>{activeChannel.currentProgramTitle}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenEpgModal}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers size={14} />
              <span>EPG Guide</span>
            </button>
            <button
              onClick={onOpenM3uModal}
              className="px-3 py-2 bg-gradient-to-r from-[#d4af37] to-[#fbbf24] text-black font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              + Ingest M3U
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. FULL CHANNEL ZAPPING DRAWER                                 */}
      {/* ============================================================== */}
      {isDrawerOpen && (
        <aside 
          aria-label="Channel Zapping Drawer"
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#070b14]/98 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv size={18} className="text-[#fbbf24]" />
              <h2 className="font-bold text-sm text-white">চ্যানেল তালিকা ({filteredChannels.length})</h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="চ্যানেলের নাম বা নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredChannels.map((c) => {
              const isActive = c.id === activeChannel.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectChannel(c);
                    setIsDrawerOpen(false);
                  }}
                  className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#d4af37] text-black font-bold shadow-lg'
                      : 'hover:bg-white/5 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono text-xs opacity-70 w-8 shrink-0">
                      {c.channelNumber || '00'}
                    </span>
                    <div className="truncate">
                      <div className="text-xs truncate">{c.title}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-black/80' : 'text-slate-400'}`}>
                        {c.categoryLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(c.id);
                      }}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star size={14} className={favorites.includes(c.id) ? (isActive ? 'fill-black text-black' : 'fill-amber-400 text-amber-400') : 'opacity-40'} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
}
