'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient, AIGenerationRequest, NFTCreationRequest } from '@/lib/api';
import { useAccount } from 'wagmi';

export default function NFTCreationForm() {
  const { address, isConnected } = useAccount();
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiGenerationId, setAiGenerationId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for AI generation');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const request: AIGenerationRequest = {
        prompt: prompt.trim(),
        style: 'artistic',
        size: '512x512',
      };

      const response = await apiClient.generateAI(request);
      setGeneratedImage(response.imageUrl);
      setAiGenerationId(response.id);
      setTitle(prompt.slice(0, 50)); // Auto-fill title with first 50 chars of prompt
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!generatedImage) {
      setError('Please generate an AI image first');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Please fill in title and description');
      return;
    }

    setIsMinting(true);
    setError(null);

    try {
      const request: NFTCreationRequest = {
        title: title.trim(),
        description: description.trim(),
        imageUrl: generatedImage,
        aiGenerationId: aiGenerationId || undefined,
        price: price ? parseFloat(price) : undefined,
      };

      const response = await apiClient.createNFT(request);

      // Reset form on success
      setPrompt('');
      setTitle('');
      setDescription('');
      setPrice('');
      setGeneratedImage(null);
      setAiGenerationId(null);

      alert(`NFT created successfully! Token ID: ${response.tokenId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create NFT');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create AI-Generated NFT</CardTitle>
          <CardDescription>
            Generate unique artwork using AI and mint it as an NFT on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Generation Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Generate AI Artwork</h3>
            <div className="flex gap-4">
              <Input
                placeholder="Describe the artwork you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          {generatedImage && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. Preview</h3>
              <div className="flex justify-center">
                <img
                  src={generatedImage}
                  alt="Generated artwork"
                  className="max-w-md max-h-96 rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {/* NFT Details Section */}
          {generatedImage && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">3. NFT Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="NFT Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price (optional)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                />
              </div>
              <textarea
                placeholder="NFT Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
              />
            </div>
          )}

          {/* Mint Button */}
          {generatedImage && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">4. Mint NFT</h3>
              <Button
                onClick={handleMint}
                disabled={isMinting || !isConnected || !title.trim() || !description.trim()}
                className="w-full"
                size="lg"
              >
                {isMinting ? 'Minting...' : 'Mint NFT'}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Wallet Connection Reminder */}
          {!isConnected && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-600">
                Please connect your wallet to mint NFTs
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
