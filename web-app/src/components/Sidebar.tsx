import { motion } from 'motion/react';
import { 
  LayoutDashboard, Scale, EyeOff, Gavel, Cpu, Settings, HelpCircle, 
  Monitor, Terminal as TerminalIcon 
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { id: 'auditor', icon: Scale, label: 'Independent Auditor' },
    { id: 'history', icon: LayoutDashboard, label: 'History & Reports' },
    { id: 'extension', icon: Monitor, label: 'Model A: Extension' },
    { id: 'search', icon: EyeOff, label: 'Search Telemetry' },
    { id: 'terminal', icon: TerminalIcon, label: 'System Terminal' },
    { id: 'resources', icon: HelpCircle, label: 'Resources' },
  ];

  const secondaryItems = [
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Support' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 hidden xl:flex flex-col p-8 gap-12 border-r-[0.5px] border-black/5 z-40 bg-surface">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida/ADBb0uh9sjRo6y2b30rQ4uW0Mtrx_tdhWh_y6XsfILnEjpLPAco0sRwjomT7-CqkSDOkxEwXiIpfgoHycXXBDfh1nMGAJj17YMuaokHirq-Zj4F33bWM3y4QvFSpnkuESKLeT26dbP_TcMIlhfX5Ny4r6yjsQL8rAuDuJM2wEzj7q697YA5Oo8P5V0WeuR2NK7mvB67Q8rXVIBzX2T9mpDInKd3asfUdOQz1Ah2d7WVqC7Fyn1eRtDqKQMAZk0E57WU3VavEUA6lhgzzTA" 
            alt="IOTA Logo" 
            className="h-10 w-10 grayscale object-contain"
          />
          <div className="flex flex-col">
            <div className="text-lg font-black font-hero-display tracking-tight uppercase">IOTA</div>
            <div className="text-[10px] text-black/40 uppercase tracking-widest font-semibold">Status: Auditing</div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => (window as any).setAppSection?.(item.id)}
            className={`flex items-center gap-4 px-4 py-3 rounded-sm transition-all font-hero-display text-sm ${
              (window as any).appSection === item.id 
                ? 'bg-black/5 text-black font-semibold' 
                : 'text-black/50 hover:bg-black/5'
            }`}
          >
            <item.icon size={20} strokeWidth={(window as any).appSection === item.id ? 2.5 : 2} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-2 border-t border-black/5 pt-8">
        {secondaryItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-4 px-4 py-2 text-black/50 hover:bg-black/5 rounded-sm transition-all font-hero-display text-sm"
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
