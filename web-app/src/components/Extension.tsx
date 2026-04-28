import React from 'react';
import { motion } from 'motion/react';
import { Monitor, ShieldCheck, Search, Zap, Package, Info } from 'lucide-react';

export default function Extension() {
  return (
    <div className="flex flex-col gap-24 pt-12">
      <header className="max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
           <img src="/iota-logo.svg" alt="IOTA Logo" className="h-10 w-10 object-contain" />
           <span className="font-hero-display text-[10px] uppercase tracking-[0.3em] font-black text-black/30">Deployment Model A</span>
        </div>
        <h1 className="font-hero-display text-8xl font-black mb-8 tracking-tighter uppercase">Browser Extension</h1>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
          IOTA runs as a Chrome extension that intercepts AI-generated text in real time. The extension reads page content, sends it to the IOTA backend for bias analysis, and surfaces results directly in the browser.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-16 max-w-6xl">
        {/* Left: Install Instructions */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-12">
          <section className="p-12 glass-card border-[0.5px] border-black/10 shadow-2xl relative overflow-hidden">
            <div className="font-hero-display text-[10px] uppercase tracking-widest font-black text-black/30 mb-6">Load as Unpacked Extension</div>
            <h2 className="font-hero-display text-2xl font-black mb-6 uppercase tracking-tighter">Install in Chrome</h2>
            <ol className="flex flex-col gap-4 text-sm font-body-md text-black/60 leading-relaxed list-none">
              {[
                'Open chrome://extensions in your browser',
                'Enable "Developer mode" in the top-right toggle',
                'Click "Load unpacked" and select the chrome-extension/ folder',
                'The IOTA icon will appear in your toolbar',
                'Make sure the backend is running on localhost:8000',
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="font-hero-display text-[10px] font-black text-black/20 mt-1 w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Status */}
          <section className="flex flex-col gap-4">
            <div className="font-hero-display text-[10px] uppercase tracking-widest font-black text-black/30">Extension Permissions</div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Active Tab Access', note: 'reads current page text' },
                { label: 'Storage', note: 'caches last scan result' },
                { label: 'All URLs', note: 'content script injection' },
              ].map((perm) => (
                <div key={perm.label} className="p-4 bg-black/5 flex justify-between items-center">
                  <span className="text-xs font-bold font-hero-display uppercase tracking-widest">{perm.label}</span>
                  <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">{perm.note}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: How It Works */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-16">
          <section>
            <h2 className="font-headline-lg text-4xl font-bold mb-10 tracking-tight">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Search,
                  title: 'Text Interception',
                  desc: 'The content script scans AI-generated output on the active page and extracts the text for analysis.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Bias Analysis',
                  desc: 'Extracted text is sent to the IOTA backend, which runs it through Gemini for multi-layer bias detection.',
                },
                {
                  icon: Monitor,
                  title: 'Popup Report',
                  desc: 'Results appear in the extension popup: fairness score, risk level, bias category, and a fair alternative.',
                },
                {
                  icon: Zap,
                  title: 'Low Latency',
                  desc: 'The scan runs on-demand when you click the extension icon — no continuous background monitoring.',
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  className="p-8 border border-black/5 bg-white shadow-sm hover:shadow-xl transition-all"
                >
                  <item.icon size={20} strokeWidth={1.5} className="text-black/30 mb-4" />
                  <h3 className="font-hero-display text-lg font-black uppercase tracking-tight mb-3">{item.title}</h3>
                  <p className="text-xs text-black/50 leading-relaxed font-body-md">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="p-8 border border-dashed border-black/10 flex gap-4">
            <Info size={16} className="text-black/30 shrink-0 mt-0.5" />
            <p className="text-xs text-black/50 font-body-md leading-relaxed">
              This is a development prototype. The extension is loaded as an unpacked extension and requires the Python backend running locally.
              It is not published to the Chrome Web Store.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
