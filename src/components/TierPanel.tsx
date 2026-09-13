import { useCursor, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

interface TierPanelProps {
  tier: string;
  title: string;
  position: [number, number, number];
  color: string;
  onClick: () => void;
}

export function TierPanel({ tier, title, position, color, onClick }: TierPanelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
      meshRef.current.lookAt(0, 2, 0); // Always face center roughly
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => setHover(false)}
        onClick={(e) => {
          e.stopPropagation();
          // disable pointer lock when clicking panel
          document.exitPointerLock?.();
          onClick();
        }}
      >
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 0.5 : 0.1} 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Title Text */}
      <Text
        position={[0, 1.2, 0.15]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {tier}
      </Text>
      <Text
        position={[0, 0.5, 0.15]}
        fontSize={0.25}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
      >
        {title}
      </Text>

      {/* Enter helper */}
      <Text
        position={[0, -1, 0.15]}
        fontSize={0.2}
        color={hovered ? "#ffffff" : "#94a3b8"}
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? "CLICK TO ENTER" : ""}
      </Text>
    </group>
  );
}
