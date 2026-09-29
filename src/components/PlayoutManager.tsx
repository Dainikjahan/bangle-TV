import { useState } from 'react';
import { 
  Layers, Radio, Play, ShieldCheck, CheckCircle2, 
  Clock, Server, Zap, Cpu, ArrowUpRight, Repeat, Film,
  ArrowUp, Trash2, Sliders, Check
} from 'lucide-react';
import { BroadcastItem } from '../types/broadcast';

interface PlayoutManagerProps {
  playlist: BroadcastItem[];
  currentProgram: BroadcastItem;
  onProgramSelect: (item: BroadcastItem) => void;
  onRemoveItem: (id: string) => void;
  onMoveUp: (index: number) => void;
  onNavigateToUpload: () => void;
}

export default function PlayoutManager({
  playlist,
  currentProgram,
  onProgramSelect,
  onRemoveItem,
  onMoveUp,
  onNavigateToUpload,
}: PlayoutManagerProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLoopActive, setIsLoopActive] = useState<boolean>(true);

  const filteredItems = playlist.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const currentIndex = playlist.findIndex((p) => p.id === currentProgram.id);
  const nextItem = playlist[(currentIndex + 1) % playlist.length];

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#fbbf24] font-bold text-xs uppercase tracking-widest mb-1.5 font-mono">
            <Radio size={15} className="text-red-500 animate-pulse" />
            <span>Master Control Room · 24/7 Automated Playout Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            স্বয়ংক্রিয় ব্রডকাস্ট প্লেআউট শিডিউল
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            bengaltv.com-এর ২৪/৭ নিরবচ্ছিন্ন ব্রডকাস্ট সিকোয়েন্স এবং আল জাজিরা ও বিবিসির ৩২+ ইনভেস্টিগেটিভ প্রামাণ্যচিত্র ব্যবস্থাপনা।
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="bg-gradient-to-r from-[#fbbf24] to-[#d4af37] text-[#02040a] font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer hover:brightness-110 self-start sm:self-auto"
        >
          <span>নতুন ডিসপ্যাচ যুক্ত করুন</span>
          <ArrowUpRight size={14} />
        </button>
      </header>

      {/* CONTINUOUS DRY-RUN LOOP CONTROLLER BANNER */}
      <div className="bg-[#050814] border border-[#172033] rounded-2xl p-5 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#996515] to-[#d4af37] text-[#02040a] rounded-xl flex items-center justify-center font-bold shadow-lg shadow-[#d4af37]/20 shrink-0">
            <Repeat size={24} className={isLoopActive ? 'animate-spin-slow' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">
                স্বয়ংক্রিয় ২৪/৭ ব্রডকাস্ট লুপ সিকোয়েন্স
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                isLoopActive ? 'bg-emerald-500 text-black font-extrabold animate-pulse' : 'bg-[#081021] text-slate-400'
              }`}>
                {isLoopActive ? 'ONLINE · 24/7 LOOP' : 'MANUAL HOLD'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              বর্তমান অন-এয়ার: <strong className="text-[#fbbf24]">{currentProgram.title}</strong>
              {nextItem && (
                <span className="hidden sm:inline"> • পরবর্তী সম্প্রচার: <span className="text-slate-400">{nextItem.title.slice(0, 40)}...</span></span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            onClick={() => setIsLoopActive(!isLoopActive)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isLoopActive
                ? 'bg-[#d4af37] text-[#02040a] border-[#fef08a] shadow-md'
                : 'bg-[#081021] text-slate-300 border-[#172033] hover:text-white'
            }`}
          >
            {isLoopActive ? 'লুপ সক্রিয় (Auto Loop)' : 'লুপ সক্রিয় করুন'}
          </button>
        </div>
      </div>

      {/* Stream Health & Master Playout Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-[#050814] p-3.5 rounded-xl border border-[#172033]">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">DOMAIN / ORIGIN</span>
          <span className="text-white font-bold text-sm block mt-0.5">bengaltv.com</span>
          <span className="text-emerald-400 text-[10px]">US-EAST-01 (ACTIVE)</span>
        </div>

        <div className="bg-[#050814] p-3.5 rounded-xl border border-[#172033]">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">PLAYOUT ENGINE</span>
          <span className="text-white font-bold text-sm block mt-0.5">HLS / MPEG-DASH</span>
          <span className="text-[#fbbf24] text-[10px]">{playlist.length} Curated Editions</span>
        </div>

        <div className="bg-[#050814] p-3.5 rounded-xl border border-[#172033]">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">OUTPUT ENCODING</span>
          <span className="text-white font-bold text-sm block mt-0.5">1080p60 FHD</span>
          <span className="text-slate-400 text-[10px]">CBR 8.5 Mbps</span>
        </div>

        <div className="bg-[#050814] p-3.5 rounded-xl border border-[#172033]">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">WATERMARK BUG</span>
          <span className="text-[#fbbf24] font-bold text-sm block mt-0.5">PERMANENT CROWN</span>
          <span className="text-emerald-400 text-[10px]">HARDWARE OVERLAY</span>
        </div>
      </div>

      {/* Master Playout Sequence List */}
      <div className="bg-[#050814] border border-[#172033] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-[#172033] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#fbbf24]" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              অন-এয়ার সম্প্রচার সিকোয়েন্স ও কিউ তালিকা ({playlist.length} আইটেম)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {playlist.length} Editions in Rotation
          </span>
        </div>

        <div className="divide-y divide-[#172033]/70">
          {playlist.map((prog, index) => {
            const isPlaying = prog.id === currentProgram.id;
            return (
              <div 
                key={prog.id}
                className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                  isPlaying ? 'bg-[#081021] border-l-4 border-l-[#d4af37]' : 'hover:bg-[#081021]/50'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Sequence Index Number */}
                  <span className="font-mono text-slate-500 w-6 text-center text-[11px] font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Thumbnail snippet */}
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 relative border border-[#172033]">
                    <img 
                      src={prog.thumbnailUrl} 
                      alt="" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center">
                        <Radio size={12} className="text-white animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#fbbf24]">
                        {prog.sourceNetwork}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] text-slate-400">
                        {prog.categoryLabel}
                      </span>
                      {isPlaying && (
                        <span className="bg-red-600 text-white text-[9px] font-mono font-black px-1.5 py-0.2 rounded uppercase">
                          ON AIR
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-white truncate text-xs sm:text-sm">
                      {prog.title}
                    </h4>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0 font-mono text-[11px]">
                  <span className="text-slate-400">
                    {formatDuration(prog.duration || 300)}
                  </span>

                  <button
                    onClick={() => onProgramSelect(prog)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isPlaying 
                        ? 'bg-red-600 text-white font-extrabold shadow-sm' 
                        : 'bg-[#081021] text-slate-300 hover:text-white border border-[#172033] hover:border-slate-500'
                    }`}
                  >
                    {isPlaying ? 'ON-AIR NOW' : 'TUNE IN'}
                  </button>

                  {index > 0 && (
                    <button
                      onClick={() => onMoveUp(index)}
                      className="p-1.5 hover:bg-[#101e3d] rounded text-slate-400 hover:text-white"
                      title="Move up in sequence"
                    >
                      <ArrowUp size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
