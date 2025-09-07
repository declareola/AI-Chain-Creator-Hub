import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('Trading Endpoints', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  let token: string;
  let userId: string;
  let strategyId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    });
    userId = user.id;

    // Generate JWT token
    token = jwt.sign(
      { walletAddress: user.walletAddress },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

  afterAll(async () => {
    await prisma.strategyExecution.deleteMany();
    await prisma.tradingStrategy.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /api/trader/strategies', () => {
    it('should get empty trading strategies', async () => {
      const res = await request(app)
        .get('/api/trader/strategies')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.strategies)).toBe(true);
      expect(res.body.strategies.length).toEqual(0);
    });

    it('should reject strategies request without authentication', async () => {
      const res = await request(app).get('/api/trader/strategies');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/trader/strategies', () => {
    it('should create a trading strategy', async () => {
      const strategyData = {
        name: 'Test Strategy',
        description: 'A test trading strategy',
        strategyType: 'momentum',
        config: { threshold: 0.05, timeframe: '1h' },
        riskLevel: 'medium',
        maxSlippage: 0.01,
      };

      const res = await request(app)
        .post('/api/trader/strategies')
        .set('Authorization', `Bearer ${token}`)
        .send(strategyData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.strategy).toHaveProperty('id');
      expect(res.body.strategy.name).toEqual(strategyData.name);
      expect(res.body.strategy.strategyType).toEqual(strategyData.strategyType);
      strategyId = res.body.strategy.id;
    });

    it('should reject strategy creation without authentication', async () => {
      const strategyData = {
        name: 'Unauthorized Strategy',
        description: 'Should not be created',
        strategyType: 'mean_reversion',
        config: { period: 20 },
      };

      const res = await request(app)
        .post('/api/trader/strategies')
        .send(strategyData);

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/trader/strategies/:id', () => {
    it('should get trading strategy by ID', async () => {
      const res = await request(app)
        .get(`/api/trader/strategies/${strategyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.strategy).toHaveProperty('id', strategyId);
      expect(res.body.strategy.name).toEqual('Test Strategy');
    });

    it('should return 404 for non-existent strategy', async () => {
      const res = await request(app)
        .get('/api/trader/strategies/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Trading strategy not found');
    });

    it('should reject strategy access without authentication', async () => {
      const res = await request(app).get(`/api/trader/strategies/${strategyId}`);

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('PUT /api/trader/strategies/:id', () => {
    it('should update trading strategy', async () => {
      const updateData = {
        name: 'Updated Test Strategy',
        description: 'Updated description',
        riskLevel: 'high',
      };

      const res = await request(app)
        .put(`/api/trader/strategies/${strategyId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.strategy.name).toEqual(updateData.name);
      expect(res.body.strategy.riskLevel).toEqual(updateData.riskLevel);
    });

    it('should return 404 for updating non-existent strategy', async () => {
      const updateData = { name: 'Should not update' };

      const res = await request(app)
        .put('/api/trader/strategies/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Trading strategy not found');
    });
  });

  describe('DELETE /api/trader/strategies/:id', () => {
    it('should delete trading strategy', async () => {
      const res = await request(app)
        .delete(`/api/trader/strategies/${strategyId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Trading strategy deleted successfully');
    });

    it('should return 404 for deleting non-existent strategy', async () => {
      const res = await request(app)
        .delete('/api/trader/strategies/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Trading strategy not found');
    });
  });

  describe('GET /api/trader/strategies/:strategyId/executions', () => {
    let newStrategyId: string;

    beforeAll(async () => {
      // Create a new strategy for execution testing
      const strategy = await prisma.tradingStrategy.create({
        data: {
          userId: walletAddress,
          name: 'Execution Test Strategy',
          description: 'For testing executions',
          strategyType: 'scalping',
          config: { interval: '5m' },
        },
      });
      newStrategyId = strategy.id;

      // Create some test executions
      await prisma.strategyExecution.createMany({
        data: [
          {
            strategyId: newStrategyId,
            status: 'completed',
            result: { action: 'BUY', amount: '1.5', price: '2000' },
          },
          {
            strategyId: newStrategyId,
            status: 'completed',
            result: { action: 'SELL', amount: '1.0', price: '2100' },
          },
        ],
      });
    });

    it('should get strategy executions', async () => {
      const res = await request(app)
        .get(`/api/trader/strategies/${newStrategyId}/executions`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.executions)).toBe(true);
      expect(res.body.executions.length).toEqual(2);
    });

    it('should return 404 for executions of non-existent strategy', async () => {
      const res = await request(app)
        .get('/api/trader/strategies/non-existent-id/executions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Trading strategy not found');
    });
  });
});
