"use client";
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Scale, Clock, Monitor, Search,
  ChevronLeft, ChevronRight, PanelLeftClose
} from 'lucide-react';
import { useApp, Section } from '@/context/AppContext';

export default function Sidebar() {
  const { section, setSection, sidebarOpen, toggleSidebar } = useApp();

  const menuItems: { id: Section; icon: React.ElementType; label: string }[] = [
    { id: 'auditor',   icon: Scale,           label: 'Independent Auditor' },
    { id: 'history',   icon: Clock,           label: 'Audit History'       },
    { id: 'search',    icon: Search,          label: 'Search Telemetry'    },
    { id: 'extension', icon: Monitor,         label: 'Browser Extension'   },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Live Dashboard'      },
  ];

  return (
    <>
      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 288 : 64 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed left-0 top-0 h-screen hidden xl:flex flex-col border-r-[0.5px] border-black/8 z-40 bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-black/5 shrink-0">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5 pl-2"
              >
                <div className="flex flex-col">
                  <span className="text-base font-black font-hero-display tracking-tight uppercase leading-none">IOTA</span>
                  <span className="text-[9px] text-black/30 uppercase tracking-[0.2em] font-bold mt-0.5">Fairness Middleware</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleSidebar}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 transition-all shrink-0 ${!sidebarOpen ? 'mx-auto' : ''}`}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1 p-3 overflow-hidden">
          {menuItems.map((item) => {
            const isActive = section === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setSection(item.id)}
                whileHover={{ x: sidebarOpen ? 3 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group relative ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-black/50 hover:bg-black/5 hover:text-black'
                }`}
              >
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="shrink-0"
                />
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="font-hero-display text-xs font-semibold uppercase tracking-widest whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer status */}
        <div className="shrink-0 p-3 border-t border-black/5">
          <div className={`flex items-center gap-2.5 px-3 py-2 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
            />
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  key="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[9px] uppercase font-bold tracking-widest text-black/30 font-hero-display whitespace-nowrap"
                >
                  Backend · Active
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay toggle (below xl) */}
      <button
        onClick={toggleSidebar}
        className="xl:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-xl"
      >
        <PanelLeftClose size={20} />
      </button>
    </>
  );
}
