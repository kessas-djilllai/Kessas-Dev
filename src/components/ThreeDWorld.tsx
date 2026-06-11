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

  // Spread 20 high-fidelity futuristic coding items along the scroll descent path
  const elements = useMemo(() => {
    const items = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 4; // spiral shape down
      const radius = 2.4 + Math.random() * 2.4;
      
      const x = Math.cos(angle) * radius;
      const y = 3 - (i * 1.5) + (Math.random() - 0.5) * 1.0; // gradual descent in y-space
      const z = Math.sin(angle) * radius - 1.2;

      const type = Math.floor(Math.random() * 6); // 6 distinctive programmer symbols
      const size = 0.55 + Math.random() * 0.45; // larger modern dimensions for clear visual visibility
      const rotationSpeed = 0.25 + Math.random() * 0.65; // slightly slower for professional premium elegance
      const color = colors[i % colors.length];

      items.push({ x, y, z, type, size, rotationSpeed, color });
    }
    return items;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Rotate entire cluster system gently
    groupRef.current.rotation.y += 0.02 * delta;

    // Orbit/rotate individual pieces
    const children = groupRef.current.children;
    elements.forEach((elem, idx) => {
      if (children[idx]) {
        children[idx].rotation.x += 0.2 * delta * elem.rotationSpeed;
        children[idx].rotation.y += 0.25 * delta * elem.rotationSpeed;
        
        // Gentle vertical hovering
        children[idx].position.y = elem.y + Math.sin(state.clock.elapsedTime * 0.6 + idx) * 0.14;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {elements.map((elem, i) => (
        <group key={i} position={[elem.x, elem.y, elem.z]}>
          {/* TYPE 0: Binary "1" Digit */}
          {elem.type === 0 && (
            <group>
              {/* Outer holographic glowing shell (wired/transparent) */}
              <mesh scale={[1.22, 1.12, 1.22]}>
                <boxGeometry args={[elem.size * 0.25, elem.size * 1.05, elem.size * 0.25]} />
                <meshStandardMaterial
                  color={elem.color}
                  wireframe
                  transparent
                  opacity={0.3}
                />
              </mesh>
              {/* Core Solid Monolith Stem */}
              <mesh>
                <boxGeometry args={[elem.size * 0.16, elem.size * 1.0, elem.size * 0.16]} />
                <meshStandardMaterial
                  color={elem.color}
                  transparent
                  opacity={0.8}
                  metalness={0.9}
                  roughness={0.14}
                  emissive={elem.color}
                  emissiveIntensity={0.2}
                />
              </mesh>
              {/* Slanted code bracket/tick hook */}
              <mesh position={[-elem.size * 0.18, elem.size * 0.38, 0]} rotation={[0, 0, 0.6]}>
                <boxGeometry args={[elem.size * 0.14, elem.size * 0.42, elem.size * 0.14]} />
                <meshStandardMaterial
                  color={elem.color}
                  transparent
                  opacity={0.8}
                  metalness={0.9}
                  roughness={0.12}
                />
              </mesh>
              {/* Base terminal board */}
              <mesh position={[0, -elem.size * 0.48, 0]}>
                <boxGeometry args={[elem.size * 0.55, elem.size * 0.12, elem.size * 0.25]} />
                <meshStandardMaterial
                  color={elem.color}
                  transparent
                  opacity={0.75}
                  metalness={0.95}
                  roughness={0.16}
                />
              </mesh>
              {/* Twin glowing logic nodes on the base */}
              <mesh position={[elem.size * 0.18, -elem.size * 0.48, elem.size * 0.15]}>
                <sphereGeometry args={[elem.size * 0.05, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[-elem.size * 0.18, -elem.size * 0.48, elem.size * 0.15]}>
                <sphereGeometry args={[elem.size * 0.05, 8, 8]} />
                <meshBasicMaterial color={elem.color} />
              </mesh>
            </group>
          )}

          {/* TYPE 1: Binary "0" Digit (Layered concentric loop with floating nucleus) */}
          {elem.type === 1 && (
            <group>
              {/* Outer cyber loop casing */}
              <mesh>
                <torusGeometry args={[elem.size * 0.48, elem.size * 0.14, 8, 24]} />
                <meshStandardMaterial
                  color={elem.color}
                  transparent
                  opacity={0.7}
                  metalness={0.95}
                  roughness={0.1}
                />
              </mesh>
              {/* Concentric wireframe halo sphere */}
              <mesh scale={[0.85, 0.85, 0.85]}>
                <torusGeometry args={[elem.size * 0.48, elem.size * 0.03, 4, 16]} />
                <meshStandardMaterial
                  color={elem.color}
                  wireframe
                  transparent
                  opacity={0.4}
                />
              </mesh>
              {/* Floating inner nucleus (Glowing core data block) */}
              <mesh>
                <icosahedronGeometry args={[elem.size * 0.18, 0]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive={elem.color}
                  emissiveIntensity={1.2}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            </group>
          )}

          {/* TYPE 2: Coding Code Bracket Angle Tag "<" / ">" with embedded glow logic */}
          {elem.type === 2 && (
            <group rotation={[0, 0, Math.random() > 0.5 ? 0 : Math.PI]}>
              {/* Outer safety shell bracket */}
              <group scale={[1.15, 1.15, 1.15]}>
                <mesh position={[0, elem.size * 0.22, 0]} rotation={[0, 0, 0.75]}>
                  <boxGeometry args={[elem.size * 0.8, elem.size * 0.06, elem.size * 0.06]} />
                  <meshStandardMaterial color={elem.color} wireframe transparent opacity={0.3} />
                </mesh>
                <mesh position={[0, -elem.size * 0.22, 0]} rotation={[0, 0, -0.75]}>
                  <boxGeometry args={[elem.size * 0.8, elem.size * 0.06, elem.size * 0.06]} />
                  <meshStandardMaterial color={elem.color} wireframe transparent opacity={0.3} />
                </mesh>
              </group>
              
              {/* Main solid polished bracket arm 1 */}
              <mesh position={[0, elem.size * 0.22, 0]} rotation={[0, 0, 0.75]}>
                <boxGeometry args={[elem.size * 0.78, elem.size * 0.13, elem.size * 0.15]} />
                <meshStandardMaterial
                  color={elem.color}
                  transparent
                  opacity={0.8}
                  metalness={0.9}
                  roughness={0.15}
                  emissive={elem.color}
                  emissiveIntensity={0.2}
                />
              </mesh>
              {/* Main solid polished bracket arm 2 */}
              <mesh position={[0, -elem.size * 0.22, 0]} rotation={[0, 0, -0.75]}>
                <boxGeometry args={[elem.size * 0.78, elem.size * 0.13, elem.size * 0.15]} />
                <meshStandardMaterial
                  color={elem.color}
                  transparent
                  opacity={0.8}
                  metalness={0.9}
                  roughness={0.15}
                  emissive={elem.color}
                  emissiveIntensity={0.2}
                />
              </mesh>
              {/* Glowing code index focal vertex tip */}
              <mesh position={[-elem.size * 0.27, 0, 0]}>
                <sphereGeometry args={[elem.size * 0.1, 12, 12]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          )}

          {/* TYPE 3: Server Database Stack Cylinders */}
          {elem.type === 3 && (
            <group>
              {/* Backing mainframe vertical mounting rod */}
              <mesh position={[-elem.size * 0.35, 0, 0]}>
                <boxGeometry args={[elem.size * 0.08, elem.size * 1.0, elem.size * 0.08]} />
                <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} opacity={0.8} transparent />
              </mesh>

              {/* Server Nodes Stacks */}
              {[-0.32, 0, 0.32].map((yOffset, clusterIdx) => (
                <group key={clusterIdx} position={[0, elem.size * yOffset, 0]}>
                  {/* Detailed plate disk */}
                  <mesh>
                    <cylinderGeometry args={[elem.size * 0.44, elem.size * 0.44, elem.size * 0.18, 16]} />
                    <meshStandardMaterial
                      color={elem.color}
                      transparent
                      opacity={0.8}
                      metalness={0.95}
                      roughness={0.12}
                    />
                  </mesh>
                  {/* Outer protective cage / framing ring */}
                  <mesh scale={[1.1, 1.05, 1.1]}>
                    <cylinderGeometry args={[elem.size * 0.44, elem.size * 0.44, elem.size * 0.19, 16, 1, true]} />
                    <meshStandardMaterial
                      color="#ffffff"
                      wireframe
                      transparent
                      opacity={0.3}
                    />
                  </mesh>
                  {/* Glowing core band loop */}
                  <mesh scale={[1.02, 0.4, 1.02]}>
                    <cylinderGeometry args={[elem.size * 0.44, elem.size * 0.44, elem.size * 0.18, 16]} />
                    <meshStandardMaterial
                      color="#ffffff"
                      emissive={elem.color}
                      emissiveIntensity={1.5}
                      transparent
                      opacity={0.9}
                    />
                  </mesh>
                  {/* LEDs (dual interactive indicators) */}
                  <mesh position={[elem.size * 0.18, 0, elem.size * 0.4]}>
                    <boxGeometry args={[elem.size * 0.08, elem.size * 0.05, elem.size * 0.05]} />
                    <meshBasicMaterial color={clusterIdx % 2 === 0 ? "#10b981" : "#3b82f6"} />
                  </mesh>
                  <mesh position={[elem.size * 0.28, 0, elem.size * 0.34]}>
                    <boxGeometry args={[elem.size * 0.08, elem.size * 0.05, elem.size * 0.05]} />
                    <meshBasicMaterial color={clusterIdx % 2 !== 0 ? "#f59e0b" : "#10b981"} />
                  </mesh>
                </group>
              ))}
            </group>
          )}

          {/* TYPE 4: Algorithm Tree/Network Nodes (linked node neural architecture) */}
          {elem.type === 4 && (
            <group>
              {/* Outer structural constellation sphere loop */}
              <mesh>
                <sphereGeometry args={[elem.size * 0.65, 8, 8]} />
                <meshStandardMaterial color={elem.color} wireframe transparent opacity={0.2} />
              </mesh>

              {/* Central Primary Root Core block */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[elem.size * 0.24, 16, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive={elem.color}
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.95}
                  metalness={0.8}
                  roughness={0.1}
                />
              </mesh>

              {/* Child node A */}
              <mesh position={[elem.size * 0.5, elem.size * 0.4, -elem.size * 0.15]}>
                <sphereGeometry args={[elem.size * 0.14, 12, 12]} />
                <meshStandardMaterial color={elem.color} emissive={elem.color} emissiveIntensity={0.2} transparent opacity={0.85} />
              </mesh>
              {/* Link connector line A */}
              <mesh position={[elem.size * 0.25, elem.size * 0.2, -elem.size * 0.07]} rotation={[0, 0.2, -0.65]}>
                <cylinderGeometry args={[elem.size * 0.02, elem.size * 0.02, elem.size * 0.65, 6]} />
                <meshBasicMaterial color={elem.color} transparent opacity={0.65} />
              </mesh>

              {/* Child node B */}
              <mesh position={[-elem.size * 0.5, -elem.size * 0.4, elem.size * 0.15]}>
                <sphereGeometry args={[elem.size * 0.14, 12, 12]} />
                <meshStandardMaterial color={elem.color} emissive={elem.color} emissiveIntensity={0.2} transparent opacity={0.85} />
              </mesh>
              {/* Link connector line B */}
              <mesh position={[-elem.size * 0.25, -elem.size * 0.2, elem.size * 0.07]} rotation={[0, 0.2, -0.65]}>
                <cylinderGeometry args={[elem.size * 0.02, elem.size * 0.02, elem.size * 0.65, 6]} />
                <meshBasicMaterial color={elem.color} transparent opacity={0.65} />
              </mesh>

              {/* Child node C */}
              <mesh position={[-elem.size * 0.4, elem.size * 0.45, -elem.size * 0.2]}>
                <sphereGeometry args={[elem.size * 0.14, 12, 12]} />
                <meshStandardMaterial color={elem.color} emissive={elem.color} emissiveIntensity={0.2} transparent opacity={0.85} />
              </mesh>
              {/* Link connector line C */}
              <mesh position={[-elem.size * 0.2, elem.size * 0.22, -elem.size * 0.1]} rotation={[0, -0.4, 0.65]}>
                <cylinderGeometry args={[elem.size * 0.02, elem.size * 0.02, elem.size * 0.62, 6]} />
                <meshBasicMaterial color={elem.color} transparent opacity={0.65} />
              </mesh>
            </group>
          )}

          {/* TYPE 5: Silicon Microchip CPU Processor */}
          {elem.type === 5 && (
            <group>
              {/* Solid Base Board Plate */}
              <mesh>
                <boxGeometry args={[elem.size * 0.85, elem.size * 0.85, elem.size * 0.12]} />
                <meshStandardMaterial
                  color={elem.color}
                  transparent
                  opacity={0.8}
                  metalness={0.9}
                  roughness={0.15}
                  emissive={elem.color}
                  emissiveIntensity={0.1}
                />
              </mesh>

              {/* Outer Micro-Track wire grid frame */}
              <mesh scale={[1.15, 1.15, 1]}>
                <boxGeometry args={[elem.size * 0.85, elem.size * 0.85, elem.size * 0.04]} />
                <meshStandardMaterial
                  color={elem.color}
                  wireframe
                  transparent
                  opacity={0.35}
                />
              </mesh>
              
              {/* Highly Glossy Floating Silicon Die Crystal Processor */}
              <mesh position={[0, 0, elem.size * 0.08]}>
                <boxGeometry args={[elem.size * 0.42, elem.size * 0.42, elem.size * 0.06]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive={elem.color}
                  emissiveIntensity={1.3}
                  transparent
                  opacity={0.9}
                  metalness={0.98}
                  roughness={0.05}
                />
              </mesh>

              {/* Glowing corner transistor logic points */}
              {[-0.28, 0.28].map((cx, xIndex) => 
                [-0.28, 0.28].map((cy, yIndex) => (
                  <mesh key={`${cx}-${xIndex}-${cy}-${yIndex}`} position={[cx * elem.size, cy * elem.size, elem.size * 0.065]}>
                    <boxGeometry args={[elem.size * 0.1, elem.size * 0.1, elem.size * 0.04]} />
                    <meshStandardMaterial
                      color="#ffffff"
                      metalness={0.9}
                      roughness={0.1}
                    />
                  </mesh>
                ))
              )}

              {/* Silicon pins protruding from CPU sides */}
              {[-0.25, 0, 0.25].map((pos, j) => (
                <group key={pos}>
                  {/* Left horizontal pin */}
                  <mesh position={[-elem.size * 0.48, pos * elem.size, 0]}>
                    <boxGeometry args={[elem.size * 0.14, elem.size * 0.05, elem.size * 0.05]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                  </mesh>
                  {/* Right horizontal pin */}
                  <mesh position={[elem.size * 0.48, pos * elem.size, 0]}>
                    <boxGeometry args={[elem.size * 0.14, elem.size * 0.05, elem.size * 0.05]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                  </mesh>
                  {/* Top vertical pin */}
                  <mesh position={[pos * elem.size, elem.size * 0.48, 0]} rotation={[0, 0, 1.57]}>
                    <boxGeometry args={[elem.size * 0.14, elem.size * 0.05, elem.size * 0.05]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                  </mesh>
                  {/* Bottom vertical pin */}
                  <mesh position={[pos * elem.size, -elem.size * 0.48, 0]} rotation={[0, 0, 1.57]}>
                    <boxGeometry args={[elem.size * 0.14, elem.size * 0.05, elem.size * 0.05]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                  </mesh>
                </group>
              ))}
            </group>
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
