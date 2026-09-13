// Manually enqueues one job onto "email-queue", the same queue app/backend
// pushes to in production. Run this while the worker (npm start) is running
// in another terminal, to exercise the full pipeline without touching the
// backend: Redis -> BullMQ -> emailWorker -> SMTP -> MongoDB log.
import { Queue } from "bullmq";
import redisClient from "../src/config/redisClient.js";

const queue = new Queue("email-queue", { connection: redisClient });

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run test:send -- you@example.com");
  process.exit(1);
}

const job = await queue.add("send-welcome", { email, name: "Test User" });
console.log(`Enqueued job [${job.id}] for ${email}. Watch the worker's console.`);

await queue.close();
process.exit(0);
