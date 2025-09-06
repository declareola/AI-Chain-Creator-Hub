import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const getNFTs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, owner, creator, rarity } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (owner) where.ownerAddress = owner;
    if (creator) where.creatorAddress = creator;
    if (rarity) where.rarity = rarity;

    const [nfts, total] = await Promise.all([
      prisma.nFT.findMany({
        where,
        include: {
          creator: {
            select: { walletAddress: true, username: true, displayName: true },
          },
          owner: {
            select: { walletAddress: true, username: true, displayName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.nFT.count({ where }),
    ]);

    res.json({
      nfts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching NFTs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNFTById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const nft = await prisma.nFT.findUnique({
      where: { id },
      include: {
        creator: {
          select: { walletAddress: true, username: true, displayName: true },
        },
        owner: {
          select: { walletAddress: true, username: true, displayName: true },
        },
        listing: true,
      },
    });

    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    res.json({ nft });
  } catch (error) {
    logger.error('Error fetching NFT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNFT = async (req: Request, res: Response) => {
  try {
    const {
      tokenId,
      contractAddress,
      name,
      description,
      imageUrl,
      metadataUrl,
      attributes,
      rarity,
      royaltyPercentage = 5,
    } = req.body;

    const user = (req as any).user;

    const nft = await prisma.nFT.create({
      data: {
        tokenId,
        contractAddress,
        name,
        description,
        imageUrl,
        metadataUrl,
        attributes,
        rarity,
        creatorAddress: user.walletAddress,
        ownerAddress: user.walletAddress,
        royaltyPercentage,
      },
    });

    logger.info(`NFT created: ${nft.id} by ${user.walletAddress}`);

    res.status(201).json({ nft });
  } catch (error) {
    logger.error('Error creating NFT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserNFTs = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [nfts, total] = await Promise.all([
      prisma.nFT.findMany({
        where: { ownerAddress: user.walletAddress },
        include: {
          listing: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.nFT.count({
        where: { ownerAddress: user.walletAddress },
      }),
    ]);

    res.json({
      nfts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching user NFTs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
