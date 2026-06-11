import { motion } from 'motion/react';
import { HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Pricing() {
  const { t } = useLanguage();
  return (
    <section id="pricing" className="py-32 relative overflow-hidden bg-transparent transition-colors">
      {/* Decorative background blurs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-60" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="p-10 md:p-20 rounded-[3rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-[0_30px_90px_-15px_rgba(37,99,235,0.4)] relative overflow-hidden group"
        >
          {/* Animated extra glow inside */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-700"></div>
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl flex items-center justify-center mb-10 border border-white/20 shadow-2xl"
            >
              <HeartHandshake className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">{t('pricingTitle')}</h2>
            <p className="text-xl md:text-2xl text-blue-50 max-w-3xl leading-relaxed mb-12 font-medium opacity-90">
              {t('pricingDesc')}
            </p>
            <motion.a 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              href="#contact" 
              className="px-12 py-5 rounded-2xl bg-white text-indigo-700 font-black text-xl hover:shadow-[0_20px_40px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3"
            >
              {t('requestPricing')}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
