'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Float, Box, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NFTCard3DProps {
  title: string
  creator: string
  price?: string
  image?: string
  onClick?: () => void
}

function NFTModel({ title, creator, price, onClick }: NFTCard3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current && !hovered) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Main NFT Card */}
      <Float speed={2} rotationIntensity={hovered ? 0.2 : 0.1} floatIntensity={hovered ? 0.5 : 0.2}>
        <Box args={[3, 4, 0.1]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={hovered ? "#ff6b6b" : "#4a90e2"}
            metalness={0.3}
            roughness={0.4}
          />
        </Box>

        {/* NFT Image Placeholder */}
        <Box args={[2.5, 3, 0.05]} position={[0, 0.2, 0.06]}>
          <meshStandardMaterial color="#2c3e50" />
        </Box>

        {/* Title */}
        <Text
          position={[0, -1.5, 0.06]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          {title}
        </Text>

        {/* Creator */}
        <Text
          position={[0, -2, 0.06]}
          fontSize={0.2}
          color="#bdc3c7"
          anchorX="center"
          anchorY="middle"
        >
          by {creator}
        </Text>

        {/* Price */}
        {price && (
          <Text
            position={[0, -2.5, 0.06]}
            fontSize={0.25}
            color="#f39c12"
            anchorX="center"
            anchorY="middle"
          >
            {price} ETH
          </Text>
        )}
      </Float>

      {/* Floating particles around the card */}
      {hovered && (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <Float key={i} speed={1 + i * 0.2} rotationIntensity={1} floatIntensity={2}>
              <Sphere args={[0.05]} position={[
                Math.sin(i * Math.PI / 3) * 2,
                Math.cos(i * Math.PI / 3) * 2,
                Math.sin(i) * 0.5
              ]}>
                <meshStandardMaterial
                  color={`hsl(${i * 60}, 70%, 60%)`}
                  emissive={`hsl(${i * 60}, 70%, 30%)`}
                  emissiveIntensity={0.3}
                />
              </Sphere>
            </Float>
          ))}
        </>
      )}
    </group>
  )
}

export default function NFTCard3D(props: NFTCard3DProps) {
  return (
    <motion.div
      className="w-full h-96 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />

        <NFTModel {...props} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!props.onClick}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </motion.div>
  )
}
