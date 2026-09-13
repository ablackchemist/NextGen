import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Sky, Environment, KeyboardControls, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Player } from './Player';
import { TierPanel } from './TierPanel';
import { SimpleCharacter } from './SimpleCharacter';
import { Roadmap3D } from './Roadmap3D';
import { roadmapDataMock } from '../data';

const tiers = [
  { id: "Tier 1", title: "NextGen", position: [-6, 1, -8], color: "#3b82f6" },
  { id: "Tier 2", title: "Undergraduate", position: [-2, 1, -10], color: "#10b981" },
  { id: "Tier 3", title: "Graduate", position: [2, 1, -10], color: "#8b5cf6" },
  { id: "Tier 4", title: "Professional", position: [6, 1, -8], color: "#f59e0b" },
];

function MentorNPC({ position, name, fact, avatarUrl, onClick }: { position: [number, number, number], name: string, fact: string, avatarUrl?: string, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <SimpleCharacter isMoving={false} labCoat={true} color={hovered ? "#facc15" : "#eab308"} />
        {/* Invisible volume for interaction */}
        <mesh position={[0, 1, 0]} visible={false}>
          <cylinderGeometry args={[0.7, 0.7, 2.5]} />
          <meshBasicMaterial />
        </mesh>
      </group>
      <Billboard position={[0, 2.8, 0]}>
        <Text fontSize={0.4} color="white" outlineWidth={0.05} outlineColor="black">{name}</Text>
        <Text position={[0, -0.4, 0]} fontSize={0.2} color="#fde047" outlineWidth={0.02} outlineColor="black">Click to Talk</Text>
      </Billboard>
    </group>
  );
}

