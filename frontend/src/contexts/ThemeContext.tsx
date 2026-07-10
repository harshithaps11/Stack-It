import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isSystem, setIsSystem] = useState(true);

  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('stackit-theme') as Theme;
    const savedIsSystem = localStorage.getItem('stackit-system') === 'true';
    
    if (savedTheme && !savedIsSystem) {
      setTheme(savedTheme);
      setIsSystem(false);
    } else {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
      setIsSystem(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setIsSystem(false);
    localStorage.setItem('stackit-theme', newTheme);
    localStorage.setItem('stackit-system', 'false');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isSystem }}>
      {children}
    </ThemeContext.Provider>
  );
}; 