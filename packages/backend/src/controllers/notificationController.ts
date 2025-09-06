import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { logger } from '../utils/logger';

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { recipient, title, body, metadata } = req.body;

    if (!recipient || !title || !body) {
      return res.status(400).json({
        error: 'Recipient, title, and body are required'
      });
    }

    const notification = await notificationService.sendNotification(
      recipient,
      title,
      body,
      metadata
    );

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    logger.error('Error sending notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const notifications = await notificationService.getNotifications(
      user.walletAddress
    );

    res.json({ notifications });
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createChannel = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: 'Channel name and description are required'
      });
    }

    const channel = await notificationService.createChannel(name, description);

    res.json({
      success: true,
      channel,
    });
  } catch (error) {
    logger.error('Error creating channel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const subscribeToChannel = async (req: Request, res: Response) => {
  try {
    const { channelAddress } = req.body;

    if (!channelAddress) {
      return res.status(400).json({
        error: 'Channel address is required'
      });
    }

    const subscription = await notificationService.subscribeToChannel(
      channelAddress
    );

    res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    logger.error('Error subscribing to channel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
