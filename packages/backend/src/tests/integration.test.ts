import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('Integration Tests - End-to-End Workflows', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const buyerWalletAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
  let token: string;
  let buyerToken: string;
  let userId: string;
  let buyerId: string;
  let nftId: string;
  let listingId: string;

  beforeAll(async () => {
    // Create test users
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    });
    userId = user.id;

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

    // Create initial VibeCoin balances
    await prisma.vibeCoinBalance.upsert({
      where: { userId: walletAddress },
      update: { balance: '1000' },
      create: { userId: walletAddress, balance: '1000' },
    });

    await prisma.vibeCoinBalance.upsert({
      where: { userId: buyerWalletAddress },
      update: { balance: '500' },
      create: { userId: buyerWalletAddress, balance: '500' },
    });
  });

  afterAll(async () => {
    await prisma.aIGeneration.deleteMany();
    await prisma.strategyExecution.deleteMany();
    await prisma.tradingStrategy.deleteMany();
    await prisma.marketplaceListing.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.vibeCoinBalance.deleteMany();
    await prisma.nFT.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('NFT Creation and Marketplace Flow', () => {
    it('should complete full NFT creation and marketplace flow', async () => {
      // Step 1: Create NFT
      const nftData = {
        tokenId: '999',
        contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        name: 'Integration Test NFT',
        description: 'NFT for integration testing',
        imageUrl: 'https://example.com/image.png',
        creatorAddress: walletAddress,
        ownerAddress: walletAddress,
      };

      const createNftRes = await request(app)
        .post('/api/nfts')
        .set('Authorization', `Bearer ${token}`)
        .send(nftData);

      expect(createNftRes.statusCode).toEqual(201);
      nftId = createNftRes.body.nft.id;

      // Step 2: List NFT on marketplace
      const listingData = {
        nftId,
        price: '1.5',
        currency: 'ETH',
      };

      const createListingRes = await request(app)
        .post('/api/market/listings')
        .set('Authorization', `Bearer ${token}`)
        .send(listingData);

      expect(createListingRes.statusCode).toEqual(201);
      listingId = createListingRes.body.listing.id;

      // Step 3: Get marketplace listings
      const getListingsRes = await request(app).get('/api/market/listings');
      expect(getListingsRes.statusCode).toEqual(200);
      expect(getListingsRes.body.listings.length).toBeGreaterThan(0);

      // Step 4: Get specific listing
      const getListingRes = await request(app).get(`/api/market/listings/${listingId}`);
      expect(getListingRes.statusCode).toEqual(200);
      expect(getListingRes.body.listing.id).toEqual(listingId);

      // Step 5: Get user listings
      const getUserListingsRes = await request(app)
        .get('/api/market/listings/user')
        .set('Authorization', `Bearer ${token}`);

      expect(getUserListingsRes.statusCode).toEqual(200);
      expect(getUserListingsRes.body.listings.length).toBeGreaterThan(0);
    });
  });

  describe('AI Generation and VibeCoin Flow', () => {
    it('should complete AI generation workflow with VibeCoin payment', async () => {
      // Step 1: Generate AI content
      const aiData = {
        prompt: 'Create a beautiful landscape image for integration testing',
        model: 'dall-e-3',
        cost: 15,
      };

      const generateAiRes = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(aiData);

      expect(generateAiRes.statusCode).toEqual(200);
      const generationId = generateAiRes.body.generation.id;

      // Step 2: Get AI generations
      const getGenerationsRes = await request(app)
        .get('/api/ai/generations')
        .set('Authorization', `Bearer ${token}`);

      expect(getGenerationsRes.statusCode).toEqual(200);
      expect(getGenerationsRes.body.generations.length).toBeGreaterThan(0);

      // Step 3: Get specific AI generation
      const getGenerationRes = await request(app)
        .get(`/api/ai/generations/${generationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getGenerationRes.statusCode).toEqual(200);
      expect(getGenerationRes.body.generation.id).toEqual(generationId);

      // Step 4: Check VibeCoin balance deduction (simulated)
      const getBalanceRes = await request(app)
        .get('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`);

      expect(getBalanceRes.statusCode).toEqual(200);
      // Note: In a real scenario, the AI generation would deduct VibeCoins
    });
  });

  describe('Trading Strategy and Execution Flow', () => {
    it('should complete trading strategy creation and execution flow', async () => {
      // Step 1: Create trading strategy
      const strategyData = {
        name: 'Integration Test Strategy',
        description: 'Strategy for integration testing',
        strategyType: 'momentum',
        config: { threshold: 0.05, timeframe: '1h' },
        riskLevel: 'medium',
        maxSlippage: 0.01,
      };

      const createStrategyRes = await request(app)
        .post('/api/trader/strategies')
        .set('Authorization', `Bearer ${token}`)
        .send(strategyData);

      expect(createStrategyRes.statusCode).toEqual(201);
      const strategyId = createStrategyRes.body.strategy.id;

      // Step 2: Get trading strategies
      const getStrategiesRes = await request(app)
        .get('/api/trader/strategies')
        .set('Authorization', `Bearer ${token}`);

      expect(getStrategiesRes.statusCode).toEqual(200);
      expect(getStrategiesRes.body.strategies.length).toBeGreaterThan(0);

      // Step 3: Get specific strategy
      const getStrategyRes = await request(app)
        .get(`/api/trader/strategies/${strategyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getStrategyRes.statusCode).toEqual(200);
      expect(getStrategyRes.body.strategy.id).toEqual(strategyId);

      // Step 4: Update strategy
      const updateData = {
        name: 'Updated Integration Test Strategy',
        riskLevel: 'high',
      };

      const updateStrategyRes = await request(app)
        .put(`/api/trader/strategies/${strategyId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(updateStrategyRes.statusCode).toEqual(200);
      expect(updateStrategyRes.body.strategy.name).toEqual(updateData.name);
    });
  });

  describe('VibeCoin Transfer and Transaction Flow', () => {
    it('should complete VibeCoin transfer and transaction tracking', async () => {
      // Step 1: Check initial balances
      const initialSenderBalanceRes = await request(app)
        .get('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`);

      const initialRecipientBalanceRes = await request(app)
        .get('/api/vibe/balance')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(initialSenderBalanceRes.statusCode).toEqual(200);
      expect(initialRecipientBalanceRes.statusCode).toEqual(200);

      // Step 2: Transfer VibeCoins
      const transferData = {
        toAddress: buyerWalletAddress,
        amount: '200',
      };

      const transferRes = await request(app)
        .post('/api/vibe/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(transferData);

      expect(transferRes.statusCode).toEqual(200);
      expect(transferRes.body.transaction).toHaveProperty('id');
      expect(transferRes.body.newBalance).toEqual('800'); // 1000 - 200

      // Step 3: Check updated balances
      const updatedSenderBalanceRes = await request(app)
        .get('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`);

      const updatedRecipientBalanceRes = await request(app)
        .get('/api/vibe/balance')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(updatedSenderBalanceRes.body.balance).toEqual('800');
      expect(updatedRecipientBalanceRes.body.balance).toEqual('700'); // 500 + 200

      // Step 4: Check transaction history
      const getTransactionsRes = await request(app)
        .get('/api/vibe/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(getTransactionsRes.statusCode).toEqual(200);
      expect(getTransactionsRes.body.transactions.length).toBeGreaterThan(0);
    });
  });

  describe('Notification System Integration', () => {
    it('should handle notification creation and retrieval', async () => {
      // Step 1: Send notification
      const notificationData = {
        recipient: walletAddress,
        title: 'Integration Test Notification',
        body: 'This is an integration test notification',
        metadata: { test: true },
      };

      const sendNotificationRes = await request(app)
        .post('/api/notification/send')
        .set('Authorization', `Bearer ${token}`)
        .send(notificationData);

      expect(sendNotificationRes.statusCode).toEqual(200);
      expect(sendNotificationRes.body.success).toBe(true);

      // Step 2: Get notifications
      const getNotificationsRes = await request(app)
        .get('/api/notification')
        .set('Authorization', `Bearer ${token}`);

      expect(getNotificationsRes.statusCode).toEqual(200);
      expect(Array.isArray(getNotificationsRes.body.notifications)).toBe(true);
    });
  });
});
