import express from 'express';
import {
  getTradingStrategies,
  createTradingStrategy,
  getTradingStrategyById,
  updateTradingStrategy,
  deleteTradingStrategy,
  getStrategyExecutions,
} from '../controllers/traderController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/trader/strategies', authenticateJWT, getTradingStrategies);
router.post('/trader/strategies', authenticateJWT, createTradingStrategy);
router.get('/trader/strategies/:id', authenticateJWT, getTradingStrategyById);
router.put('/trader/strategies/:id', authenticateJWT, updateTradingStrategy);
router.delete('/trader/strategies/:id', authenticateJWT, deleteTradingStrategy);
router.get('/trader/strategies/:strategyId/executions', authenticateJWT, getStrategyExecutions);

export default router;
