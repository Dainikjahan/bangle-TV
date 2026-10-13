import { useState, ChangeEvent } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Tv, Trash2, X, Plus, ShieldCheck } from 'lucide-react';
import { BroadcastItem } from '../types/broadcast';
import { parseM3uContent, validateSafeUrl } from '../utils/m3uParser';

interface M3uXmltvManagerProps {
  onImportChannels: (newChannels: BroadcastItem[]) => void;
  onClose: () => void;
}

export default function M3uXmltvManager({
  onImportChannels,
  onClose,
}: M3uXmltvManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'raw'>('upload');
  const [rawText, setRawText] = useState<string>('');
  const [playlistUrl, setPlaylistUrl] = useState<string>('');
  const [parsedChannels, setParsedChannels] = useState<BroadcastItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Handle local file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMessage('M3U প্লেলিস্ট পার্স ও যাচাই করা হচ্ছে...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = parseM3uContent(content);
      setParsedChannels(res.channels);
      setErrors(res.errors);
      setIsLoading(false);
      setStatusMessage(`${res.channels.length} টি ভ্যালিড চ্যানেল প্রস্তুত হয়েছে।`);
    };
    reader.onerror = () => {
      setErrors(['ফাইল পড়তে ত্রুটি হয়েছে। অনুগ্রহ করে সঠিক টেক্সট ফরম্যাট দিন।']);
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  // Handle URL fetch
  const handleFetchUrl = async () => {
    if (!playlistUrl.trim()) return;
    const validation = validateSafeUrl(playlistUrl);
    if (!validation.valid) {
      setErrors([`অনিরাপদ বা অবৈধ URL: ${validation.reason}`]);
      return;
    }

    setIsLoading(true);
    setStatusMessage('রিমোট M3U প্লেলিস্ট ডাউনলোড ও যাচাই করা হচ্ছে...');
    try {
      const response = await fetch(playlistUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}: প্লেলিস্ট পাওয়া যায়নি`);
      const content = await response.text();
      const res = parseM3uContent(content);
      setParsedChannels(res.channels);
      setErrors(res.errors);
      setStatusMessage(`${res.channels.length} টি ভ্যালিড চ্যানেল লোড হয়েছে।`);
    } catch (err: any) {
      setErrors([`ডাউনলোড ব্যর্থ: ${err.message || 'CORS বা নেটওয়ার্ক সীমাবদ্ধতা'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Raw Text Parse
  const handleParseRaw = () => {
    if (!rawText.trim()) return;
    setIsLoading(true);
    const res = parseM3uContent(rawText);
    setParsedChannels(res.channels);
    setErrors(res.errors);
    setIsLoading(false);
    setStatusMessage(`${res.channels.length} টি ভ্যালিড চ্যানেল শনাক্ত হয়েছে।`);
  };

  // Commit Import
  const handleCommitImport = () => {
    if (parsedChannels.length === 0) return;
    onImportChannels(parsedChannels);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingest-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-4 sm:p-8 animate-in fade-in duration-200"
    >
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col bg-[#070b14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#996515] to-[#fbbf24] flex items-center justify-center text-black font-bold">
              <Upload size={20} />
            </div>
            <div>
              <h2 id="ingest-title" className="text-lg font-bold text-white font-sans flex items-center gap-2">
                M3U / XMLTV Playlist Ingestion Engine
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SSRF SAFE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                কমিউনিটি নোডে নিজস্ব IPTV চ্যানেল ও EPG প্লেলিস্ট ইনজেস্ট করুন · ক্লায়েন্ট-সাইড প্রসেসিং (১০০% ফ্রী টিয়ার)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Ingest Tabs */}
        <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'upload' ? 'bg-[#d4af37] text-black font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Upload File (.m3u / .m3u8)
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'url' ? 'bg-[#d4af37] text-black font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Stream URL Feed
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'raw' ? 'bg-[#d4af37] text-black font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Paste M3U Text
          </button>
        </div>

        {/* Input Area */}
        <div className="p-6 border-b border-white/5">
          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-700 hover:border-[#d4af37] rounded-xl p-8 text-center transition-colors cursor-pointer bg-slate-950/40">
              <input
                type="file"
                accept=".m3u,.m3u8,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="m3u-file-input"
              />
              <label htmlFor="m3u-file-input" className="cursor-pointer flex flex-col items-center">
                <FileText size={36} className="text-[#fbbf24] mb-2" />
                <span className="text-sm font-semibold text-white">Click or Drag & Drop your M3U playlist file here</span>
                <span className="text-xs text-slate-400 mt-1">Supports standard #EXTM3U and #EXTINF formatted playlists</span>
              </label>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/playlist.m3u8"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={handleFetchUrl}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#fbbf24] text-black font-bold rounded-lg text-xs hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Fetching...' : 'Fetch Feed'}
              </button>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-3">
              <textarea
                rows={5}
                placeholder={`#EXTM3U\n#EXTINF:-1 tvg-id="ch1" tvg-name="Channel One" group-title="NEWS",Channel One HD\nhttps://example.com/live/ch1.m3u8`}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={handleParseRaw}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#fbbf24] text-black font-bold rounded-lg text-xs hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Parsing...' : 'Parse Playlist'}
              </button>
            </div>
          )}

          {statusMessage && (
            <div className="mt-3 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{statusMessage}</span>
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-3 p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle size={15} />
                <span>সতর্কবার্তা ও বাদ দেওয়া এন্ট্রি:</span>
              </div>
              {errors.slice(0, 3).map((err, i) => (
                <p key={i} className="text-[11px] text-amber-200/80 font-mono pl-5">{err}</p>
              ))}
            </div>
          )}
        </div>

        {/* Parsed Channels Preview List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Preview Ingest Channels ({parsedChannels.length})
            </h3>
            {parsedChannels.length > 0 && (
              <button
                onClick={() => setParsedChannels([])}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
          </div>

          {parsedChannels.length === 0 ? (
            <div className="p-12 text-center text-slate-600 text-xs font-mono">
              কোনো চ্যানেল লোড করা হয়নি। উপরে ফাইল আপলোড বা URL দিন।
            </div>
          ) : (
            parsedChannels.map((c, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 border border-white/5 rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-black/60 border border-white/10 flex items-center justify-center shrink-0">
                    <Tv size={14} className="text-[#fbbf24]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{c.categoryLabel} · {c.videoUrl.substring(0, 50)}...</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  {c.category}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Commit Action Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>সরাসরি ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত হবে, কোনো রিমোট ডেটাবেসে শেয়ার হবে না।</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCommitImport}
              disabled={parsedChannels.length === 0}
              className="px-5 py-2 bg-gradient-to-r from-[#d4af37] to-[#fbbf24] text-black font-bold rounded-lg text-xs hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer"
            >
              Confirm Import ({parsedChannels.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
