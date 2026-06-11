import { motion } from 'motion/react';
import { Smartphone, Code2, Server, Database } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Skills() {
  const { t } = useLanguage();

  const skills = [
    {
      icon: <Smartphone className="w-8 h-8 text-emerald-500" />,
      tagColor: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      title: t('skillAndroidTitle'),
      desc: t('skillAndroidDesc'),
      tags: ["Android", "Kotlin", "Jetpack Compose"]
    },
    {
      icon: <Code2 className="w-8 h-8 text-blue-500" />,
      tagColor: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
      title: t('skillWebTitle'),
      desc: t('skillWebDesc'),
      tags: ["React", "JavaScript", "HTML/CSS", "Tailwind"]
    },
    {
      icon: <Server className="w-8 h-8 text-amber-500" />,
      tagColor: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
      title: t('skillBackendTitle'),
      desc: t('skillBackendDesc'),
      tags: ["Node.js", "JS"]
    },
    {
      icon: <Database className="w-8 h-8 text-purple-500" />,
      tagColor: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300",
      title: t('skillFullstackTitle'),
      desc: t('skillFullstackDesc'),
      tags: ["PHP", "SQL", "MySQL", "Backend"]
    }
  ];

  return (
    <section id="skills" className="py-24 relative bg-transparent transition-colors">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            {t('skillsTitle')}
          </motion.h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            {t('skillsDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="p-1"
            >
              <div 
                className={`bento-card group flex flex-col h-full bg-gradient-to-br from-white to-slate-50 hover:to-white dark:from-slate-900 dark:to-slate-950/40 border-2 border-slate-200/60 dark:border-slate-800/60 rounded-[2.5rem] p-8 md:p-10`}
              >
                <div 
                  className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800 transition-all duration-500 shadow-sm"
                >
                  {skill.icon}
                </div>
                <h3 
                  className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
                >
                  {skill.title}
                </h3>
                <p 
                  className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg flex-grow font-medium"
                >
                  {skill.desc}
                </p>
                <div 
                  className="flex flex-wrap gap-2 mt-auto"
                >
                  {skill.tags.map((tag, i) => (
                    <span key={i} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl ${skill.tagColor} transition-all`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
