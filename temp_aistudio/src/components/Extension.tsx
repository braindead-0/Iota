import React from 'react';
import { motion } from 'motion/react';
import { Download, Monitor, ShieldCheck, Zap, Layers, ExternalLink } from 'lucide-react';

export default function Extension() {
  return (
    <div className="flex flex-col gap-24 pt-12">
      <header className="max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-black flex items-center justify-center">
              <Monitor size={24} className="text-white" />
           </div>
           <span className="font-hero-display text-[10px] uppercase tracking-[0.3em] font-black text-black/30">Deployment Model A</span>
        </div>
        <h1 className="font-hero-display text-8xl font-black mb-8 tracking-tighter uppercase">Extension Dashboard</h1>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
          IOTA Browser & Application Middleware. Real-time intercept for web-based LLMs including ChatGPT, Claude, and Enterprise AI tools.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-16 max-w-6xl">
        {/* Left: Downloads & Install */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-12">
          <section className="p-12 glass-card border-[0.5px] border-black/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 text-black opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Download size={160} />
            </div>
            <h2 className="font-hero-display text-2xl font-black mb-6 uppercase tracking-tighter">Download Extension</h2>
            <p className="text-sm text-black/50 mb-10 leading-relaxed font-body-md">
              Secure the browser-level audit node. Install the IOTA extension to begin real-time parity verification across all web interfaces.
            </p>
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-between w-full p-6 bg-black text-white hover:bg-indigo-600 transition-all font-hero-display text-[10px] font-black uppercase tracking-widest">
                <span>Download for Chrome v4.2</span>
                <Download size={14} />
              </button>
              <button className="flex items-center justify-between w-full p-6 border border-black/10 hover:border-black transition-all font-hero-display text-[10px] font-black uppercase tracking-widest">
                <span>Firefox manifest v3</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-4">
             <div className="font-hero-display text-[10px] uppercase tracking-widest font-black text-black/30">Active Nodes</div>
             <div className="flex flex-col gap-2">
                {['Google Search', 'ChatGPT Enterprise', 'Claude.ai', 'Internal CRM'].map((node) => (
                  <div key={node} className="p-4 bg-black/5 flex justify-between items-center">
                    <span className="text-xs font-bold font-hero-display uppercase tracking-widest">{node}</span>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                       <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">Auditing</span>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Right: Reports & Features */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-16">
          <section>
            <h2 className="font-headline-lg text-4xl font-bold mb-8 tracking-tight">Extension Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportCard 
                title="Browser Leak Audit"
                date="2024-04-24"
                status="No Skew"
                desc="Intercepted output from Google Bard. All 12 demographic markers showed 99%+ parity."
              />
              <ReportCard 
                title="Bias Proxy Intercept"
                date="2024-04-20"
                status="Corrected"
                desc="Detected high socio-economic bias in job recommendation output. Auto-reprompt triggered."
              />
            </div>
          </section>

          <section className="grid grid-cols-3 gap-8 border-t border-black/5 pt-16">
            <Feature icon={ShieldCheck} label="Input Masking" />
            <Feature icon={Zap} label="Latency Optimization" />
            <Feature icon={Layers} label="Multi-Model Support" />
          </section>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, date, status, desc }: any) {
  return (
    <div className="p-8 border border-black/5 bg-white shadow-sm hover:shadow-xl transition-all">
      <div className="flex justify-between items-center mb-6">
         <div className="font-mono text-[9px] opacity-30">{date}</div>
         <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ${status === 'No Skew' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {status}
         </div>
      </div>
      <h3 className="font-hero-display text-lg font-black uppercase tracking-tight mb-3">{title}</h3>
      <p className="text-xs text-black/50 leading-relaxed font-body-md mb-6">{desc}</p>
      <button className="text-[9px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors">View Intercept Log</button>
    </div>
  );
}

function Feature({ icon: Icon, label }: any) {
  return (
    <div className="flex flex-col gap-4">
      <Icon size={20} strokeWidth={1.5} className="text-black/30" />
      <span className="font-hero-display text-[9px] uppercase font-black tracking-widest text-black/60">{label}</span>
    </div>
  );
}
