import { Moon, Sun, Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const { toggleLanguage, t } = useLanguage();
  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <nav className="glass-panel w-full max-w-5xl rounded-full py-3 px-6 sm:px-8 flex justify-between items-center pointer-events-auto transition-all duration-300 shadow-xl border border-white/40 dark:border-slate-700/50">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 cursor-pointer"
        >
          {t('navTitle')}
        </motion.div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleLanguage} 
            className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 flex items-center justify-center hover:scale-105 active:scale-95"
            title="تبديل اللغة / Toggle Language"
          >
            <Languages className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 flex items-center justify-center hover:scale-105 active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
