import { motion } from 'motion/react';
import { ArrowDown, Briefcase, Code, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ThreeDProjectViewer from './ThreeDProjectViewer';

export default function Hero() {
  const { t, language } = useLanguage();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  } as const;
  
  return (
    <section className="relative py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center min-h-[92vh] overflow-hidden">
      {/* Premium Ambient Light Glows */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/10 dark:bg-purple-600/10 rounded-full blur-[130px] -z-10 pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full mt-10 md:mt-16">
        
        {/* Left Side Content - Text and Call to Action */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`lg:col-span-7 flex flex-col justify-center text-center lg:text-start ${
            language === 'ar' ? 'lg:text-right lg:items-start' : 'lg:text-left lg:items-start'
          } items-center w-full`}
        >
          {/* Active status pulse pill with 3D shadow */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 shadow-[0_4px_24px_rgba(37,99,235,0.06)] mb-6 hover:shadow-[0_4px_30px_rgba(37,99,235,0.12)] transition-shadow duration-300"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-350 tracking-tight">
              {t('availableForWork')}
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.15] sm:leading-[1.12]"
          >
            {t('heroTitlePart1')} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 drop-shadow-[0_2px_10px_rgba(99,102,241,0.05)]">
              {t('heroTitlePart2')}
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl leading-relaxed font-medium"
          >
            {t('heroDesc')}
          </motion.p>
          
          {/* Action buttons with subtle 3D hover scale offsets */}
          <motion.div 
            variants={itemVariants}
            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 w-full ${
              language === 'ar' ? 'sm:flex sm:flex-row-reverse sm:flex-wrap' : 'sm:flex sm:flex-row sm:flex-wrap'
            } justify-center lg:justify-start z-10`}
          >
            <motion.a 
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              href="#contact" 
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold border border-transparent shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)] transition-all duration-300"
            >
              <Briefcase className="w-5 h-5 opacity-90" />
              {t('startProject')}
            </motion.a>
            
            <motion.a 
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              href="#portfolio" 
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800"
            >
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
              {t('viewMyWork')}
            </motion.a>

            <motion.a 
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              href="#skills" 
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-300"
            >
              <Code className="w-5 h-5 text-blue-500" />
              {t('browseSkills')} 
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right Side Content - Dynamic 3D Project Interactive Hologram Showcase */}
        <div className="lg:col-span-5 w-full flex items-center justify-center py-6">
          <ThreeDProjectViewer />
        </div>

      </div>
    </section>
  );
}
