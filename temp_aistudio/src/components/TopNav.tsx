import { motion } from 'motion/react';

export default function TopNav() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 py-6 max-w-[1440px] left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-[40px] border-b-[0.5px] border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida/ADBb0uh9sjRo6y2b30rQ4uW0Mtrx_tdhWh_y6XsfILnEjpLPAco0sRwjomT7-CqkSDOkxEwXiIpfgoHycXXBDfh1nMGAJj17YMuaokHirq-Zj4F33bWM3y4QvFSpnkuESKLeT26dbP_TcMIlhfX5Ny4r6yjsQL8rAuDuJM2wEzj7q697YA5Oo8P5V0WeuR2NK7mvB67Q8rXVIBzX2T9mpDInKd3asfUdOQz1Ah2d7WVqC7Fyn1eRtDqKQMAZk0E57WU3VavEUA6lhgzzTA" 
            alt="IOTA Logo" 
            className="h-8 w-8 grayscale object-contain"
          />
          <div className="text-xl font-bold tracking-tighter text-black uppercase font-hero-display">IOTA</div>
        </div>
        <div className="hidden md:flex gap-8 border-l border-black/5 pl-10">
          <a className="font-hero-display tracking-[0.2em] uppercase text-xs font-light text-black border-b border-black pb-1 transition-opacity duration-300" href="#">AUDITS</a>
          <a className="font-hero-display tracking-[0.2em] uppercase text-xs font-light text-black/40 hover:text-black transition-opacity duration-300" href="#">TERMINAL</a>
          <a className="font-hero-display tracking-[0.2em] uppercase text-xs font-light text-black/40 hover:text-black transition-opacity duration-300" href="#">BIAS VECTORS</a>
          <a className="font-hero-display tracking-[0.2em] uppercase text-xs font-light text-black/40 hover:text-black transition-opacity duration-300" href="#">RESOURCES</a>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <button className="bg-black/5 hover:bg-black hover:text-white border-[0.5px] border-black/10 px-4 py-2 rounded-sm text-[9px] font-bold uppercase tracking-[0.15em] transition-all">
          SYSTEM STATUS: SYNCED
        </button>
      </div>
    </nav>
  );
}
