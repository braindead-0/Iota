import { motion } from 'motion/react';

export default function Terminal() {
  const logs = [
    { type: 'info', text: '> INTERCEPTING LLM OUTPUT...' },
    { type: 'info', text: '> ANALYZING REPRESENTATION...' },
    { type: 'success', text: '> COUNTERFACTUAL TEST: PASSED', success: true },
    { type: 'thought', text: '[AGENT_THOUGHT]: Representation variance detected in prompt suffix. Applying fairness normalization layer to prevent gender skew.', italic: true, muted: true },
    { type: 'info', text: '> GENERATING FAIR ALTERNATIVE...' },
    { type: 'info', text: '> INFERENCE RE-ROUTED. NEXT AUDIT IN 02:00 SEC.' },
  ];

  return (
    <section className="mt-section-gap">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="font-headline-lg text-4xl font-bold">System Logic</h2>
          <p className="text-black/40 mt-2 font-body-md">Real-time inference and agentic decision logs.</p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 glass-card border-[0.5px] border-black/10 shadow-[0_40px_80px_rgba(0,0,0,0.06)]"
        >
          <div className="flex gap-4 mb-8 border-b border-black/5 pb-4">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="ml-auto font-mono text-[10px] text-black/20">AGENT_v4.2.1</span>
          </div>
          <div className="font-mono text-xs leading-relaxed text-black/80">
            {logs.map((log, i) => (
              <div key={i} className={`mb-2 ${log.muted ? 'text-black/40' : ''} ${log.italic ? 'italic' : ''}`}>
                {log.type !== 'thought' && <span className="text-indigo-500 mr-2">&gt;</span>}
                {'success' in log && log.success ? (
                   <span>{log.text.split('PASSED')[0]}<span className="text-green-600 font-bold">PASSED</span></span>
                ) : (
                  log.text
                )}
              </div>
            ))}
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-black/40 align-middle ml-1"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
