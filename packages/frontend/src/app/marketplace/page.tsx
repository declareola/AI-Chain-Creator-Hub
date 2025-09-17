'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NFTListingCard from '@/components/nft-listing-card';
import { apiClient, MarketplaceListing } from '@/lib/api';
import { useAccount } from 'wagmi';
import { Search, Grid, List } from 'lucide-react';

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketplaceListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchTerm, sortBy]);

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

  const filterAndSortListings = () => {
    let filtered = listings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

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

        {/* Featured Collections */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Featured Collections</CardTitle>
            <CardDescription>Explore trending NFT collections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-4 text-white">
                <h3 className="font-bold">Cyberpunk Dreams</h3>
                <p className="text-sm opacity-90">Futuristic AI art collection</p>
              </div>
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg p-4 text-white">
                <h3 className="font-bold">Abstract Visions</h3>
                <p className="text-sm opacity-90">Modern abstract artwork</p>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-teal-400 rounded-lg p-4 text-white">
                <h3 className="font-bold">Nature Reimagined</h3>
                <p className="text-sm opacity-90">AI-enhanced natural landscapes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search NFTs by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
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

        {/* NFT Grid/List */}
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
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
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
