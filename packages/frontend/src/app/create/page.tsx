import NFTCreationForm from '@/components/nft-creation-form';

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create AI-Generated NFT
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into unique digital artwork using artificial intelligence.
            Generate, preview, and mint your creations as NFTs on the blockchain.
          </p>
        </div>
        <NFTCreationForm />
      </div>
    </main>
  );
}
