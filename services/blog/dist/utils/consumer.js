import amqp from 'amqplib';
import { redisClient } from '../server.js';
import { sql } from './db.js';
;
export const startCacheConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT),
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASS
        });
        const channel = await connection.createChannel();
        const queueName = "cache-invalidation";
        await channel.assertQueue(queueName, { durable: true });
        console.log("Blog Service CacheConsumer Started ✅");
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    console.log("📥 Blog Service Recieved Cache Invalidation-Message", content);
                    if (content.action === "Invalidate Cache") {
                        for (const pattern of content.keys) {
                            const keys = await redisClient.keys(pattern);
                            if (keys.length > 0) {
                                await redisClient.del(...keys);
                                console.log(`Blog service invalidated ${keys.length} cache keys matchin: ${pattern}`);
                                const searchQuery = "";
                                const category = "";
                                const cacheKey = `blogs:${searchQuery}:${category}`;
                                const blogs = await sql `SELECT * FROM blogs ORDER BY created_at DESC`;
                                await redisClient.set(cacheKey, JSON.stringify(blogs), { ex: 36000 });
                                console.log(`Cache Rebuild With ${cacheKey}`);
                            }
                        }
                    }
                    channel.ack(msg);
                }
                catch (error) {
                    console.error(`Error Processing Cache Validation in Blog Service`, error);
                    channel.nack(msg, false, true);
                }
            }
        });
    }
    catch (error) {
        console.error(`Failed to start service to rabbit consumer`);
    }
};
