import express from 'express';
import {
  generateAI,
  getAIGenerations,
  getAIGenerationById,
} from '../controllers/aiController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/ai/generate', authenticateJWT, generateAI);
router.get('/ai/generations', authenticateJWT, getAIGenerations);
router.get('/ai/generations/:id', authenticateJWT, getAIGenerationById);

export default router;
