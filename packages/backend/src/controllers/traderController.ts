import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const getTradingStrategies = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [strategies, total] = await Promise.all([
      prisma.tradingStrategy.findMany({
        where: { userId: user.walletAddress },
        include: {
          executions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.tradingStrategy.count({
        where: { userId: user.walletAddress },
      }),
    ]);

    res.json({
      strategies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching trading strategies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTradingStrategy = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      strategyType,
      config,
      riskLevel = 'medium',
      maxSlippage = 0.01,
    } = req.body;

    const user = (req as any).user;

    const strategy = await prisma.tradingStrategy.create({
      data: {
        userId: user.walletAddress,
        name,
        description,
        strategyType,
        config,
        riskLevel,
        maxSlippage,
      },
    });

    logger.info(`Trading strategy created: ${strategy.id} by ${user.walletAddress}`);

    res.status(201).json({ strategy });
  } catch (error) {
    logger.error('Error creating trading strategy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTradingStrategyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const strategy = await prisma.tradingStrategy.findFirst({
      where: {
        id,
        userId: user.walletAddress,
      },
      include: {
        executions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Trading strategy not found' });
    }

    res.json({ strategy });
  } catch (error) {
    logger.error('Error fetching trading strategy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTradingStrategy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = (req as any).user;

    const strategy = await prisma.tradingStrategy.findFirst({
      where: {
        id,
        userId: user.walletAddress,
      },
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Trading strategy not found' });
    }

    const updatedStrategy = await prisma.tradingStrategy.update({
      where: { id },
      data: updates,
    });

    logger.info(`Trading strategy updated: ${id} by ${user.walletAddress}`);

    res.json({ strategy: updatedStrategy });
  } catch (error) {
    logger.error('Error updating trading strategy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTradingStrategy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const strategy = await prisma.tradingStrategy.findFirst({
      where: {
        id,
        userId: user.walletAddress,
      },
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Trading strategy not found' });
    }

    await prisma.tradingStrategy.delete({
      where: { id },
    });

    logger.info(`Trading strategy deleted: ${id} by ${user.walletAddress}`);

    res.json({ message: 'Trading strategy deleted successfully' });
  } catch (error) {
    logger.error('Error deleting trading strategy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStrategyExecutions = async (req: Request, res: Response) => {
  try {
    const { strategyId } = req.params;
    const user = (req as any).user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Verify strategy ownership
    const strategy = await prisma.tradingStrategy.findFirst({
      where: {
        id: strategyId,
        userId: user.walletAddress,
      },
    });

    if (!strategy) {
      return res.status(404).json({ error: 'Trading strategy not found' });
    }

    const [executions, total] = await Promise.all([
      prisma.strategyExecution.findMany({
        where: { strategyId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.strategyExecution.count({
        where: { strategyId },
      }),
    ]);

    res.json({
      executions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching strategy executions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
