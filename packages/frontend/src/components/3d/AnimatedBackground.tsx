'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#ff6b6b"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

function FloatingCubes() {
  const cubes = Array.from({ length: 8 }, (_, i) => i)

  return (
    <>
      {cubes.map((i) => (
        <Float key={i} speed={0.5 + i * 0.1} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={[Math.sin(i) * 4, Math.cos(i) * 4, Math.sin(i * 2) * 2]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color={`hsl(${i * 45}, 70%, 60%)`}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

export default function AnimatedBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 -z-10"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <AnimatedSphere />
        <FloatingCubes />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </motion.div>
  )
}
