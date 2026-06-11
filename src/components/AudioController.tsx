import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ambientSynth } from '../utils/audioSynth';
import { useLanguage } from '../context/LanguageContext';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { language } = useLanguage();
  const initialized = useRef(false);

  // Auto-play on first general user interaction (essential for crossing browser autoplay blocks)
  useEffect(() => {
    const startAudioOnInteraction = () => {
      if (initialized.current) return;
      
      // Start the synthesizer
      ambientSynth.start();
      setIsPlaying(true);
      initialized.current = true;
      
      // Show elegant toast/notification briefly
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5500);

      // Remove event listeners
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('scroll', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };

    window.addEventListener('click', startAudioOnInteraction, { passive: true });
    window.addEventListener('scroll', startAudioOnInteraction, { passive: true });
    window.addEventListener('keydown', startAudioOnInteraction, { passive: true });
    window.addEventListener('touchstart', startAudioOnInteraction, { passive: true });

    return cleanupListeners;
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    // Prevent bubbled clicks
    e.stopPropagation();
    
    if (isPlaying) {
      ambientSynth.stop();
      setIsPlaying(false);
    } else {
      ambientSynth.start();
      setIsPlaying(true);
      initialized.current = true;
    }
  };

  return (
    <div 
      id="ambient-sound-controller" 
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 pointer-events-none"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-xl border text-xs font-semibold select-none
              ${language === 'ar' ? 'font-sans' : 'font-mono'}
              bg-white/90 border-slate-200/65 text-slate-800 
              dark:bg-slate-900/90 dark:border-slate-800/80 dark:text-slate-100`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>
              {language === 'ar' 
                ? '🔊 تم تشغيل الموسيقى الخلفية المحيطية' 
                : '🔊 Cosmic ambient soundtrack initialized'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controller Toggle Button */}
      <motion.button
        onClick={handleTogglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`pointer-events-auto relative group flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-all duration-500 border backdrop-blur-xl
          ${isPlaying 
            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 dark:text-blue-400 shadow-blue-500/10' 
            : 'bg-slate-100/80 border-slate-300 text-slate-600 hover:text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
        title={language === 'ar' ? 'تشغيل / كتم صوت الكوكب' : 'Toggle Cosmic Soundscape'}
      >
        {/* Living Soundwave Visualizer Bars around the circle */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center gap-[2.5px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="w-[2px] h-4 bg-blue-500/30 rounded-full animate-audio-bar-1" />
            <span className="w-[2px] h-6 bg-cyan-400/30 rounded-full animate-audio-bar-2" />
            <span className="w-[2px] h-8 bg-indigo-500/30 rounded-full animate-audio-bar-3" />
            <span className="w-[2px] h-6 bg-cyan-400/30 rounded-full animate-audio-bar-2" />
            <span className="w-[2px] h-4 bg-blue-500/30 rounded-full animate-audio-bar-1" />
          </div>
        )}

        {/* Dynamic Center Icon */}
        <div className="relative z-10 transition-transform duration-300 group-hover:rotate-6">
          {isPlaying ? (
            <Volume2 className="w-5 h-5 animate-pulse text-blue-500 dark:text-cyan-400" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </div>

        {/* Glow glow */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full bg-blue-500/20 blur-md -z-10 animate-ping duration-1000" />
        )}
      </motion.button>
    </div>
  );
}
