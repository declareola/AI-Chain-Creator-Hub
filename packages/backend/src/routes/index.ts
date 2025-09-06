import express from 'express';
import { Request, Response } from 'express';
import authRoutes from './auth';
import nftRoutes from './nft';
import marketRoutes from './market';
import traderRoutes from './trader';
import vibeRoutes from './vibe';
import aiRoutes from './ai';
import notificationRoutes from './notification';

const router = express.Router();

// API Routes
router.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth Routes
router.use('/', authRoutes);

// NFT Routes
router.use('/', nftRoutes);

// Marketplace Routes
router.use('/', marketRoutes);

// Trader Routes
router.use('/', traderRoutes);

// Vibe Routes
router.use('/', vibeRoutes);

// AI Routes
router.use('/', aiRoutes);

// Notification Routes
router.use('/api/notifications', notificationRoutes);

// User Routes
router.get('/api/users', (req: Request, res: Response) => {
  res.json({ message: 'User routes will be implemented' });
});

export const setupRoutes = (app: express.Application): void => {
  app.use('/api', router);
};
