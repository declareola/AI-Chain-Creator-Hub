import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// API Routes
router.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// NFT Routes
router.get('/api/nfts', (req: Request, res: Response) => {
  res.json({ message: 'NFT routes will be implemented' });
});

// Marketplace Routes
router.get('/api/marketplace', (req: Request, res: Response) => {
  res.json({ message: 'Marketplace routes will be implemented' });
});

// User Routes
router.get('/api/users', (req: Request, res: Response) => {
  res.json({ message: 'User routes will be implemented' });
});

export const setupRoutes = (app: express.Application): void => {
  app.use('/api', router);
};
