import { motion } from 'motion/react';
import { ExternalLink, FileText, GraduationCap, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Tilt3D from './Tilt3D';

export default function Portfolio() {
  const { t } = useLanguage();

  const projects = [
    {
      title: t('project1Title'),
      desc: t('project1Desc'),
      icon: <FileText className="w-6 h-6 text-blue-500 animate-pulse" />,
      color: "from-blue-500/10 to-blue-500/5",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: t('project2Title'),
      desc: t('project2Desc'),
      icon: <GraduationCap className="w-6 h-6 text-emerald-500" />,
      color: "from-emerald-500/10 to-emerald-500/5",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: t('project3Title'),
      desc: t('project3Desc'),
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />,
      color: "from-orange-500/10 to-orange-500/5",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-transparent transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              {t('portfolioTitle')}
            </motion.h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium">
              {t('portfolioDesc')}
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-none w-[300px] sm:w-[400px] snap-center p-2"
              >
                <Tilt3D strength={10} scale={1.02} glareOpacity={0.12}>
                  <div className="bento-card group h-full cursor-pointer select-none" style={{ transformStyle: 'preserve-3d' }}>
                    
                    {/* Layer 1: Image container floats with translateZ(30px) */}
                    <div 
                      className="relative aspect-video rounded-[2rem] overflow-hidden mb-8 border border-slate-100 dark:border-slate-800 shadow-inner"
                      style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
                    >
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                        <button 
                          className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-50"
                          style={{ transform: 'translateZ(50px)' }}
                        >
                          {t('viewProject')} <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Layer 2: Icon and Text layout floats with translateZ(45px) */}
                    <div 
                      className="flex items-center gap-4 mb-5"
                      style={{ transform: 'translateZ(45px)' }}
                    >
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${project.color} border-2 border-white dark:border-slate-800 shadow-lg`}>
                        {project.icon}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {project.title}
                      </h3>
                    </div>
                    
                    {/* Layer 3: Paragraph floating layout with translateZ(20px) */}
                    <p 
                      className="text-slate-600 dark:text-slate-400 leading-relaxed text-base sm:text-lg flex-grow font-medium"
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      {project.desc}
                    </p>
                  </div>
                </Tilt3D>
              </motion.div>
            ))}
          </div>
          
          {/* Subtle scroll indicator for mobile */}
          <div className="md:hidden flex justify-center gap-1 mt-4">
            {projects.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
