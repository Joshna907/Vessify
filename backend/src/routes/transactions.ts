import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { auth } from '../lib/auth';
import { prisma } from '../lib/prisma';
import { extractTransaction } from '../lib/extractor';

// Define Variables type for Hono
type Variables = {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
}

const app = new Hono<{ Variables: Variables }>();

// Middleware to get user from session
// Middleware to get user from session
const protect = async (c: any, next: any) => {
    const authHeader = c.req.header('Authorization');

    let session = await auth.api.getSession({
        headers: c.req.raw.headers
    });

    // Fallback: If no session found via cookies, try Bearer token
    if (!session && authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        // Manual DB Check (Bypassing strict cookie checks)
        const dbSession = await prisma.session.findFirst({
            where: { token },
            include: { user: true }
        });

        if (dbSession && dbSession.expiresAt > new Date()) {
            session = {
                session: dbSession,
                user: dbSession.user
            } as any;
        }
    }

    if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    c.set('user', session.user);
    c.set('session', session.session);
    await next();
}

app.use('*', protect);

const extractSchema = z.object({
    text: z.string().min(1),
    organizationId: z.string().optional() // Optional if filtering by active org header
});

// POST /api/transactions/extract
app.post('/extract', zValidator('json', extractSchema), async (c) => {
    const { text, organizationId } = c.req.valid('json');
    const user = c.get('user');
    const session = c.get('session');

    // Multi-tenancy check: Ensure user belongs to organization
    // If organizationId is not provided, we might need a default or error
    // For now, let's assume the frontend sends the active organization ID
    // Or we verify if the user has a personal workspace/team.

    let targetOrgId = organizationId;

    if (!targetOrgId) {
        // Fallback: Use the first organization the user is a member of, or error?
        // Better Auth keeps track of active org usually on client, but server side needs ID.
        // Let's query user's memberships
        // Fallback: Use the first organization the user is a member of, or create a default "Personal" one
        const member = await prisma.member.findFirst({
            where: { userId: user.id }
        });

        if (!member) {
            // Auto-provision a "Personal Workspace"
            const newOrg = await prisma.organization.create({
                data: {
                    name: "Personal Workspace",
                    slug: `personal-${user.id.slice(0, 8)}`,
                    members: {
                        create: {
                            userId: user.id,
                            role: "OWNER"
                        }
                    }
                }
            });
            targetOrgId = newOrg.id;
        } else {
            targetOrgId = member.organizationId;
        }
    }

    // Verify membership again to be strict
    const membership = await prisma.member.findFirst({
        where: {
            userId: user.id,
            organizationId: targetOrgId
        }
    });

    if (!membership) {
        return c.json({ error: "Forbidden: Not a member of this organization" }, 403);
    }

    // Run extraction logic
    const { transaction, confidence, method } = extractTransaction(text);

    if (!transaction) {
        return c.json({ error: "Could not extract transaction from text", confidence: 0 }, 422);
    }

    // Save to DB
    const saved = await prisma.transaction.create({
        data: {
            organizationId: targetOrgId,
            userId: user.id,
            description: transaction.description,
            amount: transaction.amount,
            currency: transaction.currency,
            date: transaction.date,
            type: transaction.type,
            category: transaction.category,
            rawText: text,
            confidence: confidence,
            status: confidence > 0.8 ? 'verified' : 'pending' // Auto-verify high confidence
        }
    });

    return c.json({
        success: true,
        data: saved,
        meta: { confidence, method }
    });
});

// GET /api/transactions
// Cursor-based pagination
app.get('/', async (c) => {
    const user = c.get('user');
    let organizationId = c.req.query('organizationId');
    const cursor = c.req.query('cursor');
    const limit = Number(c.req.query('limit')) || 20;

    if (!organizationId) {
        // Fallback: Find first organization
        // Fallback: Find first organization
        const member = await prisma.member.findFirst({
            where: { userId: user.id }
        });

        if (member) {
            organizationId = member.organizationId;
        } else {
            // If no org exists (unlikely if they just posted, but possible if they hit GET first), create one
            const newOrg = await prisma.organization.create({
                data: {
                    name: "Personal Workspace",
                    slug: `personal-${user.id.slice(0, 8)}`,
                    members: {
                        create: {
                            userId: user.id,
                            role: "OWNER"
                        }
                    }
                }
            });
            organizationId = newOrg.id;
        }
    }

    // Strict Isolation Check
    const membership = await prisma.member.findFirst({
        where: {
            userId: user.id,
            organizationId: organizationId
        }
    });

    if (!membership) {
        return c.json({ error: "Forbidden" }, 403);
    }

    const transactions = await prisma.transaction.findMany({
        take: limit + 1, // Fetch one extra to determine next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { date: 'desc' },
        where: {
            organizationId: organizationId
        }
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (transactions.length > limit) {
        const nextItem = transactions.pop();
        nextCursor = nextItem?.id;
    }

    return c.json({
        data: transactions,
        nextCursor,
        organizationId // Useful for frontend to know which org was used
    });
});

export default app;
