"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useApp } from '@/context/AppContext';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import BiasVectorGrid from '../components/BiasVectorGrid';
import Terminal from '../components/Terminal';
import AuditPlatform from '../components/AuditPlatform';
import SearchTelemetry from '../components/SearchTelemetry';
import History from '../components/History';
import Extension from '../components/Extension';
import { Brain, Scale } from 'lucide-react';

export default function App() {
  const { section, sidebarOpen } = useApp();
  const [liveAudits, setLiveAudits] = useState<any[]>([]);

  useEffect(() => {
    // Real-time listener on Firestore 'reports' collection
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      setLiveAudits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Firestore listener error:", err);
    });
    return () => unsub();
  }, []);

  const biasTriggers = liveAudits.filter(a => (a.risk_gradient || 0) > 0.4 || a.bias_category === 'Overt').length;
  const avgScore = liveAudits.length > 0 ? Math.round(liveAudits.reduce((acc, a) => acc + (a.score || 0), 0) / liveAudits.length) : 0;
  const lastPromptDiff = liveAudits.length >= 2 ? (liveAudits[0].score - liveAudits[1].score).toFixed(1) : "0.0";

  return (
    <div className="relative font-body-md overflow-x-hidden min-h-screen">
      <div className="fixed inset-0 dot-grid pointer-events-none z-0"></div>
      
      <Sidebar />
      <TopNav />

      <motion.main
        animate={{ paddingLeft: sidebarOpen ? 288 : 64 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="relative pb-64 pt-16">
        <div className="max-w-[1440px] mx-auto px-12 relative z-10 w-full">
          <AnimatePresence mode="wait">

            {/* ── LIVE DASHBOARD ── */}
            {section === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <header className="mb-section-gap pt-24">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 mb-4"
                  >
                    <span className="h-[1px] w-12 bg-black"></span>
                    <span className="font-hero-display text-xs uppercase text-black/40 tracking-widest font-bold">
                      Live · Firestore-backed
                    </span>
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-hero-display text-8xl font-black mb-8 tracking-tighter"
                  >
                    Live Dashboard
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-body-lg text-lg text-on-surface-variant max-w-2xl"
                  >
                    Real-time view of all bias audits processed through IOTA. Data is pulled live from Firestore as new audits are submitted.
                  </motion.p>
                </header>

                <div className="grid grid-cols-12 gap-16">
                  <div className="col-span-12 lg:col-span-7 flex flex-col gap-section-gap">
                    <section>
                      <h2 className="font-headline-lg text-5xl mb-12 font-bold tracking-tight">Audit Overview</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="p-12 glass-card border-[0.5px] border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
                        >
                          <div className="font-hero-display text-[10px] text-black/40 mb-2 uppercase tracking-widest font-bold">High-Risk Audits</div>
                          <div className="font-hero-display text-4xl font-bold mb-4">{biasTriggers < 10 ? `0${biasTriggers}` : biasTriggers}</div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                            <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Of last {liveAudits.length} audits</span>
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="p-12 glass-card border-[0.5px] border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
                        >
                          <div className="font-hero-display text-[10px] text-black/40 mb-2 uppercase tracking-widest font-bold">Avg. Fairness Score</div>
                          <div className="font-hero-display text-4xl font-bold mb-4">{avgScore.toFixed(1)}</div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${parseFloat(lastPromptDiff) >= 0 ? 'bg-indigo-500' : 'bg-red-500'}`}></div>
                            <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">{parseFloat(lastPromptDiff) >= 0 ? '+' : ''}{lastPromptDiff} vs last audit</span>
                          </div>
                        </motion.div>
                      </div>
                    </section>
                    <BiasVectorGrid audits={liveAudits} />
                  </div>

                  <div className="col-span-12 lg:col-span-5">
                    <div className="sticky top-40">
                      <div className="flex justify-between items-end mb-12">
                         <h2 className="font-headline-lg text-4xl font-bold leading-tight">Recent Intercepts</h2>
                         <div className="font-hero-display text-xs text-black/40 pb-2 uppercase tracking-widest font-bold">Live</div>
                      </div>
                      <div className="flex flex-col gap-6">
                        {liveAudits.length > 0 ? liveAudits.slice(0, 5).map(audit => (
                          <InterceptCard 
                            key={audit.id}
                            id={audit.id}
                            title={audit.bias_category === "None" ? "Parity Validated" : `${audit.bias_category} Bias`}
                            description={audit.reasoning ? audit.reasoning.slice(0, 120) + '…' : "Analyzing…"}
                            score={audit.score}
                            riskCategory={audit.bias_category}
                            icon={audit.bias_category === 'None' ? Scale : Brain}
                            iconColor={audit.bias_category === 'None' ? "text-cyan-400" : "text-indigo-500"}
                          />
                        )) : (
                          <div className="p-12 text-center border-2 border-dashed border-black/5 text-black/30 font-hero-display text-xs uppercase tracking-widest font-bold">
                            No audits yet — submit text in the Auditor tab
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Terminal audits={liveAudits} />
              </motion.div>
            )}

            {/* ── INDEPENDENT AUDITOR ── */}
            {section === 'auditor' && (
              <motion.div
                key="auditor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-24"
              >
                <AuditPlatform />
              </motion.div>
            )}

            {/* ── AUDIT HISTORY ── */}
            {section === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-24"
              >
                <History />
              </motion.div>
            )}

            {/* ── BROWSER EXTENSION ── */}
            {section === 'extension' && (
              <motion.div
                key="extension"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-24 font-hero-display"
              >
                <Extension />
              </motion.div>
            )}

            {/* ── SEARCH TELEMETRY ── */}
            {section === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-24"
              >
                <SearchTelemetry />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        animate={{ paddingLeft: sidebarOpen ? 288 : 64 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="bg-white border-t-[0.5px] border-black/5 py-16 relative z-10">
        <div className="max-w-[1440px] mx-auto px-12 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img 
              src="/iota-logo.svg" 
              alt="IOTA Logo" 
              className="h-7 w-7 grayscale object-contain"
            />
            <div className="text-base font-bold tracking-tighter text-black uppercase font-hero-display">IOTA</div>
            <span className="text-black/20 mx-2">—</span>
            <span className="text-sm text-black/40 font-body-md">AI Fairness Middleware · v1.0 Prototype</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-black/20 font-bold font-hero-display">
            © 2025 IOTA · Powered by Gemini 1.5 Flash
          </span>
        </div>
      </motion.footer>
    </div>
  );
}

function InterceptCard({ id, title, description, score, riskCategory, icon: Icon, iconColor }: any) {
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className="group p-8 bg-white border-[0.5px] border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500"
    >
      <div className="flex justify-between mb-3">
        <span className="font-mono text-[9px] text-black/30 font-bold">{id}</span>
        <Icon size={16} className={iconColor} strokeWidth={1.5} />
      </div>
      <h3 className="font-hero-display text-base font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-xs text-on-surface-variant mb-4 font-body-md leading-relaxed">{description}</p>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-0.5 bg-black/5">
          <div 
            className={`h-full transition-all duration-700 ${score > 70 ? 'bg-green-400' : score > 40 ? 'bg-yellow-400' : 'bg-red-400'}`} 
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-[9px] font-black font-hero-display text-black/30">{score}/100</span>
      </div>
    </motion.div>
  );
}
