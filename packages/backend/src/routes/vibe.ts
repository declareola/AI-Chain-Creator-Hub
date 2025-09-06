import express from 'express';
import {
  getVibeBalance,
  updateVibeBalance,
  getVibeTransactions,
  transferVibe,
} from '../controllers/vibeController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/vibe/balance', authenticateJWT, getVibeBalance);
router.post('/vibe/balance', authenticateJWT, updateVibeBalance);
router.get('/vibe/transactions', authenticateJWT, getVibeTransactions);
router.post('/vibe/transfer', authenticateJWT, transferVibe);

export default router;
