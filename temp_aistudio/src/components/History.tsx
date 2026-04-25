import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getAuditHistory, SavedAudit } from '../services/geminiService';
import { Clock, ChevronRight, FileText, Trash2 } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState<SavedAudit[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<SavedAudit | null>(null);

  useEffect(() => {
    setHistory(getAuditHistory());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('iota_history');
    setHistory([]);
    setSelectedAudit(null);
  };

  return (
    <div className="flex flex-col gap-12 pt-12">
      <header className="flex justify-between items-end max-w-5xl w-full">
        <div className="max-w-2xl">
          <h1 className="font-hero-display text-6xl font-black mb-6 tracking-tighter uppercase">History & Reports</h1>
          <p className="font-body-lg text-lg text-on-surface-variant">
            A comprehensive archive of all previous fairness intercepts and audited model outputs.
          </p>
        </div>
        <button 
          onClick={clearHistory}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} /> Clear Cache
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl w-full">
        {/* List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="font-hero-display text-[10px] uppercase tracking-widest font-black text-black/30 mb-2">Saved Intercepts</div>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-2">
            {history.length > 0 ? (
              history.map((audit) => (
                <button
                  key={audit.id}
                  onClick={() => setSelectedAudit(audit)}
                  className={`flex items-center justify-between p-6 border transition-all text-left ${
                    selectedAudit?.id === audit.id 
                      ? 'border-black bg-black text-white' 
                      : 'border-black/5 bg-white hover:border-black/20'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-mono text-[9px] uppercase opacity-40 font-bold">{audit.id}</div>
                    <div className="font-hero-display text-xs font-black truncate w-48 uppercase tracking-widest">
                      {audit.originalText.substring(0, 40)}...
                    </div>
                  </div>
                  <ChevronRight size={14} className={selectedAudit?.id === audit.id ? 'opacity-100' : 'opacity-20'} />
                </button>
              ))
            ) : (
              <div className="py-20 text-center border border-dashed border-black/5 text-black/20 flex flex-col items-center gap-4">
                <Clock size={24} />
                <span className="font-hero-display text-[9px] font-black uppercase tracking-widest">No history recorded</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Audit Preview */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedAudit ? (
              <motion.div
                key={selectedAudit.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-12 glass-card border border-black/5 shadow-2xl flex flex-col gap-8"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-[10px] text-black/40 mb-2">{selectedAudit.id} // {new Date(selectedAudit.timestamp).toLocaleDateString()}</div>
                    <h2 className="font-hero-display text-2xl font-black uppercase tracking-tighter">Intercept Snapshot</h2>
                  </div>
                  <div className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${
                    selectedAudit.riskLevel === 'High' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {selectedAudit.riskLevel} Risk
                  </div>
                </div>

                <div className="bg-black/5 p-6 font-body-md text-xs leading-relaxed text-black/60 italic overflow-hidden">
                   "{selectedAudit.originalText}"
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <div className="font-hero-display text-[10px] uppercase font-black text-black/30 mb-4">Audit Conclusion</div>
                    <p className="font-body-md text-sm leading-relaxed text-black/80">{selectedAudit.explanation}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div>
                       <div className="font-hero-display text-[10px] uppercase font-black text-black/30 mb-2">Fairness Score</div>
                       <div className="text-4xl font-black font-hero-display">{selectedAudit.score}</div>
                     </div>
                     <div className="flex flex-col gap-2">
                        {selectedAudit.vectors.slice(0, 2).map((vec, i) => (
                          <div key={i}>
                             <div className="flex justify-between text-[8px] font-black uppercase opacity-40">
                               <span>{vec.category}</span>
                               <span>{Math.round(vec.biasValue * 100)}%</span>
                             </div>
                             <div className="h-0.5 bg-black/5 w-full mt-1">
                                <div className="h-full bg-black" style={{ width: `${vec.biasValue * 100}%` }} />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 font-hero-display font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all">
                  <FileText size={16} /> Export Full Report (.PDF)
                </button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 text-black/5 border border-black/5">
                <FileText size={48} strokeWidth={1} />
                <p className="font-hero-display text-[9px] uppercase tracking-widest font-black mt-4">Select an audit to view telemetry</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
