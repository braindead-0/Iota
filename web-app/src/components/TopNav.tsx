"use client";
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const SECTION_LABELS: Record<string, string> = {
  auditor:   'Independent Auditor',
  history:   'Audit History',
  search:    'Search Telemetry',
  extension: 'Browser Extension',
  dashboard: 'Live Dashboard',
};

export default function TopNav() {
  const { section, setSection, sidebarOpen, toggleSidebar, modelName } = useApp();
  
  // Format model name for display (remove prefix if Vertex AI)
  const displayModel = modelName.includes('/') 
    ? modelName.split('/').pop()?.toUpperCase() 
    : modelName.toUpperCase();

  return (
    <motion.nav
      animate={{ paddingLeft: sidebarOpen ? 304 : 80 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="fixed top-0 right-0 left-0 z-30 hidden xl:flex items-center justify-between pr-8 py-4 bg-white/90 backdrop-blur-[40px] border-b border-black/5"
    >
      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-md flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 transition-all"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
        <div className="h-4 w-px bg-black/10" />
        <span className="font-hero-display text-xs font-black uppercase tracking-[0.2em] text-black/40">
          {SECTION_LABELS[section] || 'IOTA'}
        </span>
      </div>

      {/* Right: model + status */}
      <div className="flex items-center gap-5">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
        />
        <span className="font-hero-display text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
          {displayModel}
        </span>
        <button
          onClick={() => setSection('auditor')}
          className="ml-2 font-hero-display text-sm font-black tracking-tighter uppercase text-black hover:text-black/50 transition-colors"
        >
          IOTA
        </button>
      </div>
    </motion.nav>
  );
}
