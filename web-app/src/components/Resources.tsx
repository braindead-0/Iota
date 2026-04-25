import React from 'react';
import { motion } from 'motion/react';
import { Book, Code, Gavel, Shield, Globe, ExternalLink } from 'lucide-react';

export default function Resources() {
  const categories = [
    {
      title: 'Guidelines',
      icon: Book,
      links: ['Ethics Framework', 'Fairness Benchmark v4', 'De-biasing Best Practices']
    },
    {
      title: 'Documentation',
      icon: Code,
      links: ['API Integration Guide', 'Webhook Specs', 'SDK Reference (TS/Python)']
    },
    {
       title: 'Compliance',
       icon: Gavel,
       links: ['EU AI Act Readiness', 'NIST AI Risk Framework', 'Audit Certification']
    }
  ];

  return (
    <div className="flex flex-col gap-24 pt-12">
      <header className="max-w-4xl">
        <h1 className="font-hero-display text-8xl font-black mb-8 tracking-tighter uppercase">Resource Center</h1>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
          Everything you need to implement, audit, and scale ethical AI systems. Standardizing representation across the autonomous ecosystem.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
        {categories.map((cat, i) => (
          <motion.div 
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col gap-8 p-12 bg-white border border-black/5 shadow-sm hover:shadow-2xl transition-all"
          >
            <div className="w-12 h-12 bg-black flex items-center justify-center">
               <cat.icon size={20} className="text-white" />
            </div>
            <h2 className="font-hero-display text-2xl font-black uppercase tracking-tighter">{cat.title}</h2>
            <div className="flex flex-col gap-4">
              {cat.links.map((link) => (
                <a key={link} href="#" className="flex justify-between items-center text-xs font-bold font-body-md text-black/50 hover:text-black transition-colors group">
                  {link}
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-black p-24 max-w-6xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
           <Shield size={300} />
        </div>
        <div className="relative z-10">
          <span className="font-hero-display text-[10px] uppercase tracking-[0.3em] font-black text-white/40 mb-6 block">Join the Ethical Mesh</span>
          <h2 className="font-hero-display text-4xl font-black text-white mb-8 uppercase tracking-tighter max-w-xl">Contribute to the IOTA Open Parity Dataset</h2>
          <button className="bg-white text-black px-12 py-5 font-hero-display font-black uppercase tracking-widest text-[10px] hover:bg-cyan-400 transition-all">
            Join Researcher Portal
          </button>
        </div>
      </section>
    </div>
  );
}
