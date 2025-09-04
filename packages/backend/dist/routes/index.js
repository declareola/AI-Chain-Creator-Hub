"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// API Routes
router.get('/api/health', (req, res) => {
    res.json({
        status: 'API is healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// NFT Routes
router.get('/api/nfts', (req, res) => {
    res.json({ message: 'NFT routes will be implemented' });
});
// Marketplace Routes
router.get('/api/marketplace', (req, res) => {
    res.json({ message: 'Marketplace routes will be implemented' });
});
// User Routes
router.get('/api/users', (req, res) => {
    res.json({ message: 'User routes will be implemented' });
});
const setupRoutes = (app) => {
    app.use('/api', router);
};
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=index.js.map