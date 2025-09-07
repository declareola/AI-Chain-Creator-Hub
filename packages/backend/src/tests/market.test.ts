import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('Marketplace Endpoints', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const buyerWalletAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
  let token: string;
  let buyerToken: string;
  let userId: string;
  let buyerId: string;
  let nftId: string;

  beforeAll(async () => {
    // Create seller user
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    });
    userId = user.id;

    // Create buyer user
    const buyer = await prisma.user.upsert({
      where: { walletAddress: buyerWalletAddress },
      update: {},
      create: { walletAddress: buyerWalletAddress },
    });
    buyerId = buyer.id;

    // Generate JWT tokens
    token = jwt.sign(
      { walletAddress: user.walletAddress },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    buyerToken = jwt.sign(
      { walletAddress: buyer.walletAddress },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create test NFT
    const nft = await prisma.nFT.create({
      data: {
        tokenId: '999',
        contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        name: 'Test NFT for Market',
        description: 'A test NFT for marketplace testing',
        imageUrl: 'https://example.com/image.png',
        creatorAddress: walletAddress,
        ownerAddress: walletAddress,
      },
    });
    nftId = nft.id;
  });

  afterAll(async () => {
    await prisma.marketplaceListing.deleteMany();
    await prisma.nFT.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /api/market/listings', () => {
    it('should get empty marketplace listings', async () => {
      const res = await request(app).get('/api/market/listings');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.listings)).toBe(true);
      expect(res.body.listings.length).toEqual(0);
      expect(res.body.pagination).toHaveProperty('total', 0);
    });

    it('should get marketplace listings with pagination', async () => {
      const res = await request(app)
        .get('/api/market/listings')
        .query({ page: 1, limit: 10 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.pagination.page).toEqual(1);
      expect(res.body.pagination.limit).toEqual(10);
    });
  });

  describe('POST /api/market/listings', () => {
    it('should create a marketplace listing', async () => {
      const listingData = {
        nftId,
        price: '1.5',
        currency: 'ETH',
      };

      const res = await request(app)
        .post('/api/market/listings')
        .set('Authorization', `Bearer ${token}`)
        .send(listingData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.listing).toHaveProperty('id');
      expect(res.body.listing.price).toEqual(listingData.price);
      expect(res.body.listing.currency).toEqual(listingData.currency);
    });

    it('should reject listing creation without authentication', async () => {
      const listingData = {
        nftId,
        price: '1.0',
        currency: 'ETH',
      };

      const res = await request(app)
        .post('/api/market/listings')
        .send(listingData);

      expect(res.statusCode).toEqual(401);
    });

    it('should reject listing non-owned NFT', async () => {
      const res = await request(app)
        .post('/api/market/listings')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          nftId,
          price: '1.0',
          currency: 'ETH',
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body.error).toEqual('You do not own this NFT');
    });

    it('should reject listing already listed NFT', async () => {
      const res = await request(app)
        .post('/api/market/listings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nftId,
          price: '2.0',
          currency: 'ETH',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('NFT is already listed');
    });
  });

  describe('GET /api/market/listings/:id', () => {
    let listingId: string;

    beforeAll(async () => {
      // Create another NFT and listing for testing
      const newNft = await prisma.nFT.create({
        data: {
          tokenId: '1000',
          contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          name: 'Test NFT 2',
          description: 'Another test NFT',
          imageUrl: 'https://example.com/image2.png',
          creatorAddress: walletAddress,
          ownerAddress: walletAddress,
        },
      });

      const listing = await prisma.marketplaceListing.create({
        data: {
          nftId: newNft.id,
          sellerId: walletAddress,
          price: '2.5',
          currency: 'ETH',
        },
      });
      listingId = listing.id;
    });

    it('should get listing by ID', async () => {
      const res = await request(app).get(`/api/market/listings/${listingId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.listing).toHaveProperty('id', listingId);
      expect(res.body.listing.price).toEqual('2.5');
    });

    it('should return 404 for non-existent listing', async () => {
      const res = await request(app).get('/api/market/listings/non-existent-id');

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Listing not found');
    });
  });

  describe('GET /api/market/listings/user', () => {
    it('should get user listings', async () => {
      const res = await request(app)
        .get('/api/market/listings/user')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.listings)).toBe(true);
      expect(res.body.listings.length).toBeGreaterThan(0);
    });

    it('should reject user listings without authentication', async () => {
      const res = await request(app).get('/api/market/listings/user');

      expect(res.statusCode).toEqual(401);
    });
  });
});
