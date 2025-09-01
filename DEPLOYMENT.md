# Deployment Guide

This guide covers the deployment process for AI-Chain-Creator-Hub across different environments.

## Environments

### Development
- Local development setup
- Hot reloading enabled
- Debug logging

### Staging
- Mirrors production environment
- Used for integration testing
- Base Sepolia testnet

### Production
- Base mainnet
- Optimized builds
- Production logging and monitoring

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis (for job queue)
- Docker and Docker Compose
- AWS/GCP account for cloud deployment

## Local Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up local PostgreSQL and Redis
4. Copy `.env.example` to `.env` and configure
5. Run database migrations: `npm run migrate`
6. Start development servers: `npm run dev`

## Contract Deployment

### Testnet (Base Sepolia)
```bash
cd packages/contracts
npm run compile
npm run test
npm run deploy:sepolia
```

### Mainnet (Base)
```bash
npm run deploy:mainnet
```

## Backend Deployment

### Using Docker
```bash
docker build -t aichain-backend .
docker run -p 3001:3001 aichain-backend
```

### Cloud Deployment
- AWS ECS/Fargate
- Google Cloud Run
- Vercel for serverless functions

## Frontend Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Static Hosting
```bash
npm run export
# Deploy dist/ to S3/Cloudflare Pages
```

## Database Setup

### Local
```bash
createdb aichain_creator_hub
npm run migrate
```

### Production
- Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
- Set up automated backups
- Configure connection pooling

## Environment Variables

### Required Variables
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `RPC_URL`
- `PRIVATE_KEY`
- `OPENAI_API_KEY`

### Optional Variables
- `SENTRY_DSN`
- `ANALYTICS_ID`
- `NOTIFICATION_WEBHOOK`

## Monitoring and Logging

- Application logs: Winston with structured logging
- Error tracking: Sentry
- Performance monitoring: New Relic or DataDog
- Uptime monitoring: Pingdom or UptimeRobot

## Scaling Considerations

- Horizontal scaling for backend services
- Database read replicas
- CDN for static assets
- Rate limiting and caching layers

## Rollback Procedures

1. Identify the issue
2. Stop new deployments
3. Roll back to previous version
4. Monitor system health
5. Communicate with users if necessary
