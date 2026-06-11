import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronsDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ScrollIndicator() {
  const { language } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = docHeight - winHeight;
      if (scrollable > 0) {
        const pct = (window.scrollY / scrollable) * 100;
        setScrollProgress(pct);
      }

      // Check current active section
      const sections = [
        { id: 'home', top: 0 },
        { id: 'skills', el: document.getElementById('skills') },
        { id: 'portfolio', el: document.getElementById('portfolio') },
        { id: 'pricing', el: document.getElementById('pricing') },
        { id: 'contact', el: document.getElementById('contact') }
      ];

      // Determine active based on element's viewport space
      let currentActive = 'home';
      const triggerOffset = 250; // offset in px for starting a section

      sections.forEach((sec) => {
        if (sec.id === 'home') {
          if (window.scrollY < 150) {
            currentActive = 'home';
          }
        } else if (sec.el) {
          const rect = sec.el.getBoundingClientRect();
          if (rect.top <= triggerOffset) {
            currentActive = sec.id;
          }
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial cycle
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionsList = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', href: '#' },
    { id: 'skills', labelAr: 'المهارات', labelEn: 'Skills', href: '#skills' },
    { id: 'portfolio', labelAr: 'أعمالي', labelEn: 'Portfolio', href: '#portfolio' },
    { id: 'pricing', labelAr: 'الأسعار', labelEn: 'Pricing', href: '#pricing' },
    { id: 'contact', labelAr: 'تواصل معي', labelEn: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) {
        const navbarHeight = 110;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
      {/* Dynamic Progress indicator bar fixed to the top margin */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-200/20 dark:bg-slate-900/40 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500 transition-all duration-100 ease-out shadow-[0_2px_12px_rgba(99,102,241,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Vertical Dots scroll trackers (only on md+ displays for neat aesthetics) */}
      <div 
        dir="ltr" 
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-[45] hidden md:flex flex-col gap-5 items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-3.5 rounded-full border border-slate-200/30 dark:border-slate-800/50 shadow-lg`}
      >
        {sectionsList.map((sec) => {
          const isActive = activeSection === sec.id;
          const label = language === 'ar' ? sec.labelAr : sec.labelEn;
          
          return (
            <a
              key={sec.id}
              href={sec.href}
              onClick={(e) => handleNavClick(e, sec.href)}
              className="relative group flex items-center justify-center w-3 h-3 cursor-pointer"
              title={label}
            >
              {/* Ripple Ring around active node */}
              <AnimatePresence>
                {isActive && (
                  <motion.span 
                    layoutId="activeDotShadow"
                    className="absolute inset-0 rounded-full bg-blue-500/25 dark:bg-blue-400/30 w-7 h-7 -top-2 -left-2"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1.1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  />
                )}
              </AnimatePresence>

              {/* Central micro dot core */}
              <span 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 dark:bg-blue-400 scale-125 shadow-[0_0_8px_rgba(37,99,235,0.8)]' 
                    : 'bg-slate-350 dark:bg-slate-700 group-hover:bg-slate-500 dark:group-hover:bg-slate-400'
                }`}
              />

              {/* Side Floating Text labels on hovering nodes */}
              <div 
                className={`absolute right-7 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 flex items-center`}
              >
                <div className="bg-slate-900/90 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-1 text-[11px] font-black rounded-lg whitespace-nowrap shadow-md border border-slate-800/40 dark:border-white/20 select-none">
                  {label}
                </div>
                <div className="w-1.5 h-1.5 bg-slate-900/90 dark:bg-slate-100 rotate-45 -mr-0.5" />
              </div>
            </a>
          );
        })}
      </div>

      {/* Floating dynamic 'Scroll Down' visual guide in bottom viewport (only visible near the page start) */}
      <AnimatePresence>
        {scrollProgress < 8 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-1 bg-white/70 dark:bg-slate-950/70 py-2.5 px-5 rounded-full border border-slate-100 dark:border-slate-850 backdrop-blur-md shadow-lg"
          >
            <span className="text-[10px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 uppercase leading-none">
              {language === 'ar' ? 'انزل للأسفل للاستكشاف ثلاثي الأبعاد' : 'Scroll down to travel in 3D'}
            </span>
            <div className="relative flex items-center justify-center h-5 w-5 mt-0.5">
              <motion.div
                animate={{ 
                  y: [0, 4, 0],
                  scaleY: [1, 0.85, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ChevronsDown className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-pulse" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
