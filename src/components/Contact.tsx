import { motion } from 'motion/react';
import { Mail, Github, Linkedin, Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t, language } = useLanguage();
  return (
    <footer id="contact" className="py-24 bg-transparent text-slate-900 dark:text-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-inner cursor-default">
            <Briefcase className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t('contactTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-12 leading-relaxed font-medium">
            {t('contactDesc')}
          </p>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              hidden: { opacity: 0 }
            }}
            className="flex justify-center gap-6 mb-16"
          >
            <motion.a 
              variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 20, scale: 0.8 }
              }}
              href={`mailto:${"0696666164dj@gmail.com"}`} 
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group hover:-translate-y-1 shadow-lg"
              aria-label="Email"
            >
              <Mail className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </motion.a>
            <motion.a 
              variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 20, scale: 0.8 }
              }}
              href="#" 
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group hover:-translate-y-1 shadow-lg"
              aria-label="GitHub"
            >
              <Github className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </motion.a>
            <motion.a 
              variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 20, scale: 0.8 }
              }}
              href="#" 
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group hover:-translate-y-1 shadow-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </motion.a>
          </motion.div>
          
          <div className="w-full h-px bg-slate-200 dark:bg-slate-800/50 mb-8"></div>
          
          <div className={`text-slate-500 text-sm ${language === 'en' ? 'font-sans' : 'font-sans'}`}>
            © {new Date().getFullYear()} {t('rights')}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
