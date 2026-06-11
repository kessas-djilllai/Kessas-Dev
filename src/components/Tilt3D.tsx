import React, { useState, useRef, useEffect, MouseEvent } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // How intense the tilt is
  glareOpacity?: number; // specular highlight strength
  scale?: number; // scale factor on hover
}

export default function Tilt3D({
  children,
  className = '',
  strength = 15,
  glareOpacity = 0.15,
  scale = 1.03
}: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState('none');
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobileStatus = window.innerWidth < 1024 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      setIsMobile(mobileStatus);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    
    // Position of the mouse relative to the card's width/height
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize values to range between -0.5 and 0.5
    const normX = (mouseX / width) - 0.5;
    const normY = (mouseY / height) - 0.5;

    // Calculate rotation angles
    // rotating around x-axis is controlled by vertical mouse movement (Y)
    // rotating around y-axis is controlled by horizontal mouse movement (X)
    const rotateX = -(normY * strength).toFixed(2);
    const rotateY = (normX * strength).toFixed(2);

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`);
    
    // Specs highlight reflecting current cursor coordinates
    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;
    
    setGlareStyle({
      opacity: glareOpacity,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)`
    });
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    setTransformStyle(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlareStyle({
      opacity: 0,
      transition: 'all 0.5s ease'
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-[2.5rem] transition-transform duration-200 ease-out select-none cursor-pointer ${className}`}
      style={{
        transformStyle: isMobile ? 'flat' : 'preserve-3d',
        transform: isMobile ? 'none' : transformStyle,
      }}
    >
      {/* Glare/Specular Highlight effect layer */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[2.5rem] z-30 mix-blend-overlay transition-opacity duration-150"
        style={glareStyle}
      />
      {children}
    </div>
  );
}
