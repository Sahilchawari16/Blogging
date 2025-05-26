import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: amqp.Channel;

export const connectRabbitMQ = async() =>{
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT),
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASS
        });

        channel = await connection.createChannel();

        console.log("Connection to RabbitMQ ✅");
    } catch (error) {
        console.log("Error in Connection in RabbitMQ ❌", error);
    }
};

export const publishToQueue = async(queueName: string, message: any) => {
    if(!channel){
        console.error("RabbitMQ channel is not initialized");
        return;
    }

    await channel.assertQueue(queueName, {durable: true});

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {persistent: true});
};


export const invalidateCacheJob = async(cacheKeys: string[])=>{
    try {
        const message = {
            action: "Invalidate Cache",
            keys: cacheKeys
        };

        await publishToQueue("cache-invalidation", message);
        console.log("Cache invalidation job publish ✅");
    } catch (error) {
        console.error("Failed to publish cache in RabbitMq ❌", error);
    }
}