import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auditTextBias, BiasAuditResult, saveAuditToHistory } from '../services/geminiService';
import { 
  ShieldCheck, AlertTriangle, Info, Send, Loader2, 
  BarChart2, RefreshCw, MessageSquare, Flag, Zap 
} from 'lucide-react';

function ActionIcon({ name }: { name: string }) {
  switch (name) {
    case 'BarChart2': return <BarChart2 size={12} />;
    case 'RefreshCw': return <RefreshCw size={12} />;
    case 'MessageSquare': return <MessageSquare size={12} />;
    case 'Flag': return <Flag size={12} />;
    case 'Zap': return <Zap size={12} />;
    default: return null;
  }
}

export default function AuditPlatform() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<BiasAuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await auditTextBias(input);
      setResult(res);
      saveAuditToHistory(input, res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 pt-12 items-center">
      <header className="max-w-4xl text-center flex flex-col items-center">
        <div className="w-24 h-24 mb-6 border-4 border-black rotate-45 flex items-center justify-center overflow-hidden">
          <div className="rotate-[-45deg] font-hero-display font-black text-4xl">Ai</div>
        </div>
        <h1 className="font-hero-display text-7xl font-black mb-6 tracking-tighter uppercase">Independent Auditor</h1>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
          Model C Deployment: Standalone platform for deep-tissue inspection of AI-generated content. Externalize your fairness verification protocols instantly.
        </p>
      </header>

      <section className="w-full max-w-5xl flex flex-col gap-12">
        {/* Wide Search Bar Style Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="relative group">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
              <ShieldCheck className="text-black/20 group-focus-within:text-black transition-colors" size={24} />
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste AI response here to begin auditing..."
              className="w-full min-h-[120px] max-h-[400px] pl-20 pr-8 py-10 glass-card border-[0.5px] border-black/10 focus:border-black outline-none transition-all font-body-lg text-xl tracking-tight leading-relaxed shadow-[0_40px_100px_rgba(0,0,0,0.04)]"
            />
            <div className="absolute right-8 bottom-8 flex items-center gap-4">
               {loading ? (
                 <Loader2 className="animate-spin text-black" size={24} />
               ) : (
                 <button
                    onClick={handleAudit}
                    disabled={!input.trim()}
                    className="bg-black text-white px-8 py-3 font-hero-display font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-600 disabled:opacity-30 disabled:bg-gray-400 transition-all flex items-center gap-3"
                  >
                    Run Audit <Send size={14} />
                  </button>
               )}
            </div>
          </div>

          {/* Platform Functions (New Buttons) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-2"
          >
            {[
              { icon: 'BarChart2', label: 'Rate Fairness' },
              { icon: 'RefreshCw', label: 'Regenerate' },
              { icon: 'MessageSquare', label: 'Reprompt' },
              { icon: 'Flag', label: 'Flag Concern' },
              { icon: 'Zap', label: 'Highlight Bias' },
            ].map((action) => (
              <button
                key={action.label}
                disabled={!result && !loading}
                className="flex items-center gap-3 px-6 py-3 border-[0.5px] border-black/5 hover:border-black/20 hover:bg-black/5 transition-all font-hero-display text-[9px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {/* Dynamically rendering Lucide icons via string isn't stable in React without a lookup, so I'll use a functional map instead */}
                <ActionIcon name={action.icon} />
                {action.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Results Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-8 flex flex-col gap-8">
                  <div className="p-12 glass-card border-[0.5px] border-black/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12">
                      {result.riskLevel === 'High' ? <AlertTriangle className="text-red-500" size={48} /> : <ShieldCheck className="text-green-500" size={48} />}
                    </div>
                    
                    <div className="font-hero-display text-xs text-black/40 uppercase tracking-widest font-black mb-12">Intercept Detailed Report</div>
                    <div className="flex flex-col gap-6">
                      <h3 className="font-hero-display text-3xl font-black uppercase tracking-tighter">Analysis Findings</h3>
                      <p className="font-body-md text-lg text-black/70 leading-relaxed max-w-xl">
                        {result.explanation}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mt-12 pt-12 border-t border-black/5">
                      {result.vectors.slice(0, 2).map((vec, i) => (
                        <div key={i}>
                          <div className="text-[10px] uppercase font-black text-black/30 font-hero-display mb-2">{vec.category} INDEX</div>
                          <div className="text-3xl font-black font-hero-display">{(vec.biasValue * 100).toFixed(1)}%</div>
                          <div className="w-full h-1 bg-black/5 mt-3">
                             <div className="h-full bg-black transition-all duration-1000" style={{ width: `${vec.biasValue * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="font-hero-display text-xs text-black/40 uppercase tracking-widest font-bold">Standard Mitigation Actions</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.interventions.map((step, i) => (
                        <div key={i} className="p-6 bg-white border border-black/5 hover:border-black/20 transition-all">
                           <div className="font-hero-display text-[9px] font-black text-black/30 mb-2 uppercase">Step {i+1}</div>
                           <div className="text-xs font-bold leading-relaxed">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                  <div className="p-10 bg-black text-white flex flex-col justify-between aspect-square">
                    <div>
                      <div className="font-hero-display text-[10px] uppercase tracking-[0.3em] font-black opacity-40 mb-12">Global Score</div>
                      <div className="text-8xl font-black font-hero-display tracking-tighter">{result.score}</div>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={`w-3 h-3 rounded-full animate-pulse ${result.score > 80 ? 'bg-green-400' : 'bg-red-400'}`} />
                       <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Verified {result.score > 80 ? 'PARITY' : 'SKEW'}</span>
                    </div>
                  </div>

                  <div className="p-10 glass-card border border-black/5">
                     <div className="font-hero-display text-[10px] uppercase tracking-widest font-black text-black/30 mb-8">Risk classification</div>
                     <div className="text-2xl font-black font-hero-display uppercase tracking-widest mb-2">{result.riskLevel}</div>
                     <p className="text-[10px] text-black/40 uppercase font-bold">Priority Level {result.riskLevel === 'High' ? '01' : '02'}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-64 flex flex-col items-center justify-center text-center p-12 text-black/10 border-2 border-dashed border-black/5"
              >
                {!loading && (
                  <div className="flex flex-col items-center gap-4">
                    <ShieldCheck size={32} />
                    <p className="font-hero-display text-xs uppercase tracking-widest font-black">Awaiting Data Ingestion</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
