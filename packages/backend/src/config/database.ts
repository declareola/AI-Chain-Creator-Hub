import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
});

// Log database events
prisma.$on('query', (e: any) => {
  logger.debug('Database query:', e.query);
});

prisma.$on('info', (e: any) => {
  logger.info('Database info:', e.message);
});

prisma.$on('warn', (e: any) => {
  logger.warn('Database warning:', e.message);
});

prisma.$on('error', (e: any) => {
  logger.error('Database error:', e.message);
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Database disconnection failed:', error);
    throw error;
  }
};

export { prisma };
