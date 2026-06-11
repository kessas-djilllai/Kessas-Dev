import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// 1. Single shared global scroll progress (0.0 to 1.0) with passive listeners for ultra scroll speed with 0fps React re-render overhead!
let globalScrollProgress = 0;

if (typeof window !== 'undefined') {
  const handleScroll = () => {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollable = docHeight - winHeight;
    if (scrollable <= 0) return;
    
    globalScrollProgress = Math.min(1, Math.max(0, window.scrollY / scrollable));
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  // Initialize once
  handleScroll();
}

// 1.5. Custom High-Fidelity Procedural Starfield with twinkle properties and color variances
function ProceduralStarField({ count = 2500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // High performance caching of points with beautiful celestial colors
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    // Deep space palette: pure white, neon cyan, mystic violet, solar amber
    const colorsPalette = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#e0f2fe'), // Ice Blue
      new THREE.Color('#bae6fd'), // Hot Cyan
      new THREE.Color('#f5d0fe'), // Pinkish Purple
      new THREE.Color('#fef08a'), // Soft Gold
    ];

    for (let i = 0; i < count; i++) {
      // Place stars spherically in a huge celestial dome
      const radius = 60 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorsPalette[Math.floor(Math.random() * colorsPalette.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }

    return [pos, cols];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    // Slow planetary orbital shift of the space dome
    pointsRef.current.rotation.y += 0.012 * delta;
    pointsRef.current.rotation.x += 0.005 * delta;
    
    // Aesthetic celestial breathing effect
    const time = state.clock.getElapsedTime();
    pointsRef.current.scale.setScalar(1.0 + Math.sin(time * 0.4) * 0.02);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 2. Helper Orbiter component to create dynamic moving satellites around the modern planet
function Orbiter({ 
  speed, 
  orbitRadius, 
  color, 
  emissionColor,
  customAxis = "X",
  opacity = 1.0
}: { 
  speed: number; 
  orbitRadius: number; 
  color: string; 
  emissionColor: string;
  customAxis?: "X" | "Y";
  opacity?: number;
}) {
  const orbiterRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!orbiterRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    
    if (customAxis === "X") {
      orbiterRef.current.position.x = Math.cos(t) * orbitRadius;
      orbiterRef.current.position.y = Math.sin(t * 0.5) * 0.2;
      orbiterRef.current.position.z = Math.sin(t) * orbitRadius;
    } else {
      orbiterRef.current.position.x = Math.sin(t * 0.5) * 0.2;
      orbiterRef.current.position.y = Math.cos(t) * orbitRadius;
      orbiterRef.current.position.z = Math.sin(t) * orbitRadius;
    }
  });

  return (
    <group ref={orbiterRef}>
      <mesh>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial 
          color={color} 
          emissive={emissionColor} 
          emissiveIntensity={3.0 * opacity} 
          transparent={true}
          opacity={opacity}
        />
      </mesh>
      <pointLight color={emissionColor} intensity={12 * opacity} distance={3.0} decay={2.0} />
    </group>
  );
}

// 3. Beautiful high-fidelity Modern/Futuristic Cybernetic Core with glowing holograms, neon rings and scrolling momentum
function ModernPlanet() {
  const planetGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreHoloRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const shroudRef = useRef<THREE.Mesh>(null);
  const beaconsGroupRef = useRef<THREE.Group>(null);
  const orbitersGroupRef = useRef<THREE.Group>(null);
  
  const lastScroll = useRef(0);
  const scrollVelocity = useRef(0);
  const smoothedVelocity = useRef(0);
  const smoothedProgress = useRef(0);

  // Generate a gorgeous dark high-tech circuit terrain pattern for deep planetary musical essence
  const techTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Deep tech base background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 256);

    // Glowing electronic circuit guidelines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      const y = Math.random() * 256;
      ctx.moveTo(0, y);
      ctx.lineTo(150 + Math.random() * 100, y);
      ctx.lineTo(200 + Math.random() * 100, y + (Math.random() > 0.5 ? 40 : -40));
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Glowing digital data nodes
    ctx.fillStyle = '#ec4899';
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, 2.5 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  useFrame((state, delta) => {
    if (!planetGroupRef.current) return;
    
    // Smooth progress interpolation matching SectionGeometries
    smoothedProgress.current = THREE.MathUtils.lerp(smoothedProgress.current, globalScrollProgress, 3 * delta);
    const p = smoothedProgress.current;

    // Calculate correct distance and opacity based on smooth position
    const opacityVal = 1.0;

    // Apply opacities and emissive intensities directly to materials
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.opacity = opacityVal;
    }
    if (coreHoloRef.current) {
      const mat = coreHoloRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = 0.5 * opacityVal;
        mat.emissiveIntensity = 2.8 * opacityVal;
      }
    }
    if (shroudRef.current) {
      const mat = shroudRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.16 * opacityVal;
    }
    if (beaconsGroupRef.current) {
      beaconsGroupRef.current.visible = true;
      beaconsGroupRef.current.scale.setScalar(1.0);
    }
    if (orbitersGroupRef.current) {
      orbitersGroupRef.current.visible = true;
      orbitersGroupRef.current.scale.setScalar(1.0);
    }

    // Calculate scroll delta
    const deltaS = globalScrollProgress - lastScroll.current;
    lastScroll.current = globalScrollProgress;
    
    // Convert to velocity (scroll speed per frame, scaled)
    const targetVel = deltaS / (delta || 0.016);
    
    // Low-pass filter to smooth out sudden jumps and create momentum
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, targetVel, 8 * delta);
    smoothedVelocity.current = THREE.MathUtils.lerp(smoothedVelocity.current, scrollVelocity.current, 4 * delta);
    
    const velocity = smoothedVelocity.current;
    
    // Map scroll velocity to dynamic tilt angle
    const targetPitch = THREE.MathUtils.clamp(velocity * -1.8, -0.8, 0.8);
    const targetRoll = THREE.MathUtils.clamp(velocity * 0.5, -0.25, 0.25);
    
    // Apply dynamic rotations to the whole system
    planetGroupRef.current.rotation.x = THREE.MathUtils.lerp(planetGroupRef.current.rotation.x, targetPitch, 4 * delta);
    planetGroupRef.current.rotation.z = THREE.MathUtils.lerp(planetGroupRef.current.rotation.z, targetRoll, 4 * delta);
    
    // Mechanical and cybernetic rotations
    const time = state.clock.getElapsedTime();
    const scrollSpin = p * Math.PI * 3.8;
    
    // 1. Core Sphere deep rotation
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.15 + scrollSpin;
    }
    
    // 2. Coaxial Holograph Continent layer drifting
    if (coreHoloRef.current) {
      coreHoloRef.current.rotation.y = -time * 0.22 - scrollSpin * 0.8;
    }
    
    // 3. Dynamic rotating neon rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z -= 0.15 * delta;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z += 0.22 * delta;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 0.3 + scrollSpin;
    }
    
    // Dynamic slight continuous float to make space flight feel alive
    planetGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06;
    planetGroupRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.6) * 0.04;
  });

  return (
    <group ref={planetGroupRef}>
      {/* 1. Core Sphere: Polished 3D Obsidian-metal tech globe with dynamic circuitry */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial 
          map={techTexture || undefined}
          roughness={0.12} 
          metalness={0.9} 
          transparent={true}
          opacity={1.0}
        />
      </mesh>

      {/* 2. Outer Coaxial Holographic Continent Wireframe Layer (Cyber music grid overlay) */}
      <mesh ref={coreHoloRef} rotation={[0.4, 0.8, 0.1]}>
        <sphereGeometry args={[1.028, 32, 32]} />
        <meshStandardMaterial 
          color="#22d3ee" 
          emissive="#06b6d4" 
          emissiveIntensity={2.8} 
          wireframe={true} 
          transparent={true} 
          opacity={0.5} 
        />
      </mesh>

      {/* 3. Surface Active Nodes / Beacons (Flashing light endpoints) */}
      <group ref={beaconsGroupRef}>
        <group rotation={[0.2, 1.1, -0.4]}>
          <mesh position={[0, 1.015, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ec4899" transparent={true} opacity={1.0} />
          </mesh>
          <pointLight position={[0, 1.08, 0]} color="#ec4899" intensity={15} distance={2.5} />
        </group>
        
        <group rotation={[-0.8, -0.5, 0.6]}>
          <mesh position={[0, 1.015, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent={true} opacity={1.0} />
          </mesh>
          <pointLight position={[0, 1.08, 0]} color="#22d3ee" intensity={18} distance={3.0} />
        </group>

        <group rotation={[1.2, -1.8, 0.2]}>
          <mesh position={[0, 1.015, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#eab308" transparent={true} opacity={1.0} />
          </mesh>
          <pointLight position={[0, 1.08, 0]} color="#eab308" intensity={12} distance={2.0} />
        </group>
      </group>

      {/* 4. Atmospheric Shroud Glow (Soft cyan celestial aura) */}
      <mesh ref={shroudRef}>
        <sphereGeometry args={[1.18, 32, 32]} />
        <meshBasicMaterial 
          color="#0891b2" 
          transparent={true} 
          opacity={0.16} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* 5. Coaxial Saturn-Style Cyber Rings */}
      {/* Dynamic Cyber Ring 1 (Vibrant Neon Pink/Magenta) */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.3, 0.1, 0]}>
        <torusGeometry args={[1.55, 0.05, 12, 64]} />
        <meshStandardMaterial 
          color="#d946ef" 
          emissive="#d946ef" 
          emissiveIntensity={3.2} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Dynamic Cyber Ring 2 (Electric neon Cyan) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.3, 0.1, 0]}>
        <torusGeometry args={[1.85, 0.015, 8, 80]} />
        <meshStandardMaterial 
          color="#06b6d4" 
          emissive="#06b6d4" 
          emissiveIntensity={4.2} 
          roughness={0.1}
          metalness={1.0}
        />
      </mesh>

      {/* Diagonal Purple Orbit Track coordinate line */}
      <mesh ref={ring3Ref} rotation={[0.4, 0, Math.PI / 4]}>
        <torusGeometry args={[2.2, 0.005, 4, 64]} />
        <meshStandardMaterial 
          color="#a855f7" 
          emissive="#a855f7" 
          emissiveIntensity={2.0} 
          transparent={true} 
          opacity={0.35} 
        />
      </mesh>

      {/* 6. Active Moving Data Pod Satellites orbiting the Core */}
      <group ref={orbitersGroupRef}>
        <Orbiter speed={1.5} orbitRadius={2.2} color="#f43f5e" emissionColor="#f43f5e" opacity={1.0} />
        <Orbiter speed={0.9} orbitRadius={2.6} color="#06b6d4" emissionColor="#0891b2" customAxis="Y" opacity={1.0} />
      </group>
    </group>
  );
}

function SectionGeometries() {
  const planetRef = useRef<THREE.Group>(null);
  const currentProgress = useRef(0);

  useFrame((state, delta) => {
    // Smooth scroll interpolation
    currentProgress.current = THREE.MathUtils.lerp(currentProgress.current, globalScrollProgress, 3 * delta);
    const p = currentProgress.current;

    if (planetRef.current) {
      // Interpolate position based on scroll progress p (0.0 to 1.0)
      // Cap max scale to 1.1 so it never covers the screen. Maintain Z deeper to avoid clipping.
      let targetX = 2.0;
      let targetY = 0.5;
      let targetZ = -1.2;
      let targetScale = 1.0;
      let targetRotX = 0.5;
      let targetRotY = state.clock.elapsedTime * 0.4; // elegant flight spin
      let targetRotZ = -0.3;

      if (p <= 0.25) {
        // Hero to Skills
        const t = p / 0.25;
        targetX = THREE.MathUtils.lerp(2.0, -1.8, t);
        targetY = THREE.MathUtils.lerp(0.5, -4.5, t);
        targetZ = THREE.MathUtils.lerp(-1.2, -2.0, t);
        targetScale = THREE.MathUtils.lerp(1.0, 0.7, t);
        targetRotX = THREE.MathUtils.lerp(0.5, -0.3, t);
        targetRotZ = THREE.MathUtils.lerp(-0.3, 0.4, t);
      } else if (p <= 0.5) {
        // Skills to Portfolio (Centering planet behind portfolio carousel)
        const t = (p - 0.25) / 0.25;
        targetX = THREE.MathUtils.lerp(-1.8, 0.0, t);
        targetY = THREE.MathUtils.lerp(-4.5, -9.0, t);
        targetZ = THREE.MathUtils.lerp(-2.0, -2.8, t);
        targetScale = THREE.MathUtils.lerp(0.7, 1.35, t);
        targetRotX = THREE.MathUtils.lerp(-0.3, 0.6, t);
        targetRotZ = THREE.MathUtils.lerp(0.4, -0.5, t);
      } else if (p <= 0.75) {
        // Portfolio to Pricing
        const t = (p - 0.5) / 0.25;
        targetX = THREE.MathUtils.lerp(0.0, -2.0, t);
        targetY = THREE.MathUtils.lerp(-9.0, -13.5, t);
        targetZ = THREE.MathUtils.lerp(-2.8, -2.2, t);
        targetScale = THREE.MathUtils.lerp(1.35, 0.75, t);
        targetRotX = THREE.MathUtils.lerp(0.6, -0.4, t);
        targetRotZ = THREE.MathUtils.lerp(-0.5, 0.3, t);
      } else {
        // Pricing to Contact (Footer)
        const t = (p - 0.75) / 0.25;
        // Cap targetScale dynamically to prevent covering the text/screen.
        // targetZ is set to -1.8 so it is safely distanced in 3D depth, never masking components.
        targetX = THREE.MathUtils.lerp(-2.0, 2.3, t);
        targetY = THREE.MathUtils.lerp(-13.5, -18.0, t);
        targetZ = THREE.MathUtils.lerp(-2.2, -1.6, t);
        targetScale = THREE.MathUtils.lerp(0.75, 1.1, t); // Scaled down globally
        targetRotX = THREE.MathUtils.lerp(-0.4, 0.5, t);
        targetRotZ = THREE.MathUtils.lerp(0.3, -0.4, t);
      }

      planetRef.current.position.x = targetX;
      planetRef.current.position.y = targetY;
      planetRef.current.position.z = targetZ;
      planetRef.current.scale.setScalar(targetScale);
      
      planetRef.current.rotation.x = targetRotX;
      planetRef.current.rotation.y = targetRotY;
      planetRef.current.rotation.z = targetRotZ;
    }
  });

  return (
    <group ref={planetRef}>
      {/* Modern Planet Model */}
      <ModernPlanet />
    </group>
  );
}

// 3. Cyber Dust (Stars / Particles) that drifts and shifts with scrolling
function CyberDust({ count = 300 }) {
  const pointsRef = useRef<THREE.Points>(null);
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
    const prevScrollY = currentScrollY.current;
    currentScrollY.current = THREE.MathUtils.lerp(currentScrollY.current, globalScrollProgress, 5 * delta);
    pointsRef.current.position.y = currentScrollY.current * 10;

    // Calculate vertical scroll speed (differential)
    const velocity = (globalScrollProgress - prevScrollY) / (delta || 0.016);
    const absVel = Math.abs(velocity);

    // Apply hyperdrive dynamic warp stretching along Y-axis!
    // Stretches particles when scrolling, and returns to normal when stationary.
    pointsRef.current.scale.y = THREE.MathUtils.lerp(pointsRef.current.scale.y, 1.0 + absVel * 22, 10 * delta);
    // Snaps a tiny bit in width for authentic camera speed perspective
    pointsRef.current.scale.x = THREE.MathUtils.lerp(pointsRef.current.scale.x, 1.0 / (1.0 + absVel * 0.4), 10 * delta);
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
  const currentProgress = useRef(0);

  useFrame((state, delta) => {
    // Smooth interpolator (lerper) on the scroll progress
    currentProgress.current = THREE.MathUtils.lerp(currentProgress.current, globalScrollProgress, 4 * delta);
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

// 5. Realistic, Cinematic Deep Space Lights
function DynamicLighting() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const p = globalScrollProgress;
    
    // Soft hover follow inside R3F space
    const targetX = state.pointer.x * 4;
    const targetY = state.pointer.y * 2.5 - (p * 18);
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.1);
  });

  return (
    <>
      {/* Soft celestial background ambient light */}
      <ambientLight intensity={0.65} color="#cbd5e1" />
      
      {/* Core Solar Light: Bright warm directional light simulating a distant star/sun */}
      <directionalLight position={[12, 10, 8]} intensity={2.6} color="#fffae9" />
      
      {/* Galactic Rim Fill Reflected Light: Soft ice-blue backdrop glow to highlight planet contours */}
      <directionalLight position={[-12, -8, -8]} intensity={0.55} color="#93c5fd" />
      
      {/* Cursor tracking ambient light for interactive depth */}
      <pointLight ref={lightRef} position={[0, 0, 2.5]} intensity={12} distance={12} color="#fef3c7" />
    </>
  );
}

// Main 3D Canvas
export default function ThreeDWorld() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Continuous interactive camera, lights, meshes, and points */}
        <CameraRig />
        <DynamicLighting />
        <ProceduralStarField count={2500} />
        <SectionGeometries />
        <CyberDust count={300} />
      </Canvas>
    </div>
  );
}
export { ThreeDWorld };
