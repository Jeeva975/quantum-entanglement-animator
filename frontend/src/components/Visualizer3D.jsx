import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

const BlochSphere = ({ position, blochVector, index, scale = 1, hideLabel = false }) => {
  const [x, y, z] = blochVector;
  const direction = new THREE.Vector3(y, z, x).normalize();
  const length = Math.sqrt(x*x + y*y + z*z); 

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4488ff" transparent opacity={0.15} wireframe />
      </mesh>
      
      {/* 1. We removed the axesHelper from here to make it less disturbing! */}

      {/* 2. Added |0⟩ at the top and |1⟩ at the bottom */}
      <Text position={[0, 1.15, 0]} fontSize={0.22} color="#ffffff">
        |0⟩
      </Text>
      <Text position={[0, -1.15, 0]} fontSize={0.22} color="#ffffff">
        |1⟩
      </Text>

      {/* The Red State Arrow */}
      {length > 0.01 && (
        <arrowHelper args={[direction, new THREE.Vector3(0,0,0), length, 0xff3333, 0.2, 0.1]} />
      )}
      
      {/* Qubit Label (Moved slightly down to make room for |1⟩) */}
      {!hideLabel && (
        <Text position={[0, -1.6, 0]} fontSize={0.25} color="white">
          Qubit {index}
        </Text>
      )}
    </group>
  )
}

export default function Visualizer3D({ data }) {
  const { num_qubits, bloch_vectors, probabilities } = data;

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* TOP ROW: Individual Qubits */}
      <group position={[0, 2.8, 0]}>
        <Text position={[0, 2, 0]} fontSize={0.3} color="#aaaaaa">
          Individual Qubit States
        </Text>
        {bloch_vectors.map((vector, index) => {
          const spacing = 2.5;
          const startX = -((num_qubits - 1) * spacing) / 2;
          return (
            <BlochSphere 
              key={`main-${index}`} 
              index={index}
              position={[startX + index * spacing, 0, 0]} 
              blochVector={vector} 
            />
          );
        })}
      </group>

      {/* BOTTOM ROW: The Parallel Universes (Entanglement View) */}
      {probabilities && (
        <group position={[0, -2.5, 0]}>
          <Text position={[0, 2.5, 0]} fontSize={0.3} color="#ffcc00">
            Global State Probabilities (Entanglement Branches)
          </Text>
          
          {probabilities.map((probObj, probIndex) => {
            const numBranches = probabilities.length;
            // Spaced out the branches a bit more to fit the bigger spheres
            const branchSpacing = num_qubits * 2.5 + 1.5; 
            const branchStartX = -((numBranches - 1) * branchSpacing) / 2;
            
            return (
              <group key={`branch-${probIndex}`} position={[branchStartX + probIndex * branchSpacing, 0, 0]}>
                
                {/* Moved the text down so it doesn't overlap the bigger spheres */}
                <Text position={[0, -1.8, 0]} fontSize={0.3} color="#4CAF50">
                  {(probObj.probability * 100).toFixed(0)}% Chance
                </Text>
                <Text position={[0, -2.3, 0]} fontSize={0.25} color="#aaaaaa">
                  |{probObj.state}⟩
                </Text>
                
                {probObj.state.split('').map((bit, qIndex) => {
                  const vec = bit === '0' ? [0, 0, 1] : [0, 0, -1];
                  const qSpacing = 2.0;
                  const qStartX = -((num_qubits - 1) * qSpacing) / 2;
                  
                  return (
                    <BlochSphere 
                      key={`branch-${probIndex}-q-${qIndex}`}
                      index={qIndex}
                      position={[qStartX + qIndex * qSpacing, 0, 0]}
                      blochVector={vec}
                      // 3. INCREASED SCALE FROM 0.5 to 0.8!
                      scale={0.8} 
                      hideLabel={true}
                    />
                  )
                })}
              </group>
            )
          })}
        </group>
      )}
      
      <OrbitControls makeDefault />
    </Canvas>
  )
}