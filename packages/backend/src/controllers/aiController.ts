import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { queue } from '../jobs/queue';

const prisma = new PrismaClient();

export const generateAI = async (req: Request, res: Response) => {
  try {
    const { prompt, model = 'gpt-4', cost = 10 } = req.body;
    const user = (req as any).user;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Create AI generation record with pending status
    const aiGeneration = await prisma.aIGeneration.create({
      data: {
        userId: user.walletAddress,
        prompt,
        model,
        cost,
        status: 'pending',
      },
    });

    // Add job to queue
    await queue.add('ai-generation', {
      userId: user.walletAddress,
      prompt,
      model,
      generationId: aiGeneration.id,
    });

    logger.info(`AI generation job queued for user: ${user.walletAddress}`);

    res.json({
      success: true,
      generation: aiGeneration,
      message: 'AI generation job has been queued for processing',
    });
  } catch (error) {
    logger.error('Error queuing AI generation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAIGenerations = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [generations, total] = await Promise.all([
      prisma.aIGeneration.findMany({
        where: { userId: user.walletAddress },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.aIGeneration.count({
        where: { userId: user.walletAddress },
      }),
    ]);

    res.json({
      generations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching AI generations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAIGenerationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const generation = await prisma.aIGeneration.findFirst({
      where: {
        id,
        userId: user.walletAddress,
      },
    });

    if (!generation) {
      return res.status(404).json({ error: 'AI generation not found' });
    }

    res.json({ generation });
  } catch (error) {
    logger.error('Error fetching AI generation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
