import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, Layers, Upload, Crown, Film, Network, 
  Scale, Globe, Menu, X, ArrowUpRight, ShieldCheck,
  CheckCircle2, Volume2, Sparkles, Monitor
} from 'lucide-react';

import { BroadcastItem } from './types/broadcast';
import { INITIAL_BROADCASTS } from './data/initialBroadcasts';
import LivePlayer from './components/LivePlayer';
import ChannelGuide from './components/ChannelGuide';
import UploadPortal from './components/UploadPortal';
import PlayoutManager from './components/PlayoutManager';
import ConstitutionViewer from './components/ConstitutionViewer';
import FederationMatrix from './components/FederationMatrix';
import PublicGovernanceCenter from './components/PublicGovernanceCenter';

type MainTab = 
  | 'live' 
  | 'guide'
  | 'playout' 
  | 'ingest' 
  | 'federation' 
  | 'charter';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('live');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Playout and broadcast state
  const [playlist, setPlaylist] = useState<BroadcastItem[]>(INITIAL_BROADCASTS);
  const [currentProgram, setCurrentProgram] = useState<BroadcastItem>(INITIAL_BROADCASTS[0]);

  // Handle adding citizen uploaded broadcast
  const handleAddBroadcast = (newItem: BroadcastItem) => {
    setPlaylist((prev) => [newItem, ...prev]);
    setCurrentProgram(newItem);
  };

  // Reorder queue
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setPlaylist((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Remove from queue
  const handleRemoveItem = (id: string) => {
    setPlaylist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#02040a] flex flex-col font-sans text-slate-100 overflow-x-hidden selection:bg-[#d4af37] selection:text-[#02040a]">
      {/* ============================================================== */}
      {/* 1. TOP BAR CONTRACT: AMERICAN SOPHISTICATED BROADCAST HEADER   */}
      {/* ============================================================== */}
      <header className="bg-[#050814]/95 backdrop-blur-md border-b border-[#172033] sticky top-0 z-50 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
        {/* Zone 1: Single Brand Lockup with Crown Emblem */}
        <div 
          onClick={() => setActiveTab('live')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-[#996515] via-[#d4af37] to-[#fef08a] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 text-[#02040a] shrink-0 border border-[#fef08a]/60 group-hover:scale-105 transition-transform">
            <Crown size={22} className="stroke-[2.5]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
                BENGAL TV
              </span>
              <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-[#fbbf24] to-[#d4af37] text-[#02040a] font-black uppercase shadow-sm">
                bengaltv.com
              </span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              AMERICAN SATELLITE-GRADE IPTV · OPEN FEDERATION
            </p>
          </div>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links (Zero Pill Clutter) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('live')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'live' 
                ? 'text-[#fbbf24] font-bold border-b-2 border-[#d4af37]' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Live Broadcast
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'guide' 
                ? 'text-[#fbbf24] font-bold border-b-2 border-[#d4af37]' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Channel Guide & Archive
          </button>

          <button
            onClick={() => setActiveTab('playout')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'playout' 
                ? 'text-[#fbbf24] font-bold border-b-2 border-[#d4af37]' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Playout Master ({playlist.length})
          </button>

          <button
            onClick={() => setActiveTab('ingest')}
            className={`transition-colors cursor-pointer py-1 ${
              activeTab === 'ingest' 
                ? 'text-[#fbbf24] font-bold border-b-2 border-[#d4af37]' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Citizen Ingest
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
            Constitution & Governance
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('ingest')}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#fbbf24] to-[#d4af37] text-[#02040a] font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <Upload size={14} />
            <span>Submit Dispatch</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-[#050814] border-b border-[#172033] p-4 space-y-2 z-40 text-sm shadow-2xl"
          >
            <button
              onClick={() => { setActiveTab('live'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${activeTab === 'live' ? 'bg-[#d4af37] text-[#02040a] font-bold' : 'text-slate-300'}`}
            >
              <Radio size={16} />
              <span>Live Broadcast</span>
            </button>
            <button
              onClick={() => { setActiveTab('guide'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${activeTab === 'guide' ? 'bg-[#d4af37] text-[#02040a] font-bold' : 'text-slate-300'}`}
            >
              <Film size={16} />
              <span>Channel Guide & Archive</span>
            </button>
            <button
              onClick={() => { setActiveTab('playout'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${activeTab === 'playout' ? 'bg-[#d4af37] text-[#02040a] font-bold' : 'text-slate-300'}`}
            >
              <Layers size={16} />
              <span>Playout Master ({playlist.length} Editions)</span>
            </button>
            <button
              onClick={() => { setActiveTab('ingest'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${activeTab === 'ingest' ? 'bg-[#d4af37] text-[#02040a] font-bold' : 'text-slate-300'}`}
            >
              <Upload size={16} />
              <span>Citizen Journalism Ingest</span>
            </button>
            <button
              onClick={() => { setActiveTab('federation'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${activeTab === 'federation' ? 'bg-[#d4af37] text-[#02040a] font-bold' : 'text-slate-300'}`}
            >
              <Network size={16} />
              <span>Federation Matrix</span>
            </button>
            <button
              onClick={() => { setActiveTab('charter'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${activeTab === 'charter' ? 'bg-[#d4af37] text-[#02040a] font-bold' : 'text-slate-300'}`}
            >
              <Scale size={16} />
              <span>Constitution & Governance</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 2. MAIN BROADCAST VIEWPORT CONTAINER                           */}
      {/* ============================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 md:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div
              key="live-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LivePlayer
                currentProgram={currentProgram}
                playlist={playlist}
                onProgramChange={(prog) => setCurrentProgram(prog)}
              />
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div
              key="guide-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <ChannelGuide
                playlist={playlist}
                currentProgram={currentProgram}
                onProgramSelect={(prog) => {
                  setCurrentProgram(prog);
                  setActiveTab('live');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'playout' && (
            <motion.div
              key="playout-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-[#050814] border border-[#172033] rounded-2xl p-6 shadow-2xl"
            >
              <PlayoutManager
                playlist={playlist}
                currentProgram={currentProgram}
                onProgramSelect={(item) => {
                  setCurrentProgram(item);
                  setActiveTab('live');
                }}
                onRemoveItem={handleRemoveItem}
                onMoveUp={handleMoveUp}
                onNavigateToUpload={() => setActiveTab('ingest')}
              />
            </motion.div>
          )}

          {activeTab === 'ingest' && (
            <motion.div
              key="ingest-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <UploadPortal
                onAddBroadcast={handleAddBroadcast}
                onNavigateToLive={() => setActiveTab('live')}
              />
            </motion.div>
          )}

          {activeTab === 'federation' && (
            <motion.div
              key="federation-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <FederationMatrix />
            </motion.div>
          )}

          {activeTab === 'charter' && (
            <motion.div
              key="charter-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              <ConstitutionViewer />
              <PublicGovernanceCenter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ============================================================== */}
      {/* 3. AMERICAN SATELLITE NETWORK FOOTER                           */}
      {/* ============================================================== */}
      <footer className="mt-auto border-t border-[#172033] bg-[#050814] px-6 py-5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-extrabold text-white">BENGAL TELEVISION NETWORK</span>
          <span>•</span>
          <span className="text-[#fbbf24] font-mono">bengaltv.com</span>
          <span>•</span>
          <span className="text-slate-300">Open IPTV Sovereign Federation</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>PATRON: ANWAR TARIQ KHAN</span>
          <span>•</span>
          <span>OPERATIONAL LEAD: S. M. HASAN NADIM</span>
          <span>•</span>
          <span className="text-[#fbbf24] font-bold">PERMANENT CROWN OVERLAY</span>
        </div>
      </footer>
    </div>
  );
}
