import { Router } from 'express';
import {
  sendNotification,
  getNotifications,
  createChannel,
  subscribeToChannel,
} from '../controllers/notificationController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Send notification
router.post('/send', sendNotification);

// Get user notifications
router.get('/', getNotifications);

// Create notification channel
router.post('/channel', createChannel);

// Subscribe to channel
router.post('/subscribe', subscribeToChannel);

export default router;
