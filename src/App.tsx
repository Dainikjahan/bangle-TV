import { useState, useEffect } from 'react';
import { 
  Tv, Layers, Upload, Crown, Network, 
  Scale, ShieldCheck, HelpCircle, CheckCircle2,
  FileText, Sparkles, Globe, Cpu, Radio
} from 'lucide-react';

import { BroadcastItem } from './types/broadcast';
import { PRELOADED_IPTV_CHANNELS } from './data/iptvChannels';
import TvViewerConsole from './components/TvViewerConsole';
import EpgGrid from './components/EpgGrid';
import M3uXmltvManager from './components/M3uXmltvManager';
import AiModerationGateway from './components/AiModerationGateway';
import FederationMatrix from './components/FederationMatrix';
import ConstitutionViewer from './components/ConstitutionViewer';
import PublicGovernanceCenter from './components/PublicGovernanceCenter';

type NavigationTab = 
  | 'tv' 
  | 'epg' 
  | 'ingest' 
  | 'ai-gateway' 
  | 'federation' 
  | 'charter';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('tv');
  
  // Channels collection with local storage persistence for imported channels
  const [channels, setChannels] = useState<BroadcastItem[]>(() => {
    try {
      const saved = localStorage.getItem('open_iptv_custom_channels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...PRELOADED_IPTV_CHANNELS, ...parsed];
        }
      }
    } catch {}
    return PRELOADED_IPTV_CHANNELS;
  });

  const [activeChannel, setActiveChannel] = useState<BroadcastItem>(channels[0] || PRELOADED_IPTV_CHANNELS[0]);
  const [isEpgModalOpen, setIsEpgModalOpen] = useState<boolean>(false);
  const [isM3uModalOpen, setIsM3uModalOpen] = useState<boolean>(false);

  // Handle importing new channels from M3U parser
  const handleImportNewChannels = (newChannels: BroadcastItem[]) => {
    setChannels((prev) => {
      const updated = [...newChannels, ...prev];
      try {
        localStorage.setItem('open_iptv_custom_channels', JSON.stringify(newChannels));
      } catch {}
      return updated;
    });
    if (newChannels.length > 0) {
      setActiveChannel(newChannels[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] flex flex-col font-sans text-slate-100 overflow-x-hidden selection:bg-[#d4af37] selection:text-[#02040a]">
      {/* ============================================================== */}
      {/* 1. TOP BAR CONTRACT: STRICT 3-ZONE TELEVISION BROADCAST HEADER */}
      {/* ============================================================== */}
      <header className="bg-[#050814]/95 backdrop-blur-md border-b border-[#172033] sticky top-0 z-50 px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between shadow-2xl gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => setActiveTab('tv')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-[#996515] via-[#d4af37] to-[#fef08a] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 text-[#02040a] shrink-0 border border-[#fef08a]/60 group-hover:scale-105 transition-transform">
            <Crown size={18} className="stroke-[2.5]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                BENGAL TV
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-[#d4af37] text-black font-black uppercase shadow-sm whitespace-nowrap">
                ১০০% অটোমেটেড
              </span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse hidden sm:inline-block" />
            </div>
          </div>
        </div>

        {/* Zone 2: Clean Single-Line Text Navigation Links for Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold whitespace-nowrap">
          <button
            onClick={() => setActiveTab('tv')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'tv' 
                ? 'text-[#fbbf24] font-bold border-b-2 border-[#d4af37]' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            TV Console
          </button>

          <button
            onClick={() => setIsEpgModalOpen(true)}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
          >
            EPG Guide
          </button>

          <button
            onClick={() => setIsM3uModalOpen(true)}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
          >
            M3U Ingest
          </button>

          <button
            onClick={() => setActiveTab('ai-gateway')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'ai-gateway' 
                ? 'text-[#fbbf24] font-bold border-b-2 border-[#d4af37]' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Autonomous AI Gateway
          </button>

          <button
            onClick={() => setActiveTab('federation')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'federation' 
                ? 'text-[#fbbf24] font-bold border-b-2 border-[#d4af37]' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Federation Matrix
          </button>

          <button
            onClick={() => setActiveTab('charter')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'charter' 
                ? 'text-[#fbbf24] font-bold border-b-2 border-[#d4af37]' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Constitution & UK Charter
          </button>
        </nav>

        {/* Zone 3: Primary Action (100% Free Tier Status & Stream Add) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-400">
            <ShieldCheck size={13} />
            <span>0 USD / 1-Yr Free Tier</span>
          </div>

          <button
            onClick={() => setIsM3uModalOpen(true)}
            className="px-3 sm:px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-[#d4af37] to-[#fbbf24] rounded-lg hover:scale-105 transition-transform whitespace-nowrap shadow-md cursor-pointer"
          >
            + Ingest Stream
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN APPLICATION VIEWPORT (WITH MOBILE BOTTOM PADDING)       */}
      {/* ============================================================== */}
      <main className="flex-1 w-full flex flex-col pb-16 lg:pb-0">
        {activeTab === 'tv' && (
          <TvViewerConsole
            channels={channels}
            activeChannel={activeChannel}
            onSelectChannel={(ch) => setActiveChannel(ch)}
            onOpenEpgModal={() => setIsEpgModalOpen(true)}
            onOpenM3uModal={() => setIsM3uModalOpen(true)}
            onOpenGovernanceModal={() => setActiveTab('charter')}
          />
        )}

        {activeTab === 'ai-gateway' && (
          <div className="p-3 sm:p-8">
            <AiModerationGateway />
          </div>
        )}

        {activeTab === 'federation' && (
          <div className="p-3 sm:p-8">
            <FederationMatrix />
          </div>
        )}

        {activeTab === 'charter' && (
          <div className="p-3 sm:p-8 space-y-12">
            <PublicGovernanceCenter />
            <ConstitutionViewer />
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 3. MOBILE THUMB-FRIENDLY BOTTOM NAVIGATION BAR                 */}
      {/* ============================================================== */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 bg-[#050814]/98 backdrop-blur-xl border-t border-white/10 z-40 lg:hidden flex items-center justify-around py-2 px-1 shadow-2xl"
      >
        <button
          onClick={() => setActiveTab('tv')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
            activeTab === 'tv' ? 'text-[#fbbf24]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv size={18} />
          <span>টিভি প্লেয়ার</span>
        </button>

        <button
          onClick={() => setIsEpgModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Layers size={18} />
          <span>EPG গাইড</span>
        </button>

        <button
          onClick={() => setIsM3uModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Upload size={18} />
          <span>M3U যুক্ত</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-gateway')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
            activeTab === 'ai-gateway' ? 'text-[#fbbf24]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu size={18} />
          <span>অটো এআই</span>
        </button>

        <button
          onClick={() => setActiveTab('charter')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
            activeTab === 'charter' ? 'text-[#fbbf24]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale size={18} />
          <span>সংবিধান</span>
        </button>
      </nav>

      {/* ============================================================== */}
      {/* 4. MODALS: EPG TIMELINE & M3U INGESTION                        */}
      {/* ============================================================== */}
      {isEpgModalOpen && (
        <EpgGrid
          channels={channels}
          activeChannel={activeChannel}
          onSelectChannel={(ch) => setActiveChannel(ch)}
          onClose={() => setIsEpgModalOpen(false)}
        />
      )}

      {isM3uModalOpen && (
        <M3uXmltvManager
          onImportChannels={handleImportNewChannels}
          onClose={() => setIsM3uModalOpen(false)}
        />
      )}
    </div>
  );
}
