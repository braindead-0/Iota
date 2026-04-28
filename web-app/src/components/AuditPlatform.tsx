import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auditTextBias, BiasAuditResult, saveAuditToHistory } from '../services/geminiService';
import { ShieldCheck, AlertTriangle, Send, Loader2, Terminal } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const RISK_COLOR = {
  High:   'text-red-600   bg-red-50   border-red-200',
  Medium: 'text-amber-600 bg-amber-50 border-amber-200',
  Low:    'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export default function AuditPlatform() {
  const { setModelName } = useApp();
  const [input, setInput]   = useState('');
  const [result, setResult] = useState<BiasAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const handleAudit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await auditTextBias(input, 'Independent Auditor');
      setResult(res);
      if (res.modelUsed) setModelName(res.modelUsed);
      saveAuditToHistory(input, res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAudit();
  };

  return (
    <div className="flex flex-col gap-10 pt-10 max-w-5xl mx-auto w-full">
      {/* Header */}
      <header>
        <p className="stat-label mb-3">Independent Auditor</p>
        <h1 className="font-hero-display text-6xl font-black tracking-tighter uppercase mb-4">
          Bias Audit
        </h1>
        <p className="font-body-lg text-base text-on-surface-variant max-w-xl">
          Paste any AI-generated text. IOTA detects bias, assigns a risk level, and suggests a fairer alternative.
        </p>
      </header>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3"
      >
        <div className="relative group">
          <div className="absolute top-5 left-5 text-black/20 group-focus-within:text-black/60 transition-colors pointer-events-none">
            <ShieldCheck size={20} strokeWidth={1.5} />
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste AI-generated text here…"
            rows={5}
            className="w-full pl-14 pr-5 py-5 card rounded-xl outline-none resize-none font-body-lg text-base leading-relaxed focus:ring-2 focus:ring-black/10 transition-all"
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-3">
            <span className="text-[9px] font-mono text-black/20">⌘↵ to run</span>
            {loading ? (
              <div className="flex items-center gap-2 bg-black/5 px-4 py-2 rounded-lg">
                <Loader2 className="animate-spin text-black/50" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40 font-hero-display">Analyzing…</span>
              </div>
            ) : (
              <button
                onClick={handleAudit}
                disabled={!input.trim()}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-hero-display font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 disabled:opacity-30 transition-all"
              >
                Run Audit <Send size={12} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-red-50 border border-red-200 rounded-xl flex gap-4 items-start"
          >
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-hero-display font-black text-red-800 uppercase text-xs mb-1">Backend Error</p>
              <p className="text-red-700 text-sm leading-relaxed">{error}</p>
              <p className="text-red-500 text-xs mt-2">
                Make sure the backend is running: <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono">python backend/main.py</code>
              </p>
            </div>
          </motion.div>
        )}

        {!error && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Score card */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="card rounded-xl p-6 flex flex-col gap-4">
                <p className="stat-label">Fairness Score</p>
                <div className="flex items-end gap-2">
                  <span className="font-hero-display text-6xl font-black tracking-tighter leading-none">{result.score}</span>
                  <span className="text-black/30 font-hero-display text-lg font-black mb-1">/100</span>
                </div>
                {/* Score bar */}
                <div className="score-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${result.score > 70 ? 'bg-emerald-400' : result.score > 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                  />
                </div>
              </div>

              <div className="card rounded-xl p-6 flex flex-col gap-3">
                <p className="stat-label">Risk Level</p>
                <span className={`tag ${result.riskLevel === 'High' ? 'tag-high' : result.riskLevel === 'Medium' ? 'tag-medium' : 'tag-low'}`}>
                  {result.riskLevel} Risk
                </span>
                {result.vectors.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2.5">
                    <p className="stat-label">Bias Signals</p>
                    {result.vectors.slice(0, 3).map((vec, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-black/40 uppercase tracking-wide font-hero-display truncate max-w-[120px]">{vec.category}</span>
                          <span className="text-[9px] font-black text-black/30 font-mono">{(vec.biasValue * 100).toFixed(0)}%</span>
                        </div>
                        <div className="score-bar">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${vec.biasValue * 100}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className={`h-full rounded-full ${vec.biasValue > 0.6 ? 'bg-red-400' : vec.biasValue > 0.3 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main analysis */}
            <div className="lg:col-span-9 flex flex-col gap-4">
              {/* Reasoning */}
              <div className="card rounded-xl p-8 flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute top-6 right-6">
                  {result.riskLevel === 'High'
                    ? <AlertTriangle className="text-red-400" size={22} />
                    : <ShieldCheck className="text-emerald-400" size={22} />}
                </div>
                <div>
                  <p className="stat-label mb-2">Analysis</p>
                  <h3 className="font-hero-display text-2xl font-black tracking-tighter uppercase mb-4">Audit Findings</h3>
                  <p className="font-body-md text-base text-on-surface-variant leading-relaxed max-w-2xl">
                    {result.explanation}
                  </p>
                </div>
              </div>

              {/* Interventions */}
              {result.interventions.length > 0 && (
                <div className="card rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-black/30" />
                    <p className="stat-label">Suggested Alternative</p>
                  </div>
                  {result.interventions.map((step, i) => (
                    <div key={i} className="bg-black/[0.03] rounded-lg p-5 border border-black/5">
                      <p className="font-body-md text-sm leading-relaxed text-black/70">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {!error && !result && !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-48 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-black/5 rounded-xl text-black/15"
          >
            <ShieldCheck size={28} strokeWidth={1} />
            <p className="font-hero-display text-[10px] uppercase tracking-[0.2em] font-black">Paste text above to begin</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
