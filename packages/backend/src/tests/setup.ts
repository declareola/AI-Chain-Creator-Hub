import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config();

// Mock Redis to prevent connection errors during tests
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    on: jest.fn(),
    emit: jest.fn(),
  }));
});

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    getJob: jest.fn(),
    getJobs: jest.fn(),
    remove: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
    emit: jest.fn(),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn(),
    emit: jest.fn(),
  })),
}));

const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  await prisma.aIGeneration.deleteMany();
  await prisma.marketplaceListing.deleteMany();
  await prisma.strategyExecution.deleteMany();
  await prisma.tradingStrategy.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.vibeCoinBalance.deleteMany();
  await prisma.nFT.deleteMany();
  // Note: Not deleting users here as tests manage user creation/cleanup
});
