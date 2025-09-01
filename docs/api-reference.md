# API Reference

This document provides reference for the AI-Chain-Creator-Hub backend APIs.

## Base URL
```
https://api.aichaincreatorhub.com
```

## Authentication
All API requests require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### AI Endpoints

#### Generate NFT
```http
POST /api/ai/generate-nft
```

Request Body:
```json
{
  "prompt": "A beautiful landscape",
  "style": "digital art",
  "userId": "user123"
}
```

Response:
```json
{
  "success": true,
  "nftId": "nft456",
  "imageUrl": "https://...",
  "metadata": {...}
}
```

#### Analyze Content
```http
POST /api/ai/analyze-content
```

Request Body:
```json
{
  "content": "Article text...",
  "type": "text"
}
```

Response:
```json
{
  "success": true,
  "analysis": {
    "sentiment": "positive",
    "keywords": ["AI", "Web3"],
    "summary": "Brief summary..."
  }
}
```

### NFT Endpoints

#### Mint NFT
```http
POST /api/nft/mint
```

Request Body:
```json
{
  "name": "My NFT",
  "description": "Description",
  "imageUrl": "https://...",
  "royaltyPercentage": 5
}
```

#### Get NFT Details
```http
GET /api/nft/{id}
```

### Marketplace Endpoints

#### List Item
```http
POST /api/marketplace/list
```

Request Body:
```json
{
  "nftId": "nft123",
  "price": "0.1",
  "currency": "ETH"
}
```

#### Purchase Item
```http
POST /api/marketplace/purchase
```

Request Body:
```json
{
  "listingId": "listing123",
  "buyerAddress": "0x..."
}
```

### Trader Endpoints

#### Create Trade Strategy
```http
POST /api/trader/strategy
```

Request Body:
```json
{
  "name": "Conservative Strategy",
  "riskLevel": "low",
  "parameters": {...}
}
```

#### Execute Trade
```http
POST /api/trader/execute
```

Request Body:
```json
{
  "strategyId": "strategy123",
  "amount": "100",
  "pair": "ETH/USD"
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/user/profile
```

#### Update Profile
```http
PUT /api/user/profile
```

Request Body:
```json
{
  "name": "John Doe",
  "bio": "AI Artist",
  "socialLinks": {...}
}
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {...}
  }
}
```

## Rate Limits
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

## WebSocket Events

Real-time updates via WebSocket at `/ws`:

- `nft:minted` - New NFT minted
- `trade:executed` - Trade completed
- `marketplace:sold` - Item sold

Example:
```javascript
const ws = new WebSocket('wss://api.aichaincreatorhub.com/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
