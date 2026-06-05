import { motion } from 'motion/react';
import { ArrowDown, Briefcase, Code, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };
  
  return (
    <section className="relative py-20 md:py-48 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[85vh] overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/20 dark:bg-indigo-600/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center w-full"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.2] sm:leading-[1.15]"
        >
          {t('heroTitlePart1')} <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            {t('heroTitlePart2')}
          </span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl leading-relaxed"
        >
          {t('heroDesc')}
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl justify-center z-10 px-4"
        >
          <motion.a 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#contact" 
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border border-transparent shadow-[0_10px_25px_-5px_rgba(15,23,42,0.15)] transition-all duration-300"
          >
            <Briefcase className="w-5 h-5 opacity-80" />
            {t('startProject')}
          </motion.a>
          
          <motion.a 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#portfolio" 
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800"
          >
            <Star className="w-5 h-5 text-amber-500" />
            {t('viewMyWork')}
          </motion.a>

          <motion.a 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#skills" 
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300"
          >
            <Code className="w-5 h-5 text-blue-500" />
            {t('browseSkills')} 
            <ArrowDown className="w-4 h-4 text-slate-400" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
