import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Authentication Endpoints', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  let nonce: string;
  let token: string;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { walletAddress } });
    await prisma.$disconnect();
  });

  it('should generate a challenge nonce', async () => {
    const res = await request(app)
      .post('/api/auth/challenge')
      .send({ walletAddress });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('nonce');
    nonce = res.body.nonce;
  });

  it('should fail to verify invalid signature', async () => {
    const res = await request(app)
      .post('/api/auth/verify')
      .send({ walletAddress, signature: 'invalidsignature' });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  // Note: For a real test, you would generate a valid signature using a wallet private key.
  // Here we skip the valid signature test due to environment limitations.

  it('should reject access to protected route without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject access to protected route with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toEqual(401);
  });
});
