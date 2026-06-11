import { motion } from 'motion/react';
import { ExternalLink, FileText, GraduationCap, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useRef, useState, useEffect } from 'react';
import Tilt3D from './Tilt3D';

export default function Portfolio() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [containerWidth, setContainerWidth] = useState(800);

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

  // Dynamically calculate and update card sizes
  const isMobile = containerWidth < 640;
  const cardWidth = isMobile ? 280 : 400;

  // Track viewport container resizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleResize = () => {
      setContainerWidth(el.clientWidth);
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-transparent transition-colors overflow-hidden overflow-x-hidden relative w-full max-w-[100vw]">
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

        {/* 3D Cylindrical Spherical Carousel Container */}
        <div className="relative overflow-visible py-16 flex flex-col items-center">
          
          {/* Framer Motion Drag Zone */}
          <motion.div 
            ref={containerRef}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDrag={(event, info) => {
              const speedFactor = isMobile ? 280 : 420;
              const dragProgress = info.offset.x / speedFactor;
              setDragOffset(-dragProgress);
            }}
            onDragEnd={(event, info) => {
              const speedFactor = isMobile ? 280 : 420;
              const dragProgress = info.offset.x / speedFactor;
              const roundedChange = Math.round(-dragProgress);
              const targetIndex = activeIndex + roundedChange;
              const nextIndex = Math.max(0, Math.min(projects.length - 1, targetIndex));
              setActiveIndex(nextIndex);
              setDragOffset(0);
            }}
            className="relative w-full h-[380px] sm:h-[460px] overflow-visible flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ 
              perspective: '1200px', 
              transformStyle: 'preserve-3d' 
            }}
          >
            {projects.map((project, index) => {
              const currentPosition = activeIndex + dragOffset;
              const offset = index - currentPosition;
              
              // Map index offset to circular orbit coordinates around an imaginary cylinder
              const theta = offset * (30 * Math.PI / 180); // angle in radians (converge inward at 30 deg intervals)
              const radius = isMobile ? 320 : 560; // radius of the spherical virtual belt
              
              const tx = Math.sin(theta) * radius;
              const tz = (Math.cos(theta) - 1) * radius;
              const ry = offset * -30; // Rotate in inverse Y direction so cards always turn facing the viewer
              const rz = offset * -3;  // Minor Z tangent tilt for a dynamic spherical globe aesthetic
              const scale = 1 - Math.pow(Math.abs(offset), 2) * 0.06;
              const opacity = Math.max(0.15, 1 - Math.abs(offset) * 0.55);
              const blurVal = Math.abs(offset) < 0.1 ? 0 : Math.min(2.5, Math.abs(offset) * 1.5);
              const zIndex = 10 - Math.round(Math.abs(offset) * 5);
              const isActive = Math.abs(offset) < 0.1;

              return (
                <motion.div
                  key={index}
                  animate={{
                    x: tx,
                    z: tz,
                    rotateY: ry,
                    rotateZ: rz,
                    scale: scale,
                    opacity: opacity,
                    filter: `blur(${blurVal}px)`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 24,
                    mass: 0.85
                  }}
                  className={`absolute pointer-events-auto ${!isActive ? 'cursor-pointer hover:opacity-80' : ''}`}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(index);
                      setDragOffset(0);
                    }
                  }}
                  style={{
                    width: `${cardWidth}px`,
                    zIndex: zIndex,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <Tilt3D strength={6} scale={1.01} glareOpacity={0.06}>
                    <div className="bento-card group h-full cursor-pointer select-none" style={{ transformStyle: 'preserve-3d' }}>
                      
                      {/* Layer 1: Image container floats with translateZ(35px) */}
                      <div 
                        className="relative aspect-video rounded-[2rem] overflow-hidden mb-8 border border-slate-100 dark:border-slate-800 shadow-inner"
                        style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }}
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
                      
                      {/* Layer 2: Icon and Text layout floats with translateZ(50px) */}
                      <div 
                        className="flex items-center gap-4 mb-5"
                        style={{ transform: 'translateZ(50px)' }}
                      >
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${project.color} border-2 border-white dark:border-slate-800 shadow-lg`}>
                          {project.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {project.title}
                        </h3>
                      </div>
                      
                      {/* Layer 3: Paragraph floating layout with translateZ(25px) */}
                      <p 
                        className="text-slate-600 dark:text-slate-400 leading-relaxed text-base sm:text-lg flex-grow font-medium"
                        style={{ transform: 'translateZ(25px)' }}
                      >
                        {project.desc}
                      </p>
                    </div>
                  </Tilt3D>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Active Navigation Dot Selectors */}
          <div className="flex justify-center gap-2.5 mt-8 z-20 relative">
            {projects.map((_, i) => {
              const isActive = activeIndex === i;
              return (
                <button 
                  key={i} 
                  onClick={() => {
                    setActiveIndex(i);
                    setDragOffset(0);
                  }}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-blue-500 scale-125 shadow-md shadow-blue-500/20' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`} 
                  id={`dot-indicator-btn-${i}`} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
