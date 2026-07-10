import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LayoutContextType {
  isDesktopSidebarOpen: boolean;
  toggleDesktopSidebar: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const value = {
    isDesktopSidebarOpen,
    toggleDesktopSidebar: () => setIsDesktopSidebarOpen(prev => !prev),
    isMobileSidebarOpen,
    toggleMobileSidebar: () => setIsMobileSidebarOpen(prev => !prev),
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};