import express from 'express';
import {
  getMarketplaceListings,
  getListingById,
  createListing,
  getUserListings,
} from '../controllers/marketController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/market/listings', getMarketplaceListings);
router.get('/market/listings/user', authenticateJWT, getUserListings);
router.get('/market/listings/:id', getListingById);
router.post('/market/listings', authenticateJWT, createListing);

export default router;
