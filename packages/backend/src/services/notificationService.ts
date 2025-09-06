import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { logger } from '../utils/logger';

export class NotificationService {
  private signer: ethers.Signer;

  constructor(privateKey?: string) {
    // Initialize signer
    this.signer = privateKey
      ? new ethers.Wallet(privateKey)
      : ethers.Wallet.createRandom(); // For demo purposes
  }

  async sendNotification(
    recipient: string,
    title: string,
    body: string,
    _metadata?: any
  ): Promise<any> {
    try {
      // Initialize PushAPI for sending
      const user = await PushAPI.initialize(this.signer, {
        env: CONSTANTS.ENV.STAGING,
      });

      const notification = await user.channel.send([recipient], {
        notification: {
          title,
          body,
        },
      });

      logger.info(`Notification sent to ${recipient}: ${title}`);
      return notification;
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  async createChannel(name: string, description: string) {
    try {
      const user = await PushAPI.initialize(this.signer, {
        env: CONSTANTS.ENV.STAGING,
      });

      const channel = await user.channel.create({
        name,
        description,
        icon: 'https://example.com/icon.png',
        url: 'https://example.com',
      });

      logger.info(`Channel created: ${name}`);
      return channel;
    } catch (error) {
      logger.error('Error creating channel:', error);
      throw error;
    }
  }

  async subscribeToChannel(channelAddress: string) {
    try {
      const user = await PushAPI.initialize(this.signer, {
        env: CONSTANTS.ENV.STAGING,
      });

      const subscription = await user.notification.subscribe(channelAddress);
      logger.info(`Subscribed to channel: ${channelAddress}`);
      return subscription;
    } catch (error) {
      logger.error('Error subscribing to channel:', error);
      throw error;
    }
  }

  async getNotifications(_userAddress: string) {
    try {
      const user = await PushAPI.initialize(this.signer, {
        env: CONSTANTS.ENV.STAGING,
      });

      const notifications = await user.notification.list('INBOX');
      return notifications;
    } catch (error) {
      logger.error('Error fetching notifications:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const notificationService = new NotificationService(
  process.env.PUSH_PRIVATE_KEY
);
