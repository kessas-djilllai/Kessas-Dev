import { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  ox: number; // original X for wave motion
  oy: number; // original Y
  oz: number; // original Z
  color: string;
}

export default function ThreeDCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Real-time camera rotation state
  const rotX = useRef(0.24);
  const rotY = useRef(-0.35);
  const targetRotX = useRef(0.2);
  const targetRotY = useRef(-0.3);
  
  // Mouse drag states
  const isDragging = useRef(false);
  const prevMouseX = useRef(0);
  const prevMouseY = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Set canvas dimensions
    const resize = () => {
      if (containerRef.current && canvas) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate a beautiful 3D sphere/mesh of glowing nodes
    const numPoints = 80;
    const points: Point3D[] = [];
    const radius = Math.min(width, height) * 0.25 || 180;

    // Generate points on an elegant 3D spherical shell (Fibonacci lattice)
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Choose beautiful tech accent color offsets
      const hue = 220 + (i % 3) * 20; // 220 (blue), 240 (indigo), 260 (purple)
      points.push({
        x, y, z,
        ox: x, oy: y, oz: z,
        color: `hsla(${hue}, 85%, 65%, `
      });
    }

    // Add secondary floating outer rings for visual orbital depth
    const ringPoints = 30;
    for (let i = 0; i < ringPoints; i++) {
      const angle = (i / ringPoints) * Math.PI * 2;
      const x = radius * 1.4 * Math.cos(angle);
      const y = radius * 1.4 * Math.sin(angle);
      const z = (Math.sin(angle * 3) * radius * 0.3);

      points.push({
        x, y, z,
        ox: x, oy: y, oz: z,
        color: `hsla(270, 90%, 65%, ` // purple accent orbit
      });
    }

    // Detect if dark/light mode is active
    let isDarkMode = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver(() => {
      isDarkMode = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Track frame ticks to animate wave disturbances
    let tick = 0;

    // Render loop
    const render = () => {
      tick += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Center focal point
      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 400; // Perspective factor

      // Smoothly interpolate rotation toward targets
      rotX.current += (targetRotX.current - rotX.current) * 0.1;
      rotY.current += (targetRotY.current - rotY.current) * 0.1;

      // Automatically drift if not dragging to keep the layout lively
      if (!isDragging.current) {
        targetRotY.current += 0.0015;
        targetRotX.current += 0.0003 * Math.sin(tick);
      }

      const cosX = Math.cos(rotX.current);
      const sinX = Math.sin(rotX.current);
      const cosY = Math.cos(rotY.current);
      const sinY = Math.sin(rotY.current);

      // Map 3D points to 2D perspective screen space
      interface ScreenPoint {
        sx: number;
        sy: number;
        sz: number;
        color: string;
      }
      const projected: ScreenPoint[] = [];

      points.forEach(p => {
        // Apply slight physical wave modulation over time
        const wave = Math.sin(tick * 5 + p.ox * 0.01) * 6;
        const x = p.ox + wave * Math.cos(tick);
        const y = p.oy + wave * Math.sin(tick);
        const z = p.oz;

        // Rotate around Y axis
        let xy = cosY * x - sinY * z;
        let zy = sinY * x + cosY * z;

        // Rotate around X axis
        let yz = cosX * y - sinX * zy;
        let zz = sinX * y + cosX * zy;

        // Perspective division
        const scale = fov / (fov + zz + 250); // Offset depth so it rests comfortably
        const sx = xy * scale + centerX;
        const sy = yz * scale + centerY;

        projected.push({
          sx,
          sy,
          sz: zz,
          color: p.color
        });
      });

      // Draw connective mesh lines for points close to each other
      const thresh = 90; // distance threshold in screen coordinates
      ctx.lineWidth = isDarkMode ? 0.6 : 0.8;
      
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        // Skip rendering background lines if they are too deep
        if (p1.sz > 120) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < thresh) {
            // Stronger opacity for closer elements and darker backgrounds
            const alpha = ((1 - dist / thresh) * (isDarkMode ? 0.18 : 0.12)).toFixed(3);
            ctx.strokeStyle = isDarkMode 
              ? `rgba(99, 102, 241, ${alpha})` 
              : `rgba(37, 99, 235, ${alpha})`;
            
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.stroke();
          }
        }
      }

      // Render glowing individual node spheres
      projected.sort((a, b) => b.sz - a.sz); // Draw from back to front (painters algorithm)

      projected.forEach(p => {
        // Size scales based on depth
        const szFactor = (150 - p.sz) / 100;
        const radius = Math.max(1, Math.min(6, 2.5 * szFactor));
        const alpha = Math.max(0.15, Math.min(0.9, 0.45 * szFactor)).toFixed(2);

        ctx.fillStyle = p.color + `${alpha})`;
        ctx.shadowBlur = isDarkMode ? radius * 2 : 0;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    // Cleanup listeners
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  // Keyboard navigation & Mouse Drag controls to rotate sphere
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    prevMouseX.current = e.clientX;
    prevMouseY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMouseX.current;
    const deltaY = e.clientY - prevMouseY.current;

    targetRotY.current += deltaX * 0.007;
    targetRotX.current += deltaY * 0.007;

    // Clamp vertical rotation so you can't flip past upside-down
    targetRotX.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotX.current));

    prevMouseX.current = e.clientX;
    prevMouseY.current = e.clientY;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0 overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {/* 3D Render Port */}
      <canvas ref={canvasRef} className="block w-full h-full opacity-65 dark:opacity-85 pointer-events-none" />
    </div>
  );
}
