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

// 2. Beautiful organized premium installations (Large, high-fidelity, perfectly structured)
function SaturnPlanet() {
  const planetRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!planetRef.current) return;
    // Elegant slow orbital rotation
    planetRef.current.rotation.y += 0.08 * delta;
    planetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <group ref={planetRef} position={[2.1, -1.9, -1.8]} rotation={[0.45, -0.2, -0.4]}>
      {/* 1. Main Planet Sphere - High poly segment count for maximum smoothness */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#221c1a"
          roughness={0.45}
          metalness={0.7}
          bumpScale={0.05}
        />
      </mesh>

      {/* 2. Saturn Outer Rings - Double-sided high quality Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <ringGeometry args={[1.9, 3.4, 128]} />
        <meshStandardMaterial
          color="#f3ebd9"
          emissive="#d4af37"
          emissiveIntensity={0.2}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* 3. Outer Thin Decorative Cyber Ring */}
      <mesh rotation={[Math.PI / 2 + 0.1, 0.1, 0]}>
        <torusGeometry args={[3.6, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#4f46e5"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 4. Tiny Red Neon Beacon Dot (Matches the red flare near the planet ring on screenshot) */}
      <mesh position={[0.7, -1.3, 0.45]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function SectionGeometries() {
  const crystalRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += 0.25 * delta;
      crystalRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      crystalRef.current.position.y = -6.8 + Math.sin(state.clock.elapsedTime * 0.8) * 0.18;
    }
    if (knotRef.current) {
      knotRef.current.rotation.y += 0.18 * delta;
      knotRef.current.rotation.z += 0.15 * delta;
      knotRef.current.position.y = -13.0 + Math.cos(state.clock.elapsedTime * 0.6) * 0.15;
    }
  });

  return (
    <group>
      {/* Hero Planet */}
      <SaturnPlanet />

      {/* Section 2: Large Futuristic Quantum Crystal Installation (Aligned left at y = -6.8) */}
      <group ref={crystalRef} position={[-2.4, -6.8, -1.5]}>
        {/* Core Octahedron Crystal */}
        <mesh>
          <octahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial
            color="#10b981"
            transparent
            opacity={0.88}
            metalness={0.95}
            roughness={0.08}
            emissive="#10b981"
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* Thin outer orbital ring */}
        <mesh rotation={[1.1, 0.4, 0]}>
          <torusGeometry args={[1.5, 0.04, 16, 64]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#059669"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* Secondary outer horizontal ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 8, 48]} />
          <meshStandardMaterial
            color="#6ee7b7"
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>

      {/* Section 3: Recursive Logic Loop (Large Torus Knot, Aligned right at y = -13.0) */}
      <group ref={knotRef} position={[2.5, -13.0, -1.8]}>
        <mesh>
          <torusKnotGeometry args={[0.9, 0.26, 128, 16, 3, 4]} />
          <meshStandardMaterial
            color="#6366f1"
            transparent
            opacity={0.9}
            metalness={0.9}
            roughness={0.12}
            emissive="#4f46e5"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Glowing holographic cloud dust cage */}
        <mesh scale={[1.3, 1.3, 1.3]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial
            color="#818cf8"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>
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
        <SectionGeometries />
        <CyberDust count={300} />
      </Canvas>
    </div>
  );
}
export { ThreeDWorld };
