import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { ethers } from 'ethers';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

export interface AuthPayload {
  walletAddress: string;
  username?: string | null;
  email?: string | null;
}

export async function getChallenge(walletAddress: string): Promise<string> {
  // Find or create user with nonce
  let user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress,
      },
    });
  } else {
    // Update nonce for existing user
    user = await prisma.user.update({
      where: { walletAddress },
      data: { nonce: generateNonce() },
    });
  }

  return user.nonce;
}

export function generateNonce(): string {
  return randomBytes(16).toString('hex');
}

export async function verifySignature(walletAddress: string, signature: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    return null;
  }

  const message = `Authentication nonce: ${user.nonce}`;
  try {
    const signerAddress = ethers.verifyMessage(message, signature);
    if (signerAddress.toLowerCase() === walletAddress.toLowerCase()) {
      // Reset nonce to prevent replay attacks
      await prisma.user.update({
        where: { walletAddress },
        data: { nonce: generateNonce() },
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      return token;
    }
  } catch {
    return null;
  }
  return null;
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    const user = await prisma.user.findUnique({
      where: { walletAddress: decoded.walletAddress },
    });
    return user;
  } catch {
    return null;
  }
}
