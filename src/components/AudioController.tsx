import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { ambientSynth } from '../utils/audioSynth';
import { useLanguage } from '../context/LanguageContext';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { language } = useLanguage();
  const initialized = useRef(false);

  // States for embedded audio (music.m4a or music.mp3)
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [isUsingCustom, setIsUsingCustom] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const customAudioUrlRef = useRef<string | null>(null);
  const audioCheckPromise = useRef<Promise<string | null> | null>(null);

  // Helper fallback function to switch to generative music if custom file fails
  const fallbackToSynth = () => {
    setIsUsingCustom(false);
    ambientSynth.start();
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    const checkAndSetAudio = async (): Promise<string | null> => {
      const checkFile = async (url: string): Promise<boolean> => {
        try {
          // Standard GET request is compatible with all CDNs (including Vercel / GitHub Pages)
          const response = await fetch(url, { method: 'GET' });
          if (!response.ok) return false;

          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('text/html')) {
            // It's a 404 SPA fallback redirecting to index.html
            return false;
          }

          const contentLength = response.headers.get('content-length');
          if (contentLength === '0') {
            return false;
          }

          return true;
        } catch (e) {
          console.warn(`File check exception for ${url}:`, e);
          return false;
        }
      };

      // 1. Try preferred music.m4a
      const hasM4a = await checkFile('/music.m4a');
      if (hasM4a) {
        return '/music.m4a';
      }

      // 2. Try fallback music.mp3
      const hasMp3 = await checkFile('/music.mp3');
      if (hasMp3) {
        return '/music.mp3';
      }

      return null;
    };

    audioCheckPromise.current = checkAndSetAudio().then((url) => {
      if (url) {
        setCustomAudioUrl(url);
        customAudioUrlRef.current = url;
        setIsUsingCustom(true);
        audio.src = url;

        // Try playing immediately if browser permissions allow direct autoplay
        audio.play()
          .then(() => {
            setIsPlaying(true);
            initialized.current = true;
          })
          .catch(() => {
            // Blocked by browser browser security - normal behavior
          });
      }
      return url;
    });

    return () => {
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

  // Auto-play as soon as possible on any first interaction (clicks, scrolls, physical keys, touch)
  useEffect(() => {
    const startAudioOnInteraction = () => {
      if (initialized.current) return;
      initialized.current = true;

      const activeUrl = customAudioUrl || customAudioUrlRef.current;

      if (activeUrl && audioRef.current) {
        if (!audioRef.current.src || !audioRef.current.src.includes(activeUrl)) {
          audioRef.current.src = activeUrl;
        }
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.warn("Could not autoplay integrated music:", err);
            fallbackToSynth();
          });
      } else if (audioRef.current) {
        // Fallback or speculative unlocking. The promise might not have answered yet.
        // Try m4a directly within synchronous user gesture
        if (!audioRef.current.src) {
          audioRef.current.src = '/music.m4a';
        }
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.warn("Could not preload speculatively:", err);
            // Re-attempt with mp3
            if (audioRef.current) {
              audioRef.current.src = '/music.mp3';
              audioRef.current.play()
                .then(() => { setIsPlaying(true); })
                .catch(() => { fallbackToSynth(); });
            } else {
              fallbackToSynth();
            }
          });
      } else {
        fallbackToSynth();
      }

      cleanupListeners();
    };

    const cleanupListeners = () => {
      const targets = [window, document, document.body];
      const events = ['click', 'touchstart', 'mousedown', 'pointerdown', 'scroll', 'keydown', 'wheel'];
      
      targets.forEach(target => {
        if (!target) return;
        events.forEach(evt => {
          try {
            target.removeEventListener(evt, startAudioOnInteraction);
          } catch (e) {}
        });
      });
    };

    // Attach listeners to multiple contexts to capture any initial gesture securely
    const targets = [window, document, document.body];
    const events = ['click', 'touchstart', 'mousedown', 'pointerdown', 'scroll', 'keydown', 'wheel'];

    targets.forEach(target => {
      if (!target) return;
      events.forEach(evt => {
        try {
          target.addEventListener(evt, startAudioOnInteraction, { passive: true, once: true });
        } catch (e) {}
      });
    });

    return cleanupListeners;
  }, [isUsingCustom, customAudioUrl]);

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

