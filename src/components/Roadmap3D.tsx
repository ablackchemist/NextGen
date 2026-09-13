import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

export interface Milestone {
  node_id: number;
  status: "Current" | "Locked" | "Completed";
  title: string;
  description: string;
  type: string;
  xp_value: number;
  notebooklm_focus: string;
}

export interface RoadmapData {
  tier: string;
  roadmap_title: string;
  milestones: Milestone[];
}

interface Roadmap3DProps {
  data: RoadmapData;
  position?: [number, number, number];
  careerFocus?: string;
  onClose: () => void;
}

export function Roadmap3D({ data, position = [0, 0, 0], careerFocus, onClose }: Roadmap3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeNode, setActiveNode] = useState<Milestone | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current': return '#10b981'; // Emerald
      case 'Completed': return '#3b82f6'; // Blue
      default: return '#64748b'; // Slate
    }
  };

  const linePoints: [number, number, number][] = [];

  return (
    <group ref={groupRef} position={position}>
      {/* Title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="white"
        outlineWidth={0.04}
        outlineColor="black"
        anchorX="center"
      >
        {data.roadmap_title}{careerFocus ? ` (${careerFocus})` : ''}
      </Text>
      
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.4}
        color="#94a3b8"
        outlineWidth={0.02}
        outlineColor="black"
        anchorX="center"
      >
        {data.tier}
      </Text>

      {/* Nodes */}
      {data.milestones.map((milestone, idx) => {
        const xOffset = (idx % 2 === 0 ? -1.5 : 1.5);
        const yOffset = 1 - (idx * 1.5);
        const zOffset = idx * 0.5;
        const pos: [number, number, number] = [xOffset, yOffset, zOffset];
        linePoints.push(pos);

        const isHovered = activeNode?.node_id === milestone.node_id;

        return (
          <group key={milestone.node_id} position={pos}>
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); setActiveNode(milestone); document.body.style.cursor = 'pointer'; }}
              onPointerOut={(e) => { e.stopPropagation(); setActiveNode(null); document.body.style.cursor = 'auto'; }}
            >
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial 
                color={getStatusColor(milestone.status)} 
                emissive={getStatusColor(milestone.status)}
                emissiveIntensity={isHovered ? 0.8 : 0.2}
              />
            </mesh>
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.25}
              color="white"
              outlineWidth={0.02}
              outlineColor="black"
            >
              {milestone.title}
            </Text>

            {isHovered && (
              <Html position={[0, -0.5, 0]} center zIndexRange={[100, 0]}>
                <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl w-64 pointer-events-none fade-in">
                  <div className="text-xs uppercase font-bold text-gray-400 mb-1">{milestone.status} • {milestone.type}</div>
                  <h4 className="text-white font-bold text-sm mb-2">{milestone.title}</h4>
                  <p className="text-gray-300 text-xs mb-3">{careerFocus ? milestone.description.replace(/STEM/g, careerFocus) : milestone.description}</p>
                  <div className="bg-gray-800 p-2 rounded border border-gray-700">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">NOTEBOOKLM FOCUS:</span>
                    <p className="text-[10px] text-gray-300 leading-tight">{careerFocus ? milestone.notebooklm_focus.replace(/STEM/g, careerFocus) : milestone.notebooklm_focus}</p>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Path Line */}
      {linePoints.length > 1 && (
        <Line 
          points={linePoints}       
          color="#334155"                   
          lineWidth={3}                   
          dashed={false}
        />
      )}

      {/* Close button */}
      <mesh
        position={[0, -data.milestones.length * 1.5, 0]}
        onClick={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; onClose(); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[2, 0.6, 0.2]} />
        <meshStandardMaterial color="#ef4444" />
        <Text position={[0, 0, 0.11]} fontSize={0.25} color="white">
          Close Roadmap
        </Text>
      </mesh>
    </group>
  );
}
