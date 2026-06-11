import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="py-32 relative overflow-hidden bg-transparent transition-colors">
      {/* Decorative background blurs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-60" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-60" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-16 rounded-[2rem] bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-xl shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {t('pricingTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
            {t('pricingDesc')}
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg shadow-lg active:scale-95 transition-all"
          >
            {t('requestPricing')}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
