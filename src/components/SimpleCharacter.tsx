import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SimpleCharacter({ 
  isMoving, 
  labCoat = false,
  color = '#3b82f6'
}: { 
  isMoving: boolean;
  labCoat?: boolean;
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (isMoving) {
      time.current += delta * 10;
      const angle = Math.sin(time.current) * 0.5;
      if (leftLegRef.current) leftLegRef.current.rotation.x = angle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -angle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -angle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = angle;
    } else {
      time.current = 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);
    }
    
    // Slight bobbing
    if (groupRef.current) {
      groupRef.current.position.y = isMoving ? Math.abs(Math.sin(time.current)) * 0.1 : 0;
    }
  });

  const torsoColor = labCoat ? '#ffffff' : color;
  const pantsColor = labCoat ? '#1e293b' : '#1e3a8a';

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.6, 0.9, 0.3]} />
        <meshStandardMaterial color={torsoColor} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.4, 1.05, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.3, 0]}>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial color={torsoColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.4, 1.05, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.3, 0]}>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial color={torsoColor} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.15, 0.25, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.25, 0]}>
          <boxGeometry args={[0.25, 0.5, 0.25]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.15, 0.25, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.25, 0]}>
          <boxGeometry args={[0.25, 0.5, 0.25]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
      </group>
    </group>
  );
}
