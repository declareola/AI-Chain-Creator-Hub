const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AIGenerationRequest {
  prompt: string;
  style?: string;
  size?: string;
}

export interface AIGenerationResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

export interface NFTCreationRequest {
  title: string;
  description: string;
  imageUrl: string;
  aiGenerationId?: string;
  price?: number;
}

export interface NFTCreationResponse {
  id: string;
  tokenId: string;
  transactionHash: string;
}

export interface MarketplaceListing {
  id: string;
  nftId: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  seller: string;
  tokenId: string;
  createdAt: string;
  isActive: boolean;
}

export interface PurchaseRequest {
  listingId: string;
}

export interface PurchaseResponse {
  transactionHash: string;
  tokenId: string;
}

class APIClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async generateAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const response = await fetch(`${API_BASE_URL}/ai/generate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`AI generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  async createNFT(request: NFTCreationRequest): Promise<NFTCreationResponse> {
    const response = await fetch(`${API_BASE_URL}/nfts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`NFT creation failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserNFTs() {
    const response = await fetch(`${API_BASE_URL}/nfts/user`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
    }

    return response.json();
  }

  async getMarketplaceListings(): Promise<MarketplaceListing[]> {
    const response = await fetch(`${API_BASE_URL}/market/listings`);

    if (!response.ok) {
      throw new Error(`Failed to fetch marketplace listings: ${response.statusText}`);
    }

    return response.json();
  }

  async getMarketplaceListingById(id: string): Promise<MarketplaceListing> {
    const response = await fetch(`${API_BASE_URL}/market/listings/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch listing: ${response.statusText}`);
    }

    return response.json();
  }

  async purchaseNFT(request: PurchaseRequest): Promise<PurchaseResponse> {
    const response = await fetch(`${API_BASE_URL}/market/purchase`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to purchase NFT: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
