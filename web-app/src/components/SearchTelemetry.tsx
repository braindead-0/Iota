import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { auditTextBias, BiasAuditResult, saveAuditToHistory } from '../services/geminiService';

export default function SearchTelemetry() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<BiasAuditResult | null>(null);

  const handleSearchAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await auditTextBias(query);
      setAuditResult(res);
      saveAuditToHistory(query, res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 pt-12">
      <header className="max-w-3xl">
        <h1 className="font-hero-display text-6xl font-black mb-6 tracking-tighter uppercase">Search Telemetry</h1>
        <p className="font-body-lg text-lg text-on-surface-variant">
          Real-time intercept of external search queries. Monitoring representation variance in information retrieval systems.
        </p>
      </header>

      <section className="flex flex-col gap-12">
        <form onSubmit={handleSearchAudit} className="max-w-2xl w-full">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for something (e.g., 'CEO of a company')..."
              className="w-full pl-12 pr-6 py-6 border-b border-black outline-none font-body-lg text-xl tracking-tight transition-all focus:pl-14"
            />
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-black transition-all group-focus-within:translate-x-2" size={24} />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-0 top-1/2 -translate-y-1/2 font-hero-display text-[10px] font-black uppercase tracking-[0.2em] hover:text-indigo-600"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Intercept query'}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {auditResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-12"
            >
              <div className="md:col-span-8 flex flex-col gap-8">
                <div className="p-12 glass-card border-[0.5px] border-black/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    {auditResult.riskLevel === 'High' ? <ShieldAlert className="text-red-500" size={32} /> : auditResult.riskLevel === 'Medium' ? <AlertCircle className="text-yellow-600" size={32} /> : <CheckCircle2 className="text-green-600" size={32} />}
                  </div>
                  
                  <div className="font-hero-display text-xs text-black/40 uppercase tracking-widest font-bold mb-8">Intercept Report</div>
                  <h3 className="font-hero-display text-2xl font-black mb-4 uppercase tracking-tighter">Query Analysis</h3>
                  <p className="font-body-md text-black/70 mb-8 max-w-xl leading-relaxed">
                    {auditResult.explanation}
                  </p>

                  <div className="flex gap-12 pt-8 border-t border-black/5">
                    <div>
                      <div className="text-[10px] uppercase font-black text-black/30 font-hero-display mb-1">Rep. Parity</div>
                      <div className="text-2xl font-black font-hero-display">{(100 - (auditResult.vectors[0]?.biasValue * 100 || 0)).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-black text-black/30 font-hero-display mb-1">Skew Index</div>
                      <div className="text-2xl font-black font-hero-display">{(auditResult.vectors[1]?.biasValue || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="font-hero-display text-xs text-black/40 uppercase tracking-widest font-bold">Search Mitigation Layer</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {auditResult.interventions.map((step, i) => (
                      <div key={i} className="p-6 border border-black/5 hover:border-black/20 transition-colors">
                        <div className="text-[9px] uppercase font-black text-black/30 mb-2 font-hero-display">Layer {i+1}</div>
                        <div className="text-xs font-bold font-body-md text-black/80">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-6">
                <div className="p-8 bg-black text-white">
                  <div className="font-hero-display text-[10px] uppercase tracking-widest mb-6 opacity-40">Vector Mapping</div>
                  <div className="flex flex-col gap-4">
                    {auditResult.vectors.map((vec, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest">
                          <span>{vec.category}</span>
                          <span>{(vec.biasValue * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-1 bg-white/10">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${vec.biasValue * 100}%` }}
                            className={`h-full ${vec.biasValue > 0.5 ? 'bg-red-400' : 'bg-cyan-400'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
