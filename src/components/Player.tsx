import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SimpleCharacter } from './SimpleCharacter';

const keys = { KeyW: false, KeyS: false, KeyA: false, KeyD: false };

export function Player({ moveState, avatarUrl, color = "#f59e0b", onMove }: { moveState: Record<string, boolean>; avatarUrl?: string | null; color?: string; onMove?: (x: number, y: number, z: number, rotY: number) => void }) {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const playerPosition = useRef(new THREE.Vector3(0, 0, 0));
  const avatarGroup = useRef<THREE.Group>(null);
  const lastEmitTime = useRef<number>(0);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { keys[e.code as keyof typeof keys] = true; };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.code as keyof typeof keys] = false; };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        euler.current.setFromQuaternion(camera.quaternion);
        euler.current.y -= e.movementX * 0.002;
        euler.current.x -= e.movementY * 0.002;
        euler.current.x = Math.max(-0.5, Math.min(0.5, euler.current.x));
        camera.quaternion.setFromEuler(euler.current);
      }
    };
    
    let lastTouchX = 0;
    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    }
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - lastTouchX;
      const dy = e.touches[0].clientY - lastTouchY;
      
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= dx * 0.005;
      euler.current.x -= dy * 0.005;
      euler.current.x = Math.max(-0.5, Math.min(0.5, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
      
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const speed = 5;
    
    const forward = (keys.KeyW || moveState.forward ? 1 : 0) - (keys.KeyS || moveState.backward ? 1 : 0);
    const right = (keys.KeyD || moveState.right ? 1 : 0) - (keys.KeyA || moveState.left ? 1 : 0);

    direction.current.set(right, 0, -forward).normalize();
    
    const camRotation = camera.rotation.y;
    direction.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), camRotation);

    if (forward !== 0 || right !== 0) {
      velocity.current.lerp(direction.current.multiplyScalar(speed), 0.1);
      if (!isMoving) setIsMoving(true);
    } else {
      velocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      if (isMoving && velocity.current.lengthSq() < 0.05) setIsMoving(false);
    }

    playerPosition.current.addScaledVector(velocity.current, delta);
    
    playerPosition.current.x = Math.max(-50, Math.min(50, playerPosition.current.x));
    playerPosition.current.z = Math.max(-50, Math.min(50, playerPosition.current.z));

    if (avatarGroup.current) {
      avatarGroup.current.position.copy(playerPosition.current);
      // We orient the player character towards the movement direction if they are moving
      if (velocity.current.lengthSq() > 0.1) {
        const targetRotation = Math.atan2(velocity.current.x, velocity.current.z);
        avatarGroup.current.rotation.y = THREE.MathUtils.lerp(
          avatarGroup.current.rotation.y,
          targetRotation,
          0.1
        );
      }
    }

    // Third person camera offset
    const idealOffset = new THREE.Vector3(0, 1.5, 4);
    idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), euler.current.y);
    idealOffset.add(playerPosition.current);
    
    camera.position.lerp(idealOffset, 0.2);

    const now = Date.now();
    if (onMove && (forward !== 0 || right !== 0 || Math.abs(direction.current.lengthSq()) > 0.01)) {
       if (!lastEmitTime.current || now - lastEmitTime.current > 100) {
         onMove(playerPosition.current.x, playerPosition.current.y, playerPosition.current.z, avatarGroup.current ? avatarGroup.current.rotation.y : 0);
         lastEmitTime.current = now;
       }
    }
  });

  return (
    <>
      <group ref={avatarGroup}>
        <SimpleCharacter isMoving={isMoving} color={color} />
      </group>
    </>
  );
}
