import { useState } from 'react';
import { 
  Film, Search, Radio, Clock, User, MapPin, 
  ArrowRight, ShieldCheck, Play, Sparkles, Filter,
  Smartphone, Monitor, Eye, CheckCircle2, Award
} from 'lucide-react';
import { BroadcastItem } from '../types/broadcast';

interface ChannelGuideProps {
  playlist: BroadcastItem[];
  currentProgram: BroadcastItem;
  onProgramSelect: (item: BroadcastItem) => void;
}

export default function ChannelGuide({
  playlist,
  currentProgram,
  onProgramSelect,
}: ChannelGuideProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPlaylist = playlist.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNetwork = 
      selectedNetwork === 'all' ? true :
      selectedNetwork === 'uksoa' ? (item.sourceNetwork?.includes('UK SOA')) :
      selectedNetwork === 'aljazeera' ? (item.sourceNetwork?.includes('Al Jazeera')) :
      selectedNetwork === 'bbc' ? (item.sourceNetwork?.includes('BBC')) :
      selectedNetwork === 'shorts' ? (item.isShort) : true;

    const matchesCategory = 
      selectedCategory === 'all' ? true : item.category === selectedCategory;

    return matchesSearch && matchesNetwork && matchesCategory;
  });

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const citizenShorts = playlist.filter(item => item.isShort);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#050814] border border-[#172033] rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#fbbf24] font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Film size={16} />
              <span>Broadcast EPG · Master Program Guide & Investigative Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              চ্যানেল গাইড ও আন্তর্জাতিক প্রামাণ্যচিত্র সংগ্রহশালা
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              UK SOA Intelligence, Al Jazeera, এবং BBC World Service-এর বাংলাদেশ বিষয়ক আন্তর্জাতিক অনুসন্ধানী প্রামাণ্যচিত্র ও নাগরিক শর্টস ডিসপ্যাচের পূর্ণাঙ্গ আর্কাইভ। যেকোনো প্রতিবেদনে ক্লিক করে সরাসরি অন-এয়ার টিউন ইন করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#081021] border border-[#172033] px-4 py-3 rounded-xl text-center min-w-[130px]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Programs</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{playlist.length} Editions</span>
            </div>
            <div className="bg-[#081021] border border-[#172033] px-4 py-3 rounded-xl text-center min-w-[130px]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Broadcast Quality</span>
              <span className="text-xs font-bold text-emerald-400 mt-1 block">1080p60 FHD</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-5 border-t border-[#172033] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="প্রামাণ্যচিত্রের শিরোনাম, বিষয় বা প্রতিবেদক খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#081021] border border-[#172033] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#fbbf24]"
            />
          </div>

          {/* Network Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-semibold">
            <button
              onClick={() => setSelectedNetwork('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedNetwork === 'all'
                  ? 'bg-[#d4af37] text-[#02040a] font-bold shadow-md'
                  : 'bg-[#081021] text-slate-400 border border-[#172033] hover:text-white'
              }`}
            >
              All Broadcasts ({playlist.length})
            </button>
            <button
              onClick={() => setSelectedNetwork('uksoa')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedNetwork === 'uksoa'
                  ? 'bg-[#d4af37] text-[#02040a] font-bold shadow-md'
                  : 'bg-[#081021] text-[#fbbf24] border border-[#172033] hover:text-white'
              }`}
            >
              ★ UK SOA Intelligence (9)
            </button>
            <button
              onClick={() => setSelectedNetwork('aljazeera')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedNetwork === 'aljazeera'
                  ? 'bg-[#d4af37] text-[#02040a] font-bold shadow-md'
                  : 'bg-[#081021] text-slate-400 border border-[#172033] hover:text-white'
              }`}
            >
              Al Jazeera (16)
            </button>
            <button
              onClick={() => setSelectedNetwork('bbc')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedNetwork === 'bbc'
                  ? 'bg-[#d4af37] text-[#02040a] font-bold shadow-md'
                  : 'bg-[#081021] text-slate-400 border border-[#172033] hover:text-white'
              }`}
            >
              BBC News (16)
            </button>
            <button
              onClick={() => setSelectedNetwork('shorts')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedNetwork === 'shorts'
                  ? 'bg-[#d4af37] text-[#02040a] font-bold shadow-md'
                  : 'bg-[#081021] text-rose-400 border border-[#172033] hover:text-white'
              }`}
            >
              ⚡ Mobile Shorts (4)
            </button>
          </div>
        </div>
      </div>

      {/* Featured Current On-Air Card */}
      <div className="bg-gradient-to-r from-[#081021] via-[#050814] to-[#081021] border border-[#d4af37]/40 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-32 h-20 rounded-xl overflow-hidden bg-slate-900 border border-[#172033] shrink-0 relative">
            <img
              src={currentProgram.thumbnailUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
              <Radio size={18} className="text-white animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-1">
              <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-[10px] uppercase animate-pulse">
                CURRENTLY ON AIR
              </span>
              <span className="text-[#fbbf24] font-bold">{currentProgram.sourceNetwork}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{currentProgram.categoryLabel}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              {currentProgram.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-1">
              {currentProgram.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => onProgramSelect(currentProgram)}
          className="bg-gradient-to-r from-[#fbbf24] to-[#d4af37] text-[#02040a] font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap self-end md:self-center"
        >
          <span>সরাসরি স্টুডিওতে দেখুন</span>
          <ArrowRight size={14} className="inline ml-1" />
        </button>
      </div>

      {/* Vertical Mobile Shorts Row (if not filtered out) */}
      {selectedNetwork !== 'aljazeera' && selectedNetwork !== 'bbc' && citizenShorts.length > 0 && (
        <div className="bg-[#050814] border border-[#172033] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-rose-400" />
              <h2 className="text-base font-bold text-white">
                নাগরিক ও ব্যঙ্গাত্মক শর্ট ডিসপ্যাচ (Vertical Mobile Shorts)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">{citizenShorts.length} Shorts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {citizenShorts.map((short) => (
              <div
                key={short.id}
                onClick={() => onProgramSelect(short)}
                className="bg-[#081021] border border-[#172033] hover:border-[#d4af37] rounded-xl p-3 cursor-pointer group transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[9/14] rounded-lg overflow-hidden bg-black mb-2.5">
                  <img
                    src={short.thumbnailUrl}
                    alt={short.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-600 text-white uppercase">
                      SHORTS
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-[#fbbf24] font-bold">
                      {short.duration}s
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="text-[#fbbf24] font-bold">{short.categoryLabel}</span>
                    <span>{short.sourceNetwork}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#fbbf24] transition-colors">
                    {short.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                    {short.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Broadcast Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film size={18} className="text-[#fbbf24]" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              অন-এয়ার প্রামাণ্যচিত্র ব্রডকাস্ট ক্যাটালগ ({filteredPlaylist.length}টি প্রতিবেদন)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click any program to switch stream
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaylist.map((doc, idx) => {
            const isPlaying = doc.id === currentProgram.id;
            return (
              <div
                key={doc.id}
                onClick={() => onProgramSelect(doc)}
                className={`group rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-[#081021] border-[#d4af37] ring-1 ring-[#d4af37]/50 shadow-2xl'
                    : 'bg-[#050814] border-[#172033] hover:border-slate-500 hover:bg-[#081021]'
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
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/85 text-white backdrop-blur-sm border border-white/10 shadow-md">
                      {doc.sourceNetwork}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/90 text-[#fbbf24] font-bold shadow-md">
                      {formatTime(doc.duration || 300)}
                    </span>
                  </div>

                  {/* Active On-Air Indicator */}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs font-mono font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-xl animate-pulse">
                        <Radio size={14} />
                        NOW ON AIR
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 px-2 py-0.5 rounded text-[10px] font-bold">
                        {doc.categoryLabel}
                      </span>
                      <span className="font-mono text-[10px]">#{idx + 1}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-[#fbbf24] transition-colors mt-2">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#172033] flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                      <MapPin size={12} className="text-[#fbbf24] shrink-0" />
                      <span className="truncate">{doc.location}</span>
                    </div>

                    <button
                      className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        isPlaying
                          ? 'bg-red-600 text-white'
                          : 'bg-[#081021] text-[#fbbf24] group-hover:bg-[#d4af37] group-hover:text-[#02040a]'
                      }`}
                    >
                      <span>{isPlaying ? 'ON-AIR' : 'TUNE IN'}</span>
                      <ArrowRight size={12} />
                    </button>
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
