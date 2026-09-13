# bind-email-service
Decoupled email microservice for Bind, consumes jobs from a Redis/BullMQ queue, sends via SMTP (Brevo's free relay by default), and logs delivery status to MongoDB.

## Running locally

1. `npm install`
2. Copy `.env.sample` to `.env` and fill in `REDIS_URL`, `MONGODB_URI`, and the SMTP credentials (see comments in the file).
3. `npm start` — starts the worker, listening for jobs on the `email-queue`.
4. In another terminal, `npm run test:send -- you@example.com` to push a test job through the pipeline (Redis -> BullMQ -> worker -> SMTP -> MongoDB log) without needing the `app/backend` producer running.
