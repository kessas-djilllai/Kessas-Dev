import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Pricing from './components/Pricing';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import ThreeDWorld from './components/ThreeDWorld';
import AudioController from './components/AudioController';
import { LanguageProvider } from './context/LanguageContext';

function AppContent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Check initial theme and add security measures
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    // Protection: Prevent right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-blue-500/30">
      <ThreeDWorld />
      <div className="relative z-10">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main>
          <Hero />
          <Skills />
          <Portfolio />
          <Pricing />
        </main>

        <Contact />
        <AudioController />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