function InformationKiosk({ position, title, fact, onInteract }: { position: [number, number, number], title: string, fact: string, onInteract: (t: string, c: string, type: 'mentor' | 'kiosk') => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh 
        position={[0, 1.5, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => {
          e.stopPropagation();
          onInteract(title, fact, 'kiosk');
        }}
      >
        <boxGeometry args={[1.5, 3, 1.5]} />
        <meshStandardMaterial color={hovered ? "#22d3ee" : "#06b6d4"} emissive={hovered ? "#0891b2" : "#000000"} />
      </mesh>
      <Billboard position={[0, 3.5, 0]}>
        <Text fontSize={0.4} color="white" outlineWidth={0.05} outlineColor="black">{title}</Text>
        <Text position={[0, -0.4, 0]} fontSize={0.2} color="#a5f3fc" outlineWidth={0.02} outlineColor="black">Info Kiosk</Text>
      </Billboard>
    </group>
  );
}

function ParticleExplosion({ position, color, onComplete }: { position: [number, number, number], color: string, onComplete: () => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const particlesCount = 80;
  
  const [positions] = useState(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i*3] = position[0];
      pos[i*3+1] = position[1] + 1; // start slightly above ground
      pos[i*3+2] = position[2];
    }
    return pos;
  });

  const [velocities] = useState(() => {
    const v = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const r = Math.random() * 5 + 2;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      v[i*3] = r * Math.sin(phi) * Math.cos(theta);
      v[i*3+1] = (Math.random() * 5 + 3); // always upwards bias
      v[i*3+2] = r * Math.cos(phi);
    }
    return v;
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < particlesCount; i++) {
        velocities[i*3+1] -= 9.8 * delta; // gravity
        positionsAttr.array[i*3] += velocities[i*3] * delta;
        positionsAttr.array[i*3+1] += velocities[i*3+1] * delta;
        positionsAttr.array[i*3+2] += velocities[i*3+2] * delta;
      }
      positionsAttr.needsUpdate = true;
    }
    if (materialRef.current) {
      materialRef.current.opacity -= delta * 1.5;
      if (materialRef.current.opacity <= 0) {
        onComplete();
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.2}
        color={color}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function Scene({ 
  moveState, 
  avatarUrl,
  earnedCount,
  activeRoadmapTier,
  careerFocus,
  nickname,
  myColor,
  mentors,
  onCloseRoadmap,
  onEnterTier,
  onInteract,
  onMentorClick
}: { 
  moveState: Record<string, boolean>;
  avatarUrl?: string | null;
  earnedCount: number;
  activeRoadmapTier: string | null;
  careerFocus?: string;
  nickname: string;
  myColor: string;
  mentors: { id: string, name: string, title: string, linkedin: string, avatarUrl: string }[];
  onCloseRoadmap: () => void;
  onEnterTier: (tier: string) => void;
  onInteract: (title: string, content: string, type: 'mentor' | 'kiosk') => void;
  onMentorClick: (mentor: any) => void;
}) {
  const [explosions, setExplosions] = useState<{ id: number, position: [number, number, number], color: string }[]>([]);

  const triggerExplosionAt = (position: [number, number, number], color: string) => {
    setExplosions(prev => [...prev, { id: Date.now(), position, color }]);
  };

  const handleInteract = (position: [number, number, number], title: string, content: string, type: 'mentor' | 'kiosk') => {
    triggerExplosionAt(position, type === 'mentor' ? '#facc15' : '#22d3ee');
    onInteract(title, content, type);
  };

  return (
    <Canvas gl={{ preserveDrawingBuffer: true }} shadows camera={{ position: [0, 2, 5], fov: 60 }} onPointerDown={(e) => {
        if(e.pointerType === 'mouse'){
          (e.target as Element).requestPointerLock?.();
        }
    }}>
      <color attach="background" args={['#0f172a']} />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      
      <Suspense fallback={null}>
        {tiers.map((t) => (
          <TierPanel
            key={t.id}
            tier={t.id}
            title={t.title}
            position={t.position as [number, number, number]}
            color={t.color}
            onClick={() => onEnterTier(t.id)}
          />
        ))}

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        
        {/* Simple grid helper */}
        <gridHelper args={[100, 100, '#475569', '#1e293b']} position={[0, -0.49, 0]} />

        {/* Interactables */}
        <InformationKiosk
          position={[-6, 0, 0]}
          title="NOBCChE Foundation"
          fact="NOBCChE was incorporated in 1972 to build an eminent cadre of successful diverse global leaders in STEM."
          onInteract={(n, f, t) => handleInteract([-6, 0, 0], n, f, t)}
        />
        <InformationKiosk
          position={[6, 0, 0]}
          title="What is NOBCChE?"
          fact="NOBCChE stands for the National Organization for the Professional Advancement of Black Chemists and Chemical Engineers."
          onInteract={(n, f, t) => handleInteract([6, 0, 0], n, f, t)}
        />

        {mentors.map((m, i) => {
          // Spread mentors across the front in a semi-circle or line
          const x = -4 + (i * 2);
          const z = -2 - (i % 2);
          return (
            <MentorNPC 
              key={m.id}
              position={[x, 0, z]} 
              name={m.name} 
              avatarUrl={m.avatarUrl}
              fact={m.title}
              onClick={() => {
                triggerExplosionAt([x, 0, z], '#facc15');
                onMentorClick(m);
              }}
            />
          );
        })}

        {earnedCount >= 1 && (
          <MentorNPC 
            position={[-8, 0, -12]} 
            name="Alice Ball" 
            avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&skinColor=825c43"
            fact="Developed the 'Ball Method', the first successful treatment for those suffering from Hansen's disease (leprosy)."
            onClick={() => handleInteract([-8, 0, -12], "Alice Ball", "Developed the 'Ball Method', the first successful treatment for those suffering from Hansen's disease (leprosy).", 'mentor')}
          />
        )}
        
        {earnedCount >= 2 && (
          <InformationKiosk
            position={[8, 0, -12]}
            title="NextGen Initiative"
            fact="The NOBCChE STEM Weekend provides interactive experiences, mentoring, and scholarships to thousands of K-12 students annually."
            onInteract={(n, f, t) => handleInteract([8, 0, -12], n, f, t)}
          />
        )}

        {explosions.map(e => (
          <ParticleExplosion 
            key={e.id} 
            position={e.position} 
            color={e.color} 
            onComplete={() => setExplosions(prev => prev.filter(ex => ex.id !== e.id))} 
          />
        ))}

        {activeRoadmapTier && roadmapDataMock[activeRoadmapTier] && (
          <Roadmap3D 
            data={roadmapDataMock[activeRoadmapTier]}
            position={[0, 2, -5]}
            careerFocus={careerFocus}
            onClose={onCloseRoadmap}
          />
        )}

        <Player 
          moveState={moveState} 
          avatarUrl={avatarUrl} 
        />
      </Suspense>
    </Canvas>
  );
}
