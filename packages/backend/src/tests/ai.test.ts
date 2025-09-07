import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('AI Generation Endpoints', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  let token: string;
  let userId: string;
  let generationId: string;

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
    await prisma.aIGeneration.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/ai/generate', () => {
    it('should queue AI generation job', async () => {
      const generationData = {
        prompt: 'Create a beautiful landscape image',
        model: 'dall-e-3',
        cost: 15,
      };

      const res = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(generationData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.generation).toHaveProperty('id');
      expect(res.body.generation.prompt).toEqual(generationData.prompt);
      expect(res.body.generation.model).toEqual(generationData.model);
      expect(res.body.generation.cost).toEqual(generationData.cost);
      expect(res.body.generation.status).toEqual('pending');
      generationId = res.body.generation.id;
    });

    it('should reject AI generation without authentication', async () => {
      const generationData = {
        prompt: 'Generate an image',
        model: 'gpt-4',
      };

      const res = await request(app)
        .post('/api/ai/generate')
        .send(generationData);

      expect(res.statusCode).toEqual(401);
    });

    it('should reject AI generation without prompt', async () => {
      const generationData = {
        model: 'gpt-4',
        cost: 10,
      };

      const res = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(generationData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('Prompt is required');
    });

    it('should use default values for optional fields', async () => {
      const generationData = {
        prompt: 'Generate text content',
      };

      const res = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(generationData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.generation.model).toEqual('gpt-4');
      expect(res.body.generation.cost).toEqual(10);
    });
  });

  describe('GET /api/ai/generations', () => {
    it('should get user AI generations', async () => {
      const res = await request(app)
        .get('/api/ai/generations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.generations)).toBe(true);
      expect(res.body.generations.length).toBeGreaterThan(0);
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/ai/generations')
        .query({ page: 1, limit: 5 })
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.pagination.page).toEqual(1);
      expect(res.body.pagination.limit).toEqual(5);
    });

    it('should reject generations request without authentication', async () => {
      const res = await request(app).get('/api/ai/generations');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/ai/generations/:id', () => {
    it('should get AI generation by ID', async () => {
      const res = await request(app)
        .get(`/api/ai/generations/${generationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.generation).toHaveProperty('id', generationId);
      expect(res.body.generation.prompt).toEqual('Create a beautiful landscape image');
    });

    it('should return 404 for non-existent generation', async () => {
      const res = await request(app)
        .get('/api/ai/generations/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('AI generation not found');
    });

    it('should reject generation access without authentication', async () => {
      const res = await request(app).get(`/api/ai/generations/${generationId}`);

      expect(res.statusCode).toEqual(401);
    });
  });
});
