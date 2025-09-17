'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Float, Cylinder, Sphere, Box } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DashboardData {
  nfts: number
  transactions: number
  balance: number
  activeTrades: number
}

interface Dashboard3DProps {
  data: DashboardData
}

function DataVisualization({ data }: Dashboard3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const bars = useMemo(() => [
    { label: 'NFTs', value: data.nfts, color: '#ff6b6b', position: [-3, 0, 0] },
    { label: 'Transactions', value: data.transactions, color: '#4ecdc4', position: [-1, 0, 0] },
    { label: 'Balance', value: data.balance / 100, color: '#45b7d1', position: [1, 0, 0] },
    { label: 'Active Trades', value: data.activeTrades, color: '#f9ca24', position: [3, 0, 0] },
  ], [data])

  return (
    <group ref={groupRef}>
      {/* Central hub */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.5]} position={[0, 2, 0]}>
          <meshStandardMaterial
            color="#667eea"
            emissive="#667eea"
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      </Float>

      {/* Data bars */}
      {bars.map((bar, index) => (
        <group key={bar.label} position={bar.position}>
          <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
            {/* Bar */}
            <Cylinder
              args={[0.2, 0.2, Math.max(bar.value * 0.1, 0.5), 8]}
              position={[0, bar.value * 0.05, 0] as [number, number, number]}
            >
              <meshStandardMaterial
                color={bar.color}
                emissive={bar.color}
                emissiveIntensity={0.1}
                metalness={0.3}
                roughness={0.4}
              />
            </Cylinder>

            {/* Label */}
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {bar.label}
            </Text>

            {/* Value */}
            <Text
              position={[0, bar.value * 0.05 + 0.3, 0]}
              fontSize={0.2}
              color={bar.color}
              anchorX="center"
              anchorY="middle"
            >
              {bar.value}
            </Text>
          </Float>
        </group>
      ))}

      {/* Connecting lines */}
      {bars.map((bar, index) => (
        <line key={`line-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, 2, 0, bar.position[0], 0, bar.position[2]]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </line>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <Float key={i} speed={0.2 + i * 0.05} rotationIntensity={0.5} floatIntensity={1}>
          <Sphere args={[0.02]} position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ]}>
            <meshStandardMaterial
              color={`hsl(${i * 18}, 70%, 60%)`}
              emissive={`hsl(${i * 18}, 70%, 30%)`}
              emissiveIntensity={0.2}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

export default function Dashboard3D({ data }: Dashboard3DProps) {
  return (
    <motion.div
      className="w-full h-96"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas
        camera={{ position: [0, 5, 8], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        <DataVisualization data={data} />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </motion.div>
  )
}
