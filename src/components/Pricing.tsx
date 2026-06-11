import { motion } from 'motion/react';
import { HeartHandshake, Sparkles, Check, Zap, Code, ShieldCheck, Coins, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Pricing() {
  const { t, language } = useLanguage();

  const perks = [
    {
      ar: "سعر مرن ومناسب لجميع الميزانيات وقابل للتفاوض",
      en: "Flexible, budget-friendly and fully negotiable rates"
    },
    {
      ar: "كود مصدري نظيف وموثق بالكامل للتطبيقات والمواقع",
      en: "Clean, fully-documented and robust source code"
    },
    {
      ar: "تصاميم عصرية متجاوبة ومتوافقة تماماً مع جميع الأجهزة",
      en: "Fully responsive modern designs matching all displays"
    },
    {
      ar: "استضافة مجانية ودعم فني مستمر لتحديث وحل المشاكل",
      en: "Free deployment setup & ongoing post-launch technical support"
    },
    {
      ar: "تسليم سريع وتحديثات دورية مباشرة خلال فترة العمل",
      en: "High-speed delivery with continuous iterative updates"
    }
  ];

  const valueCards = [
    {
      icon: <Coins className="w-6 h-6 text-emerald-400" />,
      titleAr: "باقات مرنة",
      titleEn: "Flexible Budget",
      descAr: "أسعار تنافسية للغاية تناسب الشركات الناشئة والأشخاص",
      descEn: "Extremely competitive packages tailored for startups & individuals"
    },
    {
      icon: <Code className="w-6 h-6 text-blue-400" />,
      titleAr: "جودة احترافية",
      titleEn: "Crafted Code",
      descAr: "برمجة بكود منظم وقابل للتطوير دون أي تنازلات",
      descEn: "Structured, clean, and scalable code with no performance compromises"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      titleAr: "دعم مستمر",
      titleEn: "Reliable Support",
      descAr: "مواكبة دائمة لمشروعك لمساعدتك في النجاح والاستمرار",
      descEn: "Long-term partnership to ensure your app stays updated and running smoothly"
    }
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden transition-colors">
      {/* Absolute decorative gradient highlights */}
      <div className="absolute top-1/4 left-1/10 w-[450px] h-[450px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[130px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{language === 'ar' ? 'العروض والدعم مالي' : 'Flexible Packages'}</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            {t('pricingTitle')}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t('pricingDesc')}
          </motion.p>
        </div>

        {/* Dynamic Multi-Section Pricing Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative rounded-[2.5rem] bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl overflow-hidden"
        >
          {/* Internal premium background pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/5 via-indigo-500/0 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
            
            {/* Column 1: Feature Lists & Details (7 cols) */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/50 dark:border-slate-800/80">
              
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-500/10 dark:bg-blue-400/10 rounded-2xl">
                    <HeartHandshake className="w-8 h-8 text-blue-600 dark:text-blue-450" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                      {language === 'ar' ? 'مزايا التعامل والضمانات' : 'Partnership Guarantees'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ar' ? 'رحلة مريحة وموثوقة من البداية وحتى الإطلاق' : 'Comfortable and reliable journey from day one'}
                    </p>
                  </div>
                </div>

                {/* Checklist list */}
                <div className="space-y-4">
                  {perks.map((perk, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: language === 'ar' ? 15 : -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-start gap-3.5"
                    >
                      <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/10 flex items-center justify-center border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base">
                        {language === 'ar' ? perk.ar : perk.en}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mini trust text */}
              <div className="mt-12 pt-6 border-t border-slate-150 dark:border-slate-800/50 flex flex-wrap items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {language === 'ar' ? 'جاهز لاستقبال مشاريع مخصصة وصغيرة وبأسعار ممتازة' : 'Ready for custom requests, startup-friendly deals'}
                </span>
              </div>

            </div>

            {/* Column 2: Elegant Premium Offering Card Form (5 cols) */}
            <div className="lg:col-span-5 p-8 md:p-12 lg:p-14 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between relative">
              
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-violet-500/0 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black mb-6">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'عرض خاص ومرن' : 'Special Support Offer'}</span>
                </div>

                <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {language === 'ar' ? 'التسعير التكاملي المميز' : 'Interactive Quote'}
                </h4>
                
                <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  {language === 'ar' 
                    ? 'لا تشيل هم الميزانية، كل فكرة تستحق النجاح. تواصل معي مباشرة ونتفق على السعر والآلية المناسبة لظروفك.' 
                    : 'Do not let budget hold you back. Every great idea deserves to succeed. Let us design a budget blueprint that works for you.'}
                </p>

                {/* Decorative Micro Pricing Tag */}
                <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white relative shadow-lg overflow-hidden group/mini">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col">
                    <span className="text-xs font-bold tracking-widest text-blue-100 uppercase">
                      {language === 'ar' ? 'السعر كحد أدنى رمزي' : 'Symbolic rates from'}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl md:text-5xl font-black tracking-tight">$99</span>
                      <span className="text-sm font-semibold opacity-80">
                        {language === 'ar' ? '/ للمشروع البسيط' : '/ basic project'}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-100 mt-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {language === 'ar' ? 'إتاحة دفع بالتقسيط حسب الإنجاز' : 'Milestone-based milestone payments avilable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-4">
                <motion.a 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="#contact" 
                  className="w-full py-4 px-6 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold text-base md:text-lg transition-all flex items-center justify-center gap-2.5 shadow-lg group-hover:shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-50"
                >
                  <span>{t('requestPricing')}</span>
                  {language === 'ar' ? (
                    <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-[-4px]" />
                  ) : (
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-[4px]" />
                  )}
                </motion.a>
              </div>

            </div>

          </div>
        </motion.div>

        {/* Outer Value Propositions Grid (3 bento-like mini-cards for modern feel) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {valueCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850 shadow-sm hover:shadow-md transition-all flex gap-4"
            >
              <div className="flex-shrink-0 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl h-12 w-12 flex items-center justify-center">
                {card.icon}
              </div>
              <div>
                <h5 className="font-extrabold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? card.titleAr : card.titleEn}
                </h5>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">
                  {language === 'ar' ? card.descAr : card.descEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
