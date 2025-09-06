import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const getVibeBalance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    let balance = await prisma.vibeCoinBalance.findUnique({
      where: { userId: user.walletAddress },
    });

    if (!balance) {
      // Create balance record if it doesn't exist
      balance = await prisma.vibeCoinBalance.create({
        data: {
          userId: user.walletAddress,
          balance: '0',
        },
      });
    }

    res.json({
      balance: balance.balance,
      lastUpdated: balance.lastUpdated,
    });
  } catch (error) {
    logger.error('Error fetching VibeCoin balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateVibeBalance = async (req: Request, res: Response) => {
  try {
    const { amount, operation } = req.body; // operation: 'add', 'subtract'
    const user = (req as any).user;

    if (!amount || !operation) {
      return res.status(400).json({ error: 'Amount and operation are required' });
    }

    if (!['add', 'subtract'].includes(operation)) {
      return res.status(400).json({ error: 'Invalid operation. Must be "add" or "subtract"' });
    }

    let balance = await prisma.vibeCoinBalance.findUnique({
      where: { userId: user.walletAddress },
    });

    if (!balance) {
      balance = await prisma.vibeCoinBalance.create({
        data: {
          userId: user.walletAddress,
          balance: '0',
        },
      });
    }

    const currentBalance = BigInt(balance.balance);
    const changeAmount = BigInt(amount);

    let newBalance: bigint;
    if (operation === 'add') {
      newBalance = currentBalance + changeAmount;
    } else {
      if (currentBalance < changeAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      newBalance = currentBalance - changeAmount;
    }

    const updatedBalance = await prisma.vibeCoinBalance.update({
      where: { userId: user.walletAddress },
      data: {
        balance: newBalance.toString(),
        lastUpdated: new Date(),
      },
    });

    logger.info(`VibeCoin balance updated for ${user.walletAddress}: ${operation} ${amount}`);

    res.json({
      balance: updatedBalance.balance,
      lastUpdated: updatedBalance.lastUpdated,
    });
  } catch (error) {
    logger.error('Error updating VibeCoin balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getVibeTransactions = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: user.walletAddress,
          currency: 'VIBE',
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.transaction.count({
        where: {
          userId: user.walletAddress,
          currency: 'VIBE',
        },
      }),
    ]);

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching VibeCoin transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const transferVibe = async (req: Request, res: Response) => {
  try {
    const { toAddress, amount } = req.body;
    const user = (req as any).user;

    if (!toAddress || !amount) {
      return res.status(400).json({ error: 'Recipient address and amount are required' });
    }

    // Check sender balance
    const senderBalance = await prisma.vibeCoinBalance.findUnique({
      where: { userId: user.walletAddress },
    });

    if (!senderBalance) {
      return res.status(400).json({ error: 'Sender has no VibeCoin balance' });
    }

    const currentBalance = BigInt(senderBalance.balance);
    const transferAmount = BigInt(amount);

    if (currentBalance < transferAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update sender balance
    const newSenderBalance = currentBalance - transferAmount;
    await prisma.vibeCoinBalance.update({
      where: { userId: user.walletAddress },
      data: {
        balance: newSenderBalance.toString(),
        lastUpdated: new Date(),
      },
    });

    // Update or create recipient balance
    const recipientBalance = await prisma.vibeCoinBalance.findUnique({
      where: { userId: toAddress },
    });

    if (recipientBalance) {
      const newRecipientBalance = BigInt(recipientBalance.balance) + transferAmount;
      await prisma.vibeCoinBalance.update({
        where: { userId: toAddress },
        data: {
          balance: newRecipientBalance.toString(),
          lastUpdated: new Date(),
        },
      });
    } else {
      await prisma.vibeCoinBalance.create({
        data: {
          userId: toAddress,
          balance: transferAmount.toString(),
        },
      });
    }

    // Record transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.walletAddress,
        transactionHash: `internal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionType: 'transfer',
        fromAddress: user.walletAddress,
        toAddress,
        amount: transferAmount.toString(),
        currency: 'VIBE',
        status: 'confirmed',
      },
    });

    logger.info(`VibeCoin transfer: ${user.walletAddress} -> ${toAddress}, amount: ${amount}`);

    res.json({
      transaction,
      newBalance: newSenderBalance.toString(),
    });
  } catch (error) {
    logger.error('Error transferring VibeCoin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
