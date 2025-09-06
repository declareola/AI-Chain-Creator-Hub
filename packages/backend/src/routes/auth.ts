import express from 'express';
import { getAuthChallenge, verifyAuthSignature, getCurrentUser } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/auth/challenge', getAuthChallenge);
router.post('/auth/verify', verifyAuthSignature);
router.get('/auth/me', authenticateJWT, getCurrentUser);

export default router;
