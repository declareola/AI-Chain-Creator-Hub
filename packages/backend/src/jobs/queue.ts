import { Queue, Worker } from 'bullmq';
import { redisConfig, queueConfig } from '../config/redis';
import { logger } from '../utils/logger';

const queueName = 'default';

export const queue = new Queue(queueName, {
  connection: redisConfig,
  defaultJobOptions: queueConfig.defaultJobOptions,
});

export const worker = new Worker(
  queueName,
  async (job) => {
    logger.info(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'ai-generation': {
        const { processAIGeneration } = await import('./aiGenerationJob');
        return await processAIGeneration(job);
      }
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed: ${err.message}`);
});
