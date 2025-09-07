import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('Notification Endpoints', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  let token: string;
  let userId: string;

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
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/notifications/send', () => {
    it('should send a notification', async () => {
      const notificationData = {
        recipient: walletAddress,
        title: 'Test Notification',
        body: 'This is a test notification',
        metadata: { key: 'value' },
      };

      const res = await request(app)
        .post('/api/notifications/send')
        .set('Authorization', `Bearer ${token}`)
        .send(notificationData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.notification).toHaveProperty('id');
    });

    it('should reject sending notification without required fields', async () => {
      const res = await request(app)
        .post('/api/notifications/send')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject sending notification without authentication', async () => {
      const notificationData = {
        recipient: walletAddress,
        title: 'Test Notification',
        body: 'This is a test notification',
      };

      const res = await request(app)
        .post('/api/notifications/send')
        .send(notificationData);

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/notifications', () => {
    it('should get user notifications', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.notifications)).toBe(true);
    });

    it('should reject getting notifications without authentication', async () => {
      const res = await request(app).get('/api/notifications');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/notifications/channel', () => {
    it('should create a notification channel', async () => {
      const channelData = {
        name: 'Test Channel',
        description: 'Channel for testing',
      };

      const res = await request(app)
        .post('/api/notifications/channel')
        .set('Authorization', `Bearer ${token}`)
        .send(channelData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.channel).toHaveProperty('channel');
    });

    it('should reject creating channel without required fields', async () => {
      const res = await request(app)
        .post('/api/notifications/channel')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/notifications/subscribe', () => {
    it('should subscribe to a channel', async () => {
      const subscribeData = {
        channelAddress: '0xchanneladdress1234567890',
      };

      const res = await request(app)
        .post('/api/notifications/subscribe')
        .set('Authorization', `Bearer ${token}`)
        .send(subscribeData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.subscription).toBeDefined();
    });

    it('should reject subscribing without channel address', async () => {
      const res = await request(app)
        .post('/api/notifications/subscribe')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
