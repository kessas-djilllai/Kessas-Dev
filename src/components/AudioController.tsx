import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ambientSynth } from '../utils/audioSynth';
import { useLanguage } from '../context/LanguageContext';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const { language } = useLanguage();
  const initialized = useRef(false);

  // States for embedded audio (music.m4a or music.mp3)
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [isUsingCustom, setIsUsingCustom] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const customAudioUrlRef = useRef<string | null>(null);

  // Helper fallback function to switch to generative music if custom file fails
  const fallbackToSynth = () => {
    setIsUsingCustom(false);
    ambientSynth.start();
    setIsPlaying(true);
    setNotificationMsg(
      language === 'ar'
        ? '⚠️ تعذر تشغيل ملف الموسيقى المرفوع (قد يكون فارغاً أو تالفاً). تم تفعيل المعزوفة الفضائية البديلة تلقائياً.'
        : '⚠️ Music file empty or corrupted. Switched to generative spatial synth fallback.'
    );
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 7000);
  };

  // Initialize HTML5 Audio element to check & load m4a/mp3 from the public directory
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    const checkAndSetAudio = async () => {
      // First, check for music.m4a as preferred by user
      try {
        const responseM4a = await fetch('/music.m4a', { method: 'HEAD' });
        const contentTypeM4a = responseM4a.headers.get('content-type') || '';
        const contentLengthM4a = responseM4a.headers.get('content-length');

        // Verify it is not text/html (which happens on SPA fallback 404s) and not a 0-byte placeholder
        if (responseM4a.ok && !contentTypeM4a.includes('text/html') && contentLengthM4a !== '0') {
          setCustomAudioUrl('/music.m4a');
          customAudioUrlRef.current = '/music.m4a';
          setIsUsingCustom(true);
          audio.src = '/music.m4a';
          return;
        }
      } catch (e) {
        console.warn("m4a not found or check failed:", e);
      }

      // Second, try falling back to music.mp3
      try {
        const responseMp3 = await fetch('/music.mp3', { method: 'HEAD' });
        const contentTypeMp3 = responseMp3.headers.get('content-type') || '';
        const contentLengthMp3 = responseMp3.headers.get('content-length');
        if (responseMp3.ok && !contentTypeMp3.includes('text/html') && contentLengthMp3 !== '0') {
          setCustomAudioUrl('/music.mp3');
          customAudioUrlRef.current = '/music.mp3';
          setIsUsingCustom(true);
          audio.src = '/music.mp3';
          return;
        }
      } catch (e) {
        console.warn("mp3 not found or check failed:", e);
      }
    };

    checkAndSetAudio();

    return () => {
      audio.pause();
    };
  }, [language]);

  // Sync state between HTML5 audio element playing state and React state
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('play', handlePlay);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('play', handlePlay);
      }
    };
  }, []);

  // Auto-play as soon as possible on any first interaction (clicks, scrolls, physical keys, touch)
  useEffect(() => {
    const startAudioOnInteraction = () => {
      if (initialized.current) return;
      initialized.current = true;
      
      const activeUrl = customAudioUrl || customAudioUrlRef.current;
      if ((isUsingCustom || activeUrl) && audioRef.current && activeUrl) {
        if (!audioRef.current.src || !audioRef.current.src.includes(activeUrl)) {
          audioRef.current.src = activeUrl;
        }
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setNotificationMsg(
              language === 'ar'
                ? '🔊 تم تشغيل الموسيقى الخلفية المدمجة للموقع'
                : '🔊 Built-in system soundtrack active'
            );
            setShowNotification(true);
            setTimeout(() => {
              setShowNotification(false);
            }, 5000);
          })
          .catch(err => {
            console.warn("Could not autoplay integrated music:", err);
            // Dynamic fallback on any play errors (like empty or unreadable file formats)
            fallbackToSynth();
          });
      } else {
        // Fallback to the beautiful custom synthesizer
        ambientSynth.start();
        setIsPlaying(true);
        
        setNotificationMsg(
          language === 'ar' 
            ? '🌌 تم تشغيل الموسيقى الفضائية التوليدية' 
            : '🌌 Cosmic generative soundscape initialized'
        );
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }

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
  }, [isUsingCustom, customAudioUrl, language]);

  // Handle toggling play/pause easily with a single button click
  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const activeUrl = customAudioUrl || customAudioUrlRef.current;
    if ((isUsingCustom || activeUrl) && audioRef.current && activeUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        ambientSynth.stop();
        if (!audioRef.current.src || !audioRef.current.src.includes(activeUrl)) {
          audioRef.current.src = activeUrl;
        }
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.warn("Audio play error:", err);
            fallbackToSynth();
          });
      }
    } else {
      // Synthesizer mode
      if (isPlaying) {
        ambientSynth.stop();
        setIsPlaying(false);
      } else {
        ambientSynth.start();
        setIsPlaying(true);
        initialized.current = true;
      }
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
            className={`pointer-events-auto flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-semibold select-none max-w-sm
              ${language === 'ar' ? 'font-sans direction-rtl text-right' : 'font-mono text-left'}
              bg-white/95 border-slate-200/90 text-slate-800 
              dark:bg-slate-900/95 dark:border-slate-800/90 dark:text-slate-100`}
          >
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{notificationMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 pointer-events-auto bg-white/50 dark:bg-slate-950/60 p-1.5 rounded-full border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md shadow-lg">
        {/* Play/Pause/Mute Speaker Button */}
        <motion.button
          onClick={handleTogglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative group flex items-center justify-center w-12 h-12 rounded-full shadow-xl transition-all duration-500 border backdrop-blur-xl
            ${isPlaying 
              ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 dark:text-blue-400 shadow-blue-500/10' 
              : 'bg-slate-100/85 border-slate-300 text-slate-600 hover:text-slate-900 dark:bg-slate-900/85 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          title={language === 'ar' ? 'تشغيل / كتم الصوت الموسيقي' : 'Play / Mute sound'}
        >
          {/* Active Soundwave Animation */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-[2.5px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="w-[2px] h-4 bg-blue-500/30 rounded-full animate-audio-bar-1" />
              <span className="w-[2px] h-6 bg-cyan-400/30 rounded-full animate-audio-bar-2" />
              <span className="w-[2px] h-8 bg-indigo-500/30 rounded-full animate-audio-bar-3" />
              <span className="w-[2px] h-6 bg-cyan-400/30 rounded-full animate-audio-bar-2" />
              <span className="w-[2px] h-4 bg-blue-500/30 rounded-full animate-audio-bar-1" />
            </div>
          )}

          {/* Icon - Always standard Speaker / Volume icon */}
          <div className="relative z-10 transition-transform duration-300 group-hover:rotate-6">
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-blue-500 dark:text-cyan-400" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </div>

          {/* Outer glow ring when playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full bg-blue-500/20 blur-md -z-10 animate-ping duration-1000" />
          )}
        </motion.button>
      </div>
    </div>
  );
}

