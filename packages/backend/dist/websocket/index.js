"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = void 0;
const logger_1 = require("../utils/logger");
const setupWebSocket = (io) => {
    io.on('connection', (socket) => {
        logger_1.logger.info(`Client connected: ${socket.id}`);
        // Handle NFT events
        socket.on('subscribe-nft', (nftId) => {
            socket.join(`nft-${nftId}`);
            logger_1.logger.info(`Client ${socket.id} subscribed to NFT ${nftId}`);
        });
        socket.on('unsubscribe-nft', (nftId) => {
            socket.leave(`nft-${nftId}`);
            logger_1.logger.info(`Client ${socket.id} unsubscribed from NFT ${nftId}`);
        });
        // Handle marketplace events
        socket.on('subscribe-marketplace', () => {
            socket.join('marketplace');
            logger_1.logger.info(`Client ${socket.id} subscribed to marketplace`);
        });
        socket.on('unsubscribe-marketplace', () => {
            socket.leave('marketplace');
            logger_1.logger.info(`Client ${socket.id} unsubscribed from marketplace`);
        });
        // Handle trading events
        socket.on('subscribe-trades', () => {
            socket.join('trades');
            logger_1.logger.info(`Client ${socket.id} subscribed to trades`);
        });
        socket.on('disconnect', () => {
            logger_1.logger.info(`Client disconnected: ${socket.id}`);
        });
    });
    // Broadcast functions for real-time updates
    const broadcastNFTUpdate = (nftId, data) => {
        io.to(`nft-${nftId}`).emit('nft-update', data);
    };
    const broadcastMarketplaceUpdate = (data) => {
        io.to('marketplace').emit('marketplace-update', data);
    };
    const broadcastTradeUpdate = (data) => {
        io.to('trades').emit('trade-update', data);
    };
    // Attach broadcast functions to io instance
    io.broadcastNFTUpdate = broadcastNFTUpdate;
    io.broadcastMarketplaceUpdate = broadcastMarketplaceUpdate;
    io.broadcastTradeUpdate = broadcastTradeUpdate;
};
exports.setupWebSocket = setupWebSocket;
//# sourceMappingURL=index.js.map