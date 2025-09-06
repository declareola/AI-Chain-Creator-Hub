import express from 'express';
import {
  getNFTs,
  getNFTById,
  createNFT,
  getUserNFTs,
} from '../controllers/nftController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/nfts', getNFTs);
router.get('/nfts/:id', getNFTById);
router.post('/nfts', authenticateJWT, createNFT);
router.get('/nfts/user', authenticateJWT, getUserNFTs);

export default router;
