'use client'

import Link from 'next/link'
import { WalletConnect } from '@/components/wallet-connect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAccount } from 'wagmi'
import AnimatedBackground from '@/components/3d/AnimatedBackground'
import ParticleSystem from '@/components/3d/ParticleSystem'
import { motion } from 'framer-motion'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
      <AnimatedBackground />
      <ParticleSystem />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Chain Creator Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your creative ideas into unique AI-generated NFTs.
            Create, collect, and trade digital artwork powered by artificial intelligence.
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="flex justify-center mb-12">
          <WalletConnect />
        </div>

        {/* Main Actions */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">🎨 Create</CardTitle>
                <CardDescription>
                  Generate unique AI artwork and mint it as an NFT
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/create">
                  <Button className="w-full" size="lg">
                    Start Creating
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">🛒 Marketplace</CardTitle>
                <CardDescription>
                  Browse and purchase amazing AI-generated NFTs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/marketplace">
                  <Button className="w-full" size="lg">
                    Browse NFTs
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">📊 Dashboard</CardTitle>
                <CardDescription>
                  Manage your NFT collection and trading activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button className="w-full" size="lg">
                    View Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose AI Chain Creator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
              <p className="text-gray-600">
                Use cutting-edge AI to generate unique digital artwork from your imagination
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⛓️</div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
              <p className="text-gray-600">
                Your NFTs are secured on the blockchain with transparent ownership records
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Monetize Your Art</h3>
              <p className="text-gray-600">
                Sell your creations in our marketplace and earn from your creativity
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Web3 Native</h3>
              <p className="text-gray-600">
                Built for the decentralized future with wallet integration and crypto payments
              </p>
            </div>
          </div>
        </div>

        {/* New Content Sections */}

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600">
                Securely connect your crypto wallet to start creating and trading NFTs.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="text-xl font-semibold mb-2">Create AI Art</h3>
              <p className="text-gray-600">
                Use our AI tools to generate unique digital artwork from your ideas.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="text-xl font-semibold mb-2">Mint & Trade</h3>
              <p className="text-gray-600">
                Mint your creations as NFTs and trade them on our secure marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Creations Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Creations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example cards - replace with dynamic content if available */}
            <Card>
              <CardHeader>
                <CardTitle>Dreamscape #1</CardTitle>
                <CardDescription>AI-generated surreal landscape</CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/featured1.jpg" alt="Dreamscape #1" className="rounded-md" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Abstract Vision</CardTitle>
                <CardDescription>Colorful abstract AI art</CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/featured2.jpg" alt="Abstract Vision" className="rounded-md" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Futuristic City</CardTitle>
                <CardDescription>AI art of a futuristic metropolis</CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/featured3.jpg" alt="Futuristic City" className="rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Stats Section */}
        <div className="max-w-4xl mx-auto mt-16 bg-white bg-opacity-70 rounded-lg p-8 text-center shadow-md">
          <h2 className="text-3xl font-bold mb-8">Community Stats</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-extrabold text-purple-700">1,234</div>
              <div className="text-gray-600">Users</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-purple-700">567</div>
              <div className="text-gray-600">NFTs Created</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-purple-700">890</div>
              <div className="text-gray-600">Trades</div>
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            Connect your wallet and start creating your own AI-generated NFTs today!
          </p>
          <WalletConnect />
          {isConnected && (
            <Link href="/create">
              <Button size="lg" className="mt-6">
                Start Creating Now
              </Button>
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>© 2024 AI Chain Creator Hub. Built on Base Network.</p>
        </div>
      </div>
    </main>
  )
}
