'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarketplaceListing } from '@/lib/api';
import { useAccount } from 'wagmi';

interface NFTListingCardProps {
  listing: MarketplaceListing;
  onPurchase?: (listingId: string) => void;
  isPurchasing?: boolean;
}

export default function NFTListingCard({
  listing,
  onPurchase,
  isPurchasing = false
}: NFTListingCardProps) {
  const { address } = useAccount();
  const [imageError, setImageError] = useState(false);

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(listing.id);
    }
  };

  const isOwnListing = address?.toLowerCase() === listing.seller.toLowerCase();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square relative">
        {!imageError ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white">
            #{listing.tokenId}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-2xl">💰</span>
            <span className="font-bold text-lg">{listing.price}</span>
            <span className="text-gray-500 text-sm">VIBE</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {isOwnListing ? (
          <Button variant="outline" className="w-full" disabled>
            Your Listing
          </Button>
        ) : (
          <Button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full"
          >
            {isPurchasing ? 'Purchasing...' : 'Buy Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
