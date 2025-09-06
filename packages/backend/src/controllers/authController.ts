import { Request, Response } from 'express';
import { getChallenge, verifySignature } from '../services/authService';
import { logger } from '../utils/logger';

export const getAuthChallenge = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const nonce = await getChallenge(walletAddress);
    const message = `Authentication nonce: ${nonce}`;

    logger.info(`Generated challenge for wallet: ${walletAddress}`);

    res.json({
      message,
      nonce,
    });
  } catch (error) {
    logger.error('Error generating auth challenge:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyAuthSignature = async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature are required' });
    }

    const token = await verifySignature(walletAddress, signature);

    if (!token) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    logger.info(`Successful authentication for wallet: ${walletAddress}`);

    res.json({
      token,
      message: 'Authentication successful',
    });
  } catch (error) {
    logger.error('Error verifying auth signature:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // User is attached by auth middleware
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    res.json({
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error('Error getting current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
