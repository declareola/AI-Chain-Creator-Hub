import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('VibeCoin Endpoints', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const recipientAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
  let token: string;
  let recipientToken: string;
  let userId: string;
  let recipientId: string;

  beforeAll(async () => {
    // Create test users
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    });
    userId = user.id;

    const recipient = await prisma.user.upsert({
      where: { walletAddress: recipientAddress },
      update: {},
      create: { walletAddress: recipientAddress },
    });
    recipientId = recipient.id;

    // Generate JWT tokens
    token = jwt.sign(
      { walletAddress: user.walletAddress },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    recipientToken = jwt.sign(
      { walletAddress: recipient.walletAddress },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create initial balance for sender
    await prisma.vibeCoinBalance.upsert({
      where: { userId: walletAddress },
      update: { balance: '1000' },
      create: { userId: walletAddress, balance: '1000' },
    });
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.vibeCoinBalance.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /api/vibe/balance', () => {
    it('should get user VibeCoin balance', async () => {
      const res = await request(app)
        .get('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('balance');
      expect(res.body).toHaveProperty('lastUpdated');
      expect(res.body.balance).toEqual('1000');
    });

    it('should create balance record if none exists', async () => {
      const res = await request(app)
        .get('/api/vibe/balance')
        .set('Authorization', `Bearer ${recipientToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.balance).toEqual('0');
    });

    it('should reject balance request without authentication', async () => {
      const res = await request(app).get('/api/vibe/balance');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/vibe/balance', () => {
    it('should add to VibeCoin balance', async () => {
      const updateData = {
        amount: '500',
        operation: 'add',
      };

      const res = await request(app)
        .post('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.balance).toEqual('1500');
    });

    it('should subtract from VibeCoin balance', async () => {
      const updateData = {
        amount: '200',
        operation: 'subtract',
      };

      const res = await request(app)
        .post('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.balance).toEqual('1300');
    });

    it('should reject subtraction with insufficient balance', async () => {
      const updateData = {
        amount: '2000',
        operation: 'subtract',
      };

      const res = await request(app)
        .post('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('Insufficient balance');
    });

    it('should reject update without required fields', async () => {
      const res = await request(app)
        .post('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject invalid operation', async () => {
      const updateData = {
        amount: '100',
        operation: 'invalid',
      };

      const res = await request(app)
        .post('/api/vibe/balance')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/vibe/transactions', () => {
    it('should get user VibeCoin transactions', async () => {
      const res = await request(app)
        .get('/api/vibe/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.transactions)).toBe(true);
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/vibe/transactions')
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.pagination.page).toEqual(1);
      expect(res.body.pagination.limit).toEqual(10);
    });

    it('should reject transactions request without authentication', async () => {
      const res = await request(app).get('/api/vibe/transactions');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/vibe/transfer', () => {
    it('should transfer VibeCoin to another user', async () => {
      const transferData = {
        toAddress: recipientAddress,
        amount: '300',
      };

      const res = await request(app)
        .post('/api/vibe/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(transferData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.transaction).toHaveProperty('id');
      expect(res.body.newBalance).toEqual('1000'); // 1300 - 300 = 1000
    });

    it('should reject transfer with insufficient balance', async () => {
      const transferData = {
        toAddress: recipientAddress,
        amount: '2000',
      };

      const res = await request(app)
        .post('/api/vibe/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send(transferData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('Insufficient balance');
    });

    it('should reject transfer without required fields', async () => {
      const res = await request(app)
        .post('/api/vibe/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject transfer without authentication', async () => {
      const transferData = {
        toAddress: recipientAddress,
        amount: '100',
      };

      const res = await request(app)
        .post('/api/vibe/transfer')
        .send(transferData);

      expect(res.statusCode).toEqual(401);
    });
  });
});
