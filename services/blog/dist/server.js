import express from 'express';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog.js';
import { Redis } from '@upstash/redis';
import { startCacheConsumer } from './utils/consumer.js';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
startCacheConsumer();
export const redisClient = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN, // You might need this depending on your Upstash setup
});
try {
    await redisClient.ping();
    console.log("Redis is connected...");
}
catch (error) {
    console.error("Redis connection failed:", error);
}
app.use("/api/v1", blogRoutes);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
