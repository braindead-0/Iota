"use client";
import React, { createContext, useContext, useState } from 'react';

export type Section = 'auditor' | 'dashboard' | 'history' | 'extension' | 'search';

interface AppContextValue {
  section: Section;
  setSection: (s: Section) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  modelName: string;
  setModelName: (name: string) => void;
}

const AppContext = createContext<AppContextValue>({
  section: 'auditor',
  setSection: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
  modelName: 'Gemini',
  setModelName: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [section, setSection] = useState<Section>('auditor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelName, setModelName] = useState('Gemini 1.5 Flash');
  const toggleSidebar = () => setSidebarOpen(v => !v);

  return (
    <AppContext.Provider value={{ section, setSection, sidebarOpen, setSidebarOpen, toggleSidebar, modelName, setModelName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
