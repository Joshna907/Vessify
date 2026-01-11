import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
    origin: ['http://localhost:3000'], // Adjust for frontend
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}))

app.get('/', (c) => {
    return c.text('Vessify API is running!')
})

import transactions from './routes/transactions'

// Auth Routes (Better Auth mounts its own routes usually, or we wrap them)
// With Better Auth Hono adapter or standard handler:
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
    return auth.handler(c.req.raw);
});

// Transaction Routes
app.route('/api/transactions', transactions);

const port = Number(process.env.PORT) || 4000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0'
})
