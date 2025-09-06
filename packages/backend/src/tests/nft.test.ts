import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('NFT Endpoints', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: { walletAddress },
    });
    userId = user.id;
    console.log('Created user:', user);

    // Generate a valid JWT token for testing
    token = jwt.sign(
      {
        walletAddress: user.walletAddress,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('Generated token:', token);

    // Verify token can be decoded
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token decoded successfully:', decoded);
    } catch (error) {
      console.log('Token decode failed:', error);
    }
  });

  afterAll(async () => {
    await prisma.nFT.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should get empty NFT list', async () => {
    const res = await request(app)
      .get('/api/nfts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.nfts)).toBe(true);
    expect(res.body.nfts.length).toEqual(0);
  });

  it('should create an NFT', async () => {
    const nftData = {
      tokenId: '1',
      contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      name: 'Test NFT',
      description: 'A test NFT',
      imageUrl: 'https://example.com/image.png',
      creatorAddress: walletAddress,
      ownerAddress: walletAddress,
    };

    const res = await request(app)
      .post('/api/nfts')
      .set('Authorization', `Bearer ${token}`)
      .send(nftData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual(nftData.name);
  });

  it('should get user NFTs', async () => {
    const res = await request(app)
      .get('/api/nfts/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.nfts)).toBe(true);
    expect(res.body.nfts.length).toEqual(1);
  });
});
