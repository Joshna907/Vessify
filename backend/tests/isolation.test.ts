import { Hono } from 'hono';
import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import transactionsApp from '../src/routes/transactions';
import { prisma } from '../src/lib/prisma';
import { auth } from '../src/lib/auth';

// Mock dependencies
jest.mock('../src/lib/prisma', () => ({
    prisma: {
        member: {
            findFirst: jest.fn(),
        },
        transaction: {
            create: jest.fn(),
            findMany: jest.fn(),
        }
    }
}));

jest.mock('../src/lib/auth', () => ({
    auth: {
        api: {
            getSession: jest.fn()
        }
    }
}));

describe('Transaction Routes Isolation', () => {
    const app = new Hono();
    // Simulate mounting
    app.route('/', transactionsApp);

    const mockUser = { id: 'user-1', email: 'user@test.com' };
    const mockSession = { userId: 'user-1', id: 'session-1' };

    beforeEach(() => {
        jest.clearAllMocks();
        (auth.api.getSession as any).mockResolvedValue({
            user: mockUser,
            session: mockSession
        });
    });

    test('POST /extract prevents access if user not in organization', async () => {
        // Mock that user is NOT a member of org-2
        (prisma.member.findFirst as any).mockResolvedValue(null);

        const res = await app.request('/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Some transaction text',
                organizationId: 'org-2'
            })
        });

        expect(res.status).toBe(403); // Forbidden
        expect(prisma.member.findFirst).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                userId: 'user-1',
                organizationId: 'org-2'
            }
        }));
    });

    test('POST /extract allows access if user IS a member', async () => {
        // Mock membership exists
        (prisma.member.findFirst as any).mockResolvedValue({ id: 'mem-1', role: 'member' });
        // Mock creation success
        (prisma.transaction.create as any).mockResolvedValue({
            id: 'txn-1',
            description: 'Test',
            amount: 100,
            organizationId: 'org-1'
        });

        const res = await app.request('/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Date: 01 Jan 2025\nAmount: 100\nDescription: Test',
                organizationId: 'org-1'
            })
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(true);
    });

    test('GET / enforces strict isolation by organizationId', async () => {
        // User tries to list transactions for org-3
        // Mock that user is NOT a member of org-3
        (prisma.member.findFirst as any).mockResolvedValue(null);

        const res = await app.request('/?organizationId=org-3', {
            method: 'GET'
        });

        expect(res.status).toBe(403);
    });

    test('GET / defaults to user organization if param missing', async () => {
        // Mock member lookup succeeds
        (prisma.member.findFirst as any).mockResolvedValue({ organizationId: 'org-1' });
        (prisma.transaction.findMany as any).mockResolvedValue([]);

        const res = await app.request('/', { method: 'GET' });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.organizationId).toBe('org-1');
    });
});
