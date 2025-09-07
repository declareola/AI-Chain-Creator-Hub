'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NFTListingCard from '@/components/nft-listing-card';
import { apiClient, MarketplaceListing } from '@/lib/api';
import { useAccount } from 'wagmi';
import { Search, Filter } from 'lucide-react';

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketplaceListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getMarketplaceListings();
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load marketplace');
    } finally {
      setIsLoading(false);
    }
  };

  const filterListings = () => {
    if (!searchTerm) {
      setFilteredListings(listings);
      return;
    }

    const filtered = listings.filter(listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredListings(filtered);
  };

  const handlePurchase = async (listingId: string) => {
    if (!isConnected) {
      setError('Please connect your wallet to purchase NFTs');
      return;
    }

    setPurchasingId(listingId);
    try {
      await apiClient.purchaseNFT({ listingId });
      // Refresh listings after successful purchase
      await fetchListings();
      alert('NFT purchased successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase NFT');
    } finally {
      setPurchasingId(null);
    }
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Please connect your wallet to browse and purchase NFTs
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NFT Marketplace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and purchase unique AI-generated NFTs from talented creators
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search NFTs by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading marketplace...</p>
          </div>
        )}

        {/* NFT Grid */}
        {!isLoading && (
          <>
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🖼️</div>
                <h3 className="text-xl font-semibold mb-2">No NFTs found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create an NFT!'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  {filteredListings.length} NFT{filteredListings.length !== 1 ? 's' : ''} available
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredListings.map((listing) => (
                    <NFTListingCard
                      key={listing.id}
                      listing={listing}
                      onPurchase={handlePurchase}
                      isPurchasing={purchasingId === listing.id}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
