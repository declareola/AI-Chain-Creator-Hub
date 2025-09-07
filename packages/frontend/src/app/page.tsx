'use client'

import { WalletConnect } from '@/components/wallet-connect'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Chain Creator Hub</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Create and trade AI-generated NFTs on the blockchain
        </p>
      </div>

      <WalletConnect />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Connect your wallet to start creating and trading NFTs</p>
      </div>
    </main>
  )
}
