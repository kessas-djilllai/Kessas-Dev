import { motion } from 'motion/react';
import { Mail, Facebook, Phone, Briefcase } from 'lucide-react';
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
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
              hidden: { opacity: 0 }
            }}
            className="flex flex-row justify-center items-center gap-6 sm:gap-8 mb-16 w-full px-4"
          >
            <motion.a 
              variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 30, scale: 0.8 }
              }}
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.facebook.com/djillali.rezkii"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-slate-800 hover:bg-[#1877F2] dark:hover:bg-[#1877F2] border-2 border-slate-200 dark:border-slate-700 hover:border-[#1877F2] dark:hover:border-[#1877F2] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#1877F2]/40"
              aria-label="Facebook"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <Facebook className="w-7 h-7 sm:w-8 sm:h-8 text-[#1877F2] group-hover:text-white transition-colors duration-300 z-10" />
            </motion.a>

            <motion.a 
              variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 30, scale: 0.8 }
              }}
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/213658064184" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-slate-800 hover:bg-[#25D366] dark:hover:bg-[#25D366] border-2 border-slate-200 dark:border-slate-700 hover:border-[#25D366] dark:hover:border-[#25D366] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#25D366]/40"
              aria-label="WhatsApp"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-[#25D366] group-hover:text-white transition-colors duration-300 z-10" />
            </motion.a>

            <motion.a 
              variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 30, scale: 0.8 }
              }}
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:0696666164dj@gmail.com" 
              className="group relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-100 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-900/30 dark:hover:shadow-white/30"
              aria-label="Email"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 dark:via-black/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-slate-800 dark:text-white group-hover:text-white dark:group-hover:text-slate-900 transition-colors duration-300 z-10" />
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
