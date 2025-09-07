'use client'

import Link from 'next/link'
import { WalletConnect } from '@/components/wallet-connect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
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
                <Button variant="outline" className="w-full" size="lg" disabled>
                  Coming Soon
                </Button>
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

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>© 2024 AI Chain Creator Hub. Built on Base Network.</p>
        </div>
      </div>
    </main>
  )
}
