import { Server as SocketServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';

export const setupWebSocket = (io: SocketServer): void => {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Handle NFT events
    socket.on('subscribe-nft', (nftId: string) => {
      socket.join(`nft-${nftId}`);
      logger.info(`Client ${socket.id} subscribed to NFT ${nftId}`);
    });

    socket.on('unsubscribe-nft', (nftId: string) => {
      socket.leave(`nft-${nftId}`);
      logger.info(`Client ${socket.id} unsubscribed from NFT ${nftId}`);
    });

    // Handle marketplace events
    socket.on('subscribe-marketplace', () => {
      socket.join('marketplace');
      logger.info(`Client ${socket.id} subscribed to marketplace`);
    });

    socket.on('unsubscribe-marketplace', () => {
      socket.leave('marketplace');
      logger.info(`Client ${socket.id} unsubscribed from marketplace`);
    });

    // Handle trading events
    socket.on('subscribe-trades', () => {
      socket.join('trades');
      logger.info(`Client ${socket.id} subscribed to trades`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  // Broadcast functions for real-time updates
  const broadcastNFTUpdate = (nftId: string, data: any) => {
    io.to(`nft-${nftId}`).emit('nft-update', data);
  };

  const broadcastMarketplaceUpdate = (data: any) => {
    io.to('marketplace').emit('marketplace-update', data);
  };

  const broadcastTradeUpdate = (data: any) => {
    io.to('trades').emit('trade-update', data);
  };

  // Attach broadcast functions to io instance
  (io as any).broadcastNFTUpdate = broadcastNFTUpdate;
  (io as any).broadcastMarketplaceUpdate = broadcastMarketplaceUpdate;
  (io as any).broadcastTradeUpdate = broadcastTradeUpdate;
};
