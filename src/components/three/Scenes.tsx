import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { FC } from "react";
import * as THREE from "three";
import type { SceneName } from "./Stage";

const GOLD = "#C9A44C";
const IVORY = "#F4F0E8";
const SLATE = "#394A56";
const DARK_METAL = "#1a1d21";

function useSlowSpin(speed = 0.15) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return ref;
}

/** Hero: premium cinematic clapperboard with subtle personalized details. */
function Clapperboard() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;

    // Subtle floating movement
    const t = clock.getElapsedTime();

    // Very subtle mouse interaction
    group.current.rotation.y = t * 0.02 + pointer.x * 0.05;
    group.current.rotation.x = pointer.y * 0.04 + Math.sin(t * 0.08) * 0.015;
    group.current.rotation.z = Math.sin(t * 0.05) * 0.02;
  });

  return (
    <group ref={group} position={[2.2, 0, 0]} rotation={[0, 0.4, 0]}>
      {/* Main clapperboard body */}
      <mesh>
        <boxGeometry args={[2.4, 1.6, 0.15]} />
        <meshStandardMaterial color={DARK_METAL} metalness={0.85} roughness={0.35} />
      </mesh>

      {/* Top clapper part */}
      <mesh position={[0, 0.75, 0.1]}>
        <boxGeometry args={[1.2, 0.15, 0.25]} />
        <meshStandardMaterial color={DARK_METAL} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Clapper arm left */}
      <mesh position={[-0.5, 0.75, 0.1]}>
        <boxGeometry args={[0.6, 0.08, 0.25]} />
        <meshStandardMaterial color={DARK_METAL} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Clapper arm right */}
      <mesh position={[0.5, 0.75, 0.1]}>
        <boxGeometry args={[0.6, 0.08, 0.25]} />
        <meshStandardMaterial color={DARK_METAL} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Gold hinge */}
      <mesh position={[0, 0.75, 0.12]}>
        <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.95}
          roughness={0.2}
          emissive={GOLD}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Ivory writing strip */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2.0, 0.12, 0.05]} />
        <meshStandardMaterial color={IVORY} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Subtle text details - simplified for performance */}
      <mesh position={[-0.8, 0, 0.13]}>
        <boxGeometry args={[0.6, 0.04, 0.06]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.9}
          roughness={0.3}
          emissive={GOLD}
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh position={[0.4, 0, 0.13]}>
        <boxGeometry args={[0.4, 0.04, 0.06]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.9}
          roughness={0.3}
          emissive={GOLD}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Shadow base */}
      <mesh position={[0, -0.85, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/** About: floating film strip with sprocket perforations. */
function FilmStrip() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.22) * 0.5 - 0.35;
    group.current.rotation.z = Math.sin(t * 0.16) * 0.08;
    group.current.position.y = Math.sin(t * 0.4) * 0.12;
  });

  const holes = useMemo(() => Array.from({ length: 14 }, (_, i) => -3.2 + i * 0.48), []);

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[7, 1.9, 0.04]} />
        <meshStandardMaterial color="#14181b" metalness={0.4} roughness={0.6} />
      </mesh>
      {holes.map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.78, 0.04]}>
            <boxGeometry args={[0.18, 0.14, 0.06]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[x, -0.78, 0.04]}>
            <boxGeometry args={[0.18, 0.14, 0.06]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}
      {[-2.2, -0.05, 2.1].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.05]}>
          <planeGeometry args={[1.9, 1.1]} />
          <meshStandardMaterial color={SLATE} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/** Portfolio: film reel. */
function Reel() {
  const group = useSlowSpin(0.22);
  return (
    <group ref={group} rotation={[0.28, 0, 0]}>
      <mesh>
        <torusGeometry args={[1.8, 0.09, 16, 96]} />
        <meshStandardMaterial color={IVORY} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.42, 0.12, 16, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 6) * Math.PI * 2]}>
          <boxGeometry args={[3.4, 0.06, 0.06]} />
          <meshStandardMaterial color={SLATE} metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Contact: camera aperture blades that breathe open and closed. */
function Aperture() {
  const blades = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!blades.current) return;
    const t = clock.getElapsedTime();
    const open = 0.55 + Math.sin(t * 0.35) * 0.35;
    blades.current.children.forEach((child, i) => {
      const angle = (i / blades.current!.children.length) * Math.PI * 2;
      child.position.set(Math.cos(angle) * open, Math.sin(angle) * open, 0);
      child.rotation.z = angle + Math.PI / 2;
    });
    blades.current.rotation.z = t * 0.06;
  });

  return (
    <group>
      <mesh>
        <torusGeometry args={[1.75, 0.06, 16, 96]} />
        <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.22} />
      </mesh>
      <group ref={blades}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i}>
            <boxGeometry args={[1.5, 0.9, 0.02]} />
            <meshStandardMaterial
              color="#1b2126"
              metalness={0.7}
              roughness={0.35}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const map: Record<string, FC> = {
  lens: Clapperboard, // Clapperboard replaces camera for hero
  filmstrip: FilmStrip,
  reel: Reel,
  aperture: Aperture,
};

export default function Scenes({ scene }: { scene: SceneName }) {
  const Active = map[scene];
  if (!Active) return null;
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      frameloop="always"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={1.5} color={IVORY} />
      <pointLight position={[-5, -2, 3]} intensity={22} color={GOLD} distance={14} />
      <Active />
    </Canvas>
  );
}
