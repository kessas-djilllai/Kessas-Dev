import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { language } = useLanguage();
  const initialized = useRef(false);

  // States for embedded audio (music.m4a or music.mp3)
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const customAudioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    const attemptPlay = () => {
      if (initialized.current) return;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            initialized.current = true;
          })
          .catch(err => {
            if (err.name === 'NotAllowedError') {
              // Expected browser block, wait for user gesture quietly
            } else {
              console.warn("Audio play error:", err);
              initialized.current = true;
            }
          });
      }
    };

    // Begin loading preferred audio
    audio.src = '/music.m4a';
    setCustomAudioUrl('/music.m4a');
    customAudioUrlRef.current = '/music.m4a';

    const handleError = () => {
      if (audio.src.includes('.m4a')) {
        // Fallback to mp3
        audio.src = '/music.mp3';
        setCustomAudioUrl('/music.mp3');
        customAudioUrlRef.current = '/music.mp3';
      }
    };

    audio.addEventListener('error', handleError);
    
    // As soon as data is ready, try to play (browsers with autoplay allowed)
    audio.addEventListener('canplay', attemptPlay);
    
    // Also try immediately
    attemptPlay();

    // Attach interaction listeners to broadly capture user gestures for unlocking audio
    const events = ['click', 'touchstart', 'mousedown', 'pointerdown', 'keydown'];
    const cleanupListeners = () => {
      events.forEach(evt => {
        window.removeEventListener(evt, attemptPlay);
        document.removeEventListener(evt, attemptPlay);
      });
    };

    events.forEach(evt => {
      window.addEventListener(evt, attemptPlay, { passive: true });
      document.addEventListener(evt, attemptPlay, { passive: true });
    });

    return () => {
      cleanupListeners();
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', attemptPlay);
      audio.pause();
    };
  }, []);

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

  // Handle toggling play/pause easily with a single button click
  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const activeUrl = customAudioUrl || customAudioUrlRef.current;
    if (activeUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.src || !audioRef.current.src.includes(activeUrl)) {
          audioRef.current.src = activeUrl;
        }
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.warn("Audio play error:", err);
          });
      }
    }
  };

  return (
    <div 
      id="ambient-sound-controller" 
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 pointer-events-none"
    >
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

