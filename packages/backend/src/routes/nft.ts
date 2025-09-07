import express from 'express';
import {
  getNFTs,
  getNFTById,
  createNFT,
  getUserNFTs,
} from '../controllers/nftController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/nfts/user', authenticateJWT, getUserNFTs);
router.get('/nfts/:id', getNFTById);
router.get('/nfts', getNFTs);
router.post('/nfts', authenticateJWT, createNFT);

export default router;
