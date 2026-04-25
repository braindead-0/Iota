import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import BiasVectorGrid from './components/BiasVectorGrid';
import Terminal from './components/Terminal';
import AuditPlatform from './components/AuditPlatform';
import SearchTelemetry from './components/SearchTelemetry';
import History from './components/History';
import Extension from './components/Extension';
import Resources from './components/Resources';
import { Brain, Scale, ChevronDown } from 'lucide-react';

export default function App() {
  const [section, setSection] = useState('auditor');

  useEffect(() => {
    (window as any).appSection = section;
    (window as any).setAppSection = setSection;
  }, [section]);

  return (
    <div className="relative font-body-md overflow-x-hidden min-h-screen">
      <div className="fixed inset-0 dot-grid pointer-events-none z-0"></div>
      
      <Sidebar />
      <TopNav />

      <main className="relative pb-64 xl:pl-80">
        <div className="max-w-[1440px] mx-auto px-12 relative z-10 w-full">
          <AnimatePresence mode="wait">
            {section === 'terminal' && (
              <motion.div
                key="terminal"
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
                      Audit Status: Scanning for Bias
                    </span>
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-hero-display text-8xl font-black mb-8 tracking-tighter"
                  >
                    Terminal: IOTA
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-body-lg text-lg text-on-surface-variant max-w-2xl"
                  >
                    Autonomous fairness auditing and real-time intercept telemetry. Monitor representation matrices, model drift, and counterfactual analysis from a unified AI middleware control center.
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
                          <div className="font-hero-display text-[10px] text-black/40 mb-2 uppercase tracking-widest font-bold">Bias Triggers</div>
                          <div className="font-hero-display text-4xl font-bold mb-4">03</div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                            <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Real-time Mitigation Active</span>
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="p-12 glass-card border-[0.5px] border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
                        >
                          <div className="font-hero-display text-[10px] text-black/40 mb-2 uppercase tracking-widest font-bold">Confidence Score</div>
                          <div className="font-hero-display text-4xl font-bold mb-4">98.4</div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">+0.8% vs Last Prompt</span>
                          </div>
                        </motion.div>
                      </div>
                    </section>
                    <BiasVectorGrid />
                  </div>
                  <div className="col-span-12 lg:col-span-5">
                    <div className="sticky top-40">
                      <div className="flex justify-between items-end mb-12">
                        <h2 className="font-headline-lg text-4xl font-bold leading-tight">Real-time Bias Interception</h2>
                        <div className="font-hero-display text-xs text-black/40 pb-2 uppercase tracking-widest font-bold">Live Stream</div>
                      </div>
                      <div className="flex flex-col gap-6">
                        <InterceptCard 
                          id="AUDIT-AI-9921"
                          title="Neutral Representation"
                          description="Semantic shift detected in gender-coded pronouns. Applied de-biasing mask to output stream."
                          tags={['Corrected', 'Inference']}
                          icon={Brain}
                          iconColor="text-indigo-500"
                        />
                        <InterceptCard 
                          id="AUDIT-AI-9924"
                          title="Parity Validation"
                          description="Counterfactual testing passed for socio-economic variables. Maintaining high confidence interval."
                          tags={['Verified', 'Global']}
                          icon={Scale}
                          iconColor="text-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <section className="mt-section-gap">
                  <div className="relative h-[600px] w-full overflow-hidden border-[0.5px] border-black/5 neural-mesh flex items-center justify-center group">
                    <div className="absolute inset-0 opacity-10 grayscale transition-transform duration-1000 group-hover:scale-110" style={{backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop')"}}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 z-10">
                      <span className="font-hero-display text-xs mb-4 text-black/40 uppercase tracking-widest font-bold">Statistical Visualization</span>
                      <h2 className="font-hero-display text-6xl font-black mb-8 tracking-tighter">Bias Vector Analysis</h2>
                      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-16 h-16 border-[0.5px] border-black flex items-center justify-center rounded-full cursor-pointer hover:bg-black hover:text-white transition-all">
                        <ChevronDown size={24} strokeWidth={1.5} />
                      </motion.div>
                    </div>
                  </div>
                </section>
                <Terminal />
              </motion.div>
            )}

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

            {section === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-24"
              >
                <Resources />
              </motion.div>
            )}
            
            {(section === 'compliance' || section === 'ethics') && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-48 flex flex-col items-center text-center text-black/20"
              >
                <div className="font-hero-display text-8xl font-black mb-4">ACCESS_CLOSED</div>
                <p className="font-hero-display text-xs uppercase tracking-widest font-bold">Authentication level insufficient for {section.toUpperCase()} protocols.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-[0.5px] border-black/5 py-24 relative z-10 lg:pl-80">
        <div className="max-w-[1440px] mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <img 
                src="https://lh3.googleusercontent.com/aida/ADBb0uh9sjRo6y2b30rQ4uW0Mtrx_tdhWh_y6XsfILnEjpLPAco0sRwjomT7-CqkSDOkxEwXiIpfgoHycXXBDfh1nMGAJj17YMuaokHirq-Zj4F33bWM3y4QvFSpnkuESKLeT26dbP_TcMIlhfX5Ny4r6yjsQL8rAuDuJM2wEzj7q697YA5Oo8P5V0WeuR2NK7mvB67Q8rXVIBzX2T9mpDInKd3asfUdOQz1Ah2d7WVqC7Fyn1eRtDqKQMAZk0E57WU3VavEUA6lhgzzTA" 
                alt="IOTA Logo" 
                className="h-8 w-8 grayscale object-contain"
              />
              <div className="text-xl font-bold tracking-tighter text-black uppercase font-hero-display">IOTA</div>
            </div>
            <div className="text-lg font-bold text-black mb-4 uppercase tracking-tighter font-hero-display">
              IOTA: Autonomous Fairness Middleware
            </div>
            <p className="text-black/40 max-w-sm font-body-md text-sm">
              Precision-engineered auditing for the next generation of equitable AI. Ensuring representation and parity in autonomous decision-making systems.
            </p>
          </div>
          <div>
            <h4 className="font-hero-display text-xs uppercase mb-8 tracking-widest font-bold text-black/80">Audits</h4>
            <ul className="flex flex-col gap-4 text-sm text-black/60 font-medium">
              <li><a className="hover:text-black transition-colors" href="#">Bias Logs</a></li>
              <li><a className="hover:text-black transition-colors" href="#">Parity Console</a></li>
              <li><a className="hover:text-black transition-colors" href="#">Fairness Reports</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-hero-display text-xs uppercase mb-8 tracking-widest font-bold text-black/80">System</h4>
            <ul className="flex flex-col gap-4 text-sm text-black/60 font-medium">
              <li><a className="hover:text-black transition-colors" href="#">Compliance Protocol</a></li>
              <li><a className="hover:text-black transition-colors" href="#">Model Governance</a></li>
              <li><a className="hover:text-black transition-colors" href="#">Terminal Access</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-12 mt-24 pt-8 border-t border-black/5 flex flex-col sm:row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-black/20 font-bold">
          <span>© 2024 IOTA: AUTONOMOUS FAIRNESS MIDDLEWARE</span>
          <span className="mt-4 sm:mt-0">Ethical Status: Synchronized</span>
        </div>
      </footer>
    </div>
  );
}

function InterceptCard({ id, title, description, tags, icon: Icon, iconColor }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group p-8 bg-white border-[0.5px] border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500"
    >
      <div className="flex justify-between mb-4">
        <span className="font-mono text-[10px] text-black/40 font-bold">{id}</span>
        <Icon size={18} className={iconColor} strokeWidth={1.5} />
      </div>
      <h3 className="font-hero-display text-xl font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-on-surface-variant mb-6 font-body-md leading-relaxed">{description}</p>
      <div className="flex gap-4">
        {tags.map((tag: string) => (
          <div key={tag} className="px-3 py-1 bg-black/5 font-hero-display text-[10px] uppercase tracking-widest font-bold">
            {tag}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
