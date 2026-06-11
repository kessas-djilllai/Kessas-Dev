import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// 1. Hook to capture smooth continuous window scrolling progress (0.0 to 1.0)
function useWindowScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = docHeight - winHeight;
      if (scrollable <= 0) return;
      
      const currentScroll = window.scrollY;
      const pct = Math.min(1, Math.max(0, currentScroll / scrollable));
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize once
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// 2. Beautiful floating geometric meshes (skills, tech tokens) scattered in 3D
function FloatingGeometries() {
  const groupRef = useRef<THREE.Group>(null);

  // Pre-generate deterministic 3D positions, scale nodes, and custom colors
  const elements = useMemo(() => {
    const items = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];
    
    // Spread 20 high-fidelity futuristic items along the scroll descent path
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 4; // spiral shape down
      const radius = 2.5 + Math.random() * 2.5;
      
      const x = Math.cos(angle) * radius;
      const y = 3 - (i * 1.5) + (Math.random() - 0.5) * 1.2; // gradual descent in y-space
      const z = Math.sin(angle) * radius - 1;

      const type = Math.floor(Math.random() * 3); // Polyhedrons
      const size = 0.25 + Math.random() * 0.4;
      const rotationSpeed = 0.4 + Math.random() * 1.2;
      const color = colors[i % colors.length];

      items.push({ x, y, z, type, size, rotationSpeed, color });
    }
    return items;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Rotate entire cluster system gently
    groupRef.current.rotation.y += 0.04 * delta;

    // Orbit/rotate individual pieces
    const children = groupRef.current.children;
    elements.forEach((elem, idx) => {
      if (children[idx]) {
        children[idx].rotation.x += 0.25 * delta * elem.rotationSpeed;
        children[idx].rotation.y += 0.35 * delta * elem.rotationSpeed;
        
        // Gentle vertical hovering
        children[idx].position.y = elem.y + Math.sin(state.clock.elapsedTime * 0.7 + idx) * 0.12;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {elements.map((elem, i) => (
        <group key={i} position={[elem.x, elem.y, elem.z]}>
          {elem.type === 0 && (
            <mesh>
              <octahedronGeometry args={[elem.size, 0]} />
              <meshStandardMaterial
                color={elem.color}
                wireframe
                transparent
                opacity={0.5}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          )}
          {elem.type === 1 && (
            <mesh>
              <torusGeometry args={[elem.size * 0.7, elem.size * 0.22, 12, 32]} />
              <meshStandardMaterial
                color={elem.color}
                transparent
                opacity={0.45}
                roughness={0.15}
                metalness={0.85}
              />
            </mesh>
          )}
          {elem.type === 2 && (
            <mesh>
              <icosahedronGeometry args={[elem.size, 0]} />
              <meshStandardMaterial
                color={elem.color}
                wireframe
                transparent
                opacity={0.4}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// 3. Cyber Dust (Stars / Particles) that drifts and shifts with scrolling
function CyberDust({ count = 300 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const scrollProgress = useWindowScrollProgress();
  const currentScrollY = useRef(0);

  const particles = useMemo(() => {
    const list = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      list[i * 3] = (Math.random() - 0.5) * 16;       // X
      list[i * 3 + 1] = (Math.random() - 0.5) * 36 - 6; // Y (spread further down)
      list[i * 3 + 2] = (Math.random() - 0.5) * 12;      // Z
    }
    return list;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Wave ripple
    pointsRef.current.rotation.y += 0.015 * delta;

    // Smoothly interpolate scroll height offset
    currentScrollY.current = THREE.MathUtils.lerp(currentScrollY.current, scrollProgress, 5 * delta);
    pointsRef.current.position.y = currentScrollY.current * 10;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#818cf8"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.55}
      />
    </points>
  );
}

// 4. Smooth Camera rig following an elegant 3D flight path
function CameraRig() {
  const { camera } = useThree();
  const scrollProgress = useWindowScrollProgress();
  const currentProgress = useRef(0);

  useFrame((state, delta) => {
    // Smooth interpolator (lerper) on the scroll progress
    currentProgress.current = THREE.MathUtils.lerp(currentProgress.current, scrollProgress, 4 * delta);
    const p = currentProgress.current;

    // Camera 3D Bezier/Spline flight paths:
    // - Hero Phase (p = 0): camera sits centered at [0, 0, 5], facing origin
    // - Skills Phase (p = 0.33): camera curves down to look at floating modules, shifting slightly right
    // - Portfolio Phase (p = 0.66): camera pivots left, showing 3D wireframes in detail
    // - Pricing & Contact Phase (p = 1.0): camera finishes lower, pointing up into the stellar sky grid
    
    const targetX = Math.sin(p * Math.PI * 1.5) * 2.2;
    const targetY = -p * 18 + 0.5; // descends through the sections
    const targetZ = 4.5 + Math.cos(p * Math.PI * 1.1) * 2.2;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 5 * delta);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 5 * delta);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 5 * delta);

    // Pivot focal lookAt point
    const lookAtTarget = new THREE.Vector3(
      Math.sin(p * Math.PI) * 0.4,
      -p * 18 - 0.2, // slightly lower focal target for optimal depth perception
      -1.5
    );
    camera.lookAt(lookAtTarget);
  });

  return null;
}

// 5. Reactive Interactive Ambient Lights
function DynamicLighting() {
  const scrollProgress = useWindowScrollProgress();
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const p = scrollProgress;

    // Morph color based on sections: Cyber Blue -> Mystic Green -> Royal Violet -> Emerald Gold
    const r = Math.sin(p * Math.PI) * 0.45 + 0.45;
    const g = Math.cos(p * Math.PI * 1.4) * 0.3 + 0.35;
    const b = Math.sin(p * Math.PI * 2.2) * 0.35 + 0.65;
    lightRef.current.color.setRGB(r, g, b);
    
    // Soft hover follow inside R3F space
    const targetX = state.pointer.x * 4;
    const targetY = state.pointer.y * 2.5 - (p * 18);
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.1);
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 15, 6]} intensity={1.6} color="#6366f1" />
      <directionalLight position={[-10, -15, -6]} intensity={0.9} color="#ec4899" />
      <pointLight ref={lightRef} position={[0, 0, 2.5]} intensity={30} distance={14} />
    </>
  );
}

// Main 3D Canvas
export default function ThreeDWorld() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-700 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Continuous interactive camera, lights, meshes, and points */}
        <CameraRig />
        <DynamicLighting />
        <Stars radius={120} depth={40} count={2500} factor={5.5} speed={1.2} saturation={0.6} fade />
        <FloatingGeometries />
        <CyberDust count={300} />
      </Canvas>
    </div>
  );
}
export { ThreeDWorld };
