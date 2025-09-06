import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const getMarketplaceListings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, minPrice, maxPrice, currency = 'ETH' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };
    if (minPrice) where.price = { gte: minPrice };
    if (maxPrice) where.price = { ...where.price, lte: maxPrice };
    if (currency) where.currency = currency;

    const [listings, total] = await Promise.all([
      prisma.marketplaceListing.findMany({
        where,
        include: {
          nft: {
            include: {
              creator: {
                select: { walletAddress: true, username: true, displayName: true },
              },
              owner: {
                select: { walletAddress: true, username: true, displayName: true },
              },
            },
          },
          seller: {
            select: { walletAddress: true, username: true, displayName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.marketplaceListing.count({ where }),
    ]);

    res.json({
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching marketplace listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await prisma.marketplaceListing.findUnique({
      where: { id },
      include: {
        nft: {
          include: {
            creator: {
              select: { walletAddress: true, username: true, displayName: true },
            },
            owner: {
              select: { walletAddress: true, username: true, displayName: true },
            },
          },
        },
        seller: {
          select: { walletAddress: true, username: true, displayName: true },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ listing });
  } catch (error) {
    logger.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
    const { nftId, price, currency = 'ETH', expiresAt } = req.body;
    const user = (req as any).user;

    // Verify NFT ownership
    const nft = await prisma.nFT.findUnique({
      where: { id: nftId },
    });

    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    if (nft.ownerAddress !== user.walletAddress) {
      return res.status(403).json({ error: 'You do not own this NFT' });
    }

    // Check if NFT is already listed
    if (nft.isListed) {
      return res.status(400).json({ error: 'NFT is already listed' });
    }

    const listing = await prisma.marketplaceListing.create({
      data: {
        nftId,
        sellerId: user.walletAddress,
        price,
        currency,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        nft: true,
      },
    });

    // Update NFT status
    await prisma.nFT.update({
      where: { id: nftId },
      data: { isListed: true },
    });

    logger.info(`Listing created: ${listing.id} by ${user.walletAddress}`);

    res.status(201).json({ listing });
  } catch (error) {
    logger.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserListings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [listings, total] = await Promise.all([
      prisma.marketplaceListing.findMany({
        where: { sellerId: user.walletAddress },
        include: {
          nft: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.marketplaceListing.count({
        where: { sellerId: user.walletAddress },
      }),
    ]);

    res.json({
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching user listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
