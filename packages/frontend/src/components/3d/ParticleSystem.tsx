'use client'

import { Canvas } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleSystemProps {
  count?: number
  color?: string
}

function Particles({ count = 200, color = "#ffffff" }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }

    return positions
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
    }
  })

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}

export default function ParticleSystem(props: ParticleSystemProps) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Particles {...props} />
      </Canvas>
    </motion.div>
  )
}
