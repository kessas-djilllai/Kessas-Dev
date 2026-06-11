import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, GraduationCap, ShoppingBag, Terminal, Sparkles, CheckCircle, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ThreeDProjectViewer() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Local card state tracking for responsive tilt
  const [tiltStyle, setTiltStyle] = useState('perspective(1000px) rotateX(12deg) rotateY(-12deg) scale(1)');
  const [glare, setGlare] = useState({ opacity: 0, x: 50, y: 50 });

  useEffect(() => {
    const checkIsMobile = () => {
      const mobileStatus = window.innerWidth < 1024 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      setIsMobile(mobileStatus);
      if (mobileStatus) {
        setTiltStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
      } else {
        setTiltStyle('perspective(1000px) rotateX(12deg) rotateY(-12deg) scale(1)');
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate normalized coords (-0.5 to 0.5)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    // Calculate tilt (max 25 degrees for dynamic look)
    const rotX = -(normY * 22).toFixed(1);
    const rotY = (normX * 22).toFixed(1);
    
    setTiltStyle(`perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`);
    setGlare({
      opacity: 0.3,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    // Reset to idle semi-isometric resting angle
    setTiltStyle('perspective(1500px) rotateX(12deg) rotateY(-12deg) scale(1)');
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
      {/* Dynamic Selector Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-md z-40 relative shadow-sm">
        <button
          onClick={() => setActiveTab(0)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
            activeTab === 0
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'ar' ? 'البحوث' : 'Research'}</span>
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
            activeTab === 1
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'ar' ? 'بكالوريا' : 'Baccalaureate'}</span>
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
            activeTab === 2
              ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'ar' ? 'سوقيفاي' : 'Souqify'}</span>
        </button>
      </div>

      {/* Main 3D Container viewport */}
      <div 
        className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] aspect-[4/5] relative preserve-3d cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: '1200px' }}
      >
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-tr from-slate-200/95 via-white to-slate-100/90 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-950 border-[3px] border-slate-300/60 dark:border-slate-800/80 p-5 sm:p-6 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.3)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] relative transition-transform duration-300 ease-out"
          style={{
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
            transform: tiltStyle,
          }}
        >
          {/* Reflection Glare Overlay */}
          <div 
            className="absolute inset-0 rounded-[3rem] pointer-events-none z-30 mix-blend-overlay transition-opacity duration-2 00"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`
            }}
          />

          {/* Interactive Core Display Base Screen */}
          <div className="w-full h-full bg-slate-50 dark:bg-slate-950/80 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 overflow-hidden relative p-4 flex flex-col justify-between">
            
            {/* Top Indicator / Phone Header Accent */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-900/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-500">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>3D RUNNING</span>
              </div>
              <Terminal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Simulated Middle Hologram Content (renders based on active state) */}
            <div className="w-full h-fit py-4 relative preserve-3d">
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="tab-0"
                    initial={{ opacity: 0, z: -50 }}
                    animate={{ opacity: 1, z: 0 }}
                    exit={{ opacity: 0, z: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    {/* Layer 1: Holographic Pen & Docs floating at Translate Z 50px */}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/5 mb-6 preserve-3d"
                      style={{ transform: isMobile ? 'none' : 'translateZ(50px)' }}
                    >
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
                    </div>

                    {/* Layer 2: Floating Paper stack in Z space */}
                    <div 
                      className="absolute right-4 sm:right-6 top-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-2 sm:p-2.5 rounded-xl shadow-md preserve-3d flex items-center gap-2"
                      style={{ transform: isMobile ? 'rotate(-8deg)' : 'translateZ(90px) rotate(-8deg)' }}
                    >
                      <Sparkles className="w-3 link:w-3.5 h-3 sm:h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="text-[9px] sm:text-[10px] font-black font-sans text-slate-700 dark:text-slate-300">
                        {language === 'ar' ? 'بحث ذكي بنقرة' : 'AI Gen Paper'}
                      </span>
                    </div>

                    {/* Layer 3: Floating check stats */}
                    <div 
                      className="absolute left-4 sm:left-6 bottom-4 bg-blue-50/90 dark:bg-slate-900/90 border border-blue-200/50 dark:border-blue-900/60 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg preserve-3d flex items-center gap-1.5"
                      style={{ transform: isMobile ? 'rotate(5deg)' : 'translateZ(70px) rotate(5deg)' }}
                    >
                      <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-500" />
                      <span className="text-[8px] sm:text-[9px] font-bold text-blue-700 dark:text-blue-300">
                        {language === 'ar' ? 'تنسيق أكاديمي' : 'Structured PDF'}
                      </span>
                    </div>

                    {/* Text Title details */}
                    <h4 className="text-lg font-black text-slate-800 dark:text-white mt-4">
                      {t('project1Title')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 max-w-[250px] mx-auto px-2">
                      {t('project1Desc')}
                    </p>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="tab-1"
                    initial={{ opacity: 0, z: -50 }}
                    animate={{ opacity: 1, z: 0 }}
                    exit={{ opacity: 0, z: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    {/* Layer 1: Graduation cap with high float Translate Z 65px */}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/5 mb-6 preserve-3d"
                      style={{ transform: isMobile ? 'none' : 'translateZ(65px)' }}
                    >
                      <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    {/* Layer 2: Floating score card */}
                    <div 
                      className="absolute right-6 sm:right-10 top-2 bg-emerald-500/95 text-white border-none px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg preserve-3d flex flex-col items-start gap-0.5"
                      style={{ transform: isMobile ? 'rotate(12deg)' : 'translateZ(105px) rotate(12deg)' }}
                    >
                      <span className="text-[7px] sm:text-[8px] font-bold tracking-widest opacity-80 uppercase">SCORE</span>
                      <span className="text-xs sm:text-sm font-black leading-none">20 / 20</span>
                    </div>

                    {/* Layer 3: Subjects ring widget */}
                    <div 
                      className="absolute left-4 sm:left-6 bottom-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-2 sm:p-2.5 rounded-xl shadow-md preserve-3d flex items-center gap-2"
                      style={{ transform: isMobile ? 'rotate(-6deg)' : 'translateZ(80px) rotate(-6deg)' }}
                    >
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
                      <span className="text-[9px] sm:text-[10px] font-black text-slate-700 dark:text-slate-300">
                        {language === 'ar' ? 'جميع المواد مجاناً' : 'All Subjects'}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-slate-800 dark:text-white mt-4">
                      {t('project2Title')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 max-w-[250px] mx-auto px-2">
                      {t('project2Desc')}
                    </p>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="tab-2"
                    initial={{ opacity: 0, z: -50 }}
                    animate={{ opacity: 1, z: 0 }}
                    exit={{ opacity: 0, z: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    {/* Layer 1: Floating Storefront Bag Translate Z 60px */}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-500/5 mb-6 preserve-3d"
                      style={{ transform: isMobile ? 'none' : 'translateZ(60px)' }}
                    >
                      <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 dark:text-orange-400" />
                    </div>

                    {/* Layer 2: Floating e-commerce transaction badge */}
                    <div 
                      className="absolute right-4 top-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-2 rounded-xl shadow-md preserve-3d flex items-center gap-2"
                      style={{ transform: isMobile ? 'rotate(-10deg)' : 'translateZ(95px) rotate(-10deg)' }}
                    >
                      <div className="bg-orange-100 dark:bg-orange-950 p-1 rounded-md">
                        <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-orange-500" />
                      </div>
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-[8px] sm:text-[9px] font-black text-slate-900 dark:text-white">Souqify v1.2</span>
                        <span className="text-[7px] sm:text-[8px] text-emerald-500 font-bold">1-Click Live</span>
                      </div>
                    </div>

                    {/* Layer 3: Active sales graph item */}
                    <div 
                      className="absolute left-4 sm:left-6 bottom-4 bg-slate-950 dark:bg-slate-900 border border-slate-800 text-white rounded-lg p-2 shadow-lg preserve-3d flex flex-col gap-1 items-start min-w-[90px] sm:min-w-[100px]"
                      style={{ transform: isMobile ? 'rotate(4deg)' : 'translateZ(75px) rotate(4deg)' }}
                    >
                      <span className="text-[7px] text-slate-400 font-bold tracking-wider uppercase">Analytics</span>
                      <div className="flex items-end gap-1 h-6 pt-1 w-full">
                        <div className="bg-orange-500 w-2 h-2 rounded-t" />
                        <div className="bg-orange-400 w-2 h-4 rounded-t animate-pulse" />
                        <div className="bg-orange-500 w-2 h-3 rounded-t" />
                        <div className="bg-indigo-500 w-2 h-5 rounded-t" />
                      </div>
                    </div>

                    <h4 className="text-lg font-black text-slate-800 dark:text-white mt-4">
                      {t('project3Title')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 max-w-[250px] mx-auto px-2">
                      {t('project3Desc')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Panel Interactive Control Center */}
            <div 
              className="bg-slate-200/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/60 preserve-3d flex items-center justify-between shadow-inner"
              style={{ transform: isMobile ? 'none' : 'translateZ(40px)' }}
            >
              <div className="flex flex-col items-start justify-center">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 leading-none uppercase">
                  {isMobile ? (language === 'ar' ? 'استعراض' : 'EXPLORE') : 'INTERACT'}
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {isMobile ? 
                    (language === 'ar' ? 'انقر التبويبات في الأعلى للتبديل' : 'Tap tabs above to switch projects') : 
                    (language === 'ar' ? 'حرّك الفأرة للرؤية ثلاثية الأبعاد' : 'Hover over screen to tilt')}
                </span>
              </div>
              <div className="w-7 h-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center shadow-sm">
                <Smartphone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
