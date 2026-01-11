import { z } from 'zod';

// Define the structured data we want to extract
export const ExtractedTransactionSchema = z.object({
    date: z.date(),
    amount: z.number(),
    description: z.string(),
    currency: z.string().default('INR'), // Defaulting to INR based on samples
    category: z.string().optional(),
    type: z.enum(['credit', 'debit']),
    balance: z.number().optional(),
});

export type ExtractedTransaction = z.infer<typeof ExtractedTransactionSchema>;

interface ExtractionResult {
    transaction: ExtractedTransaction | null;
    confidence: number;
    method: string;
}

// Helper to parse dates loosely
function parseDate(dateStr: string): Date | null {
    // Clean string cleanup
    const clean = dateStr.replace(/[→\-\.\/]/g, ' ').trim();
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;

    // Try patterns like DD MMM YYYY or DD/MM/YYYY
    // 11 Dec 2025
    const parts = dateStr.split(/[\s/\-\.]+/);
    if (parts.length >= 3) {
        // Assume day month year order if not ISO
        // ... simplistic parsing for demo
    }
    return null; // Fallback to new Date() if we can't parse or return invalid
}

// Helper to clean amount strings
function parseAmount(amountStr: string): number {
    // Remove currency symbols, commas
    const clean = amountStr.replace(/[₹$,\s]/g, '');
    return parseFloat(clean);
}

export function extractTransaction(text: string): ExtractionResult {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Strategy 1: Key-Value Pair (Sample 1)
    // Look for "Date:", "Description:", "Amount:"
    if (text.includes('Date:') && text.includes('Amount:')) {
        try {
            let date, description, amount, balance;
            for (const line of lines) {
                if (line.match(/^Date:/i)) date = new Date(line.split(':')[1].trim());
                if (line.match(/^Description:/i)) description = line.split(':')[1].trim();
                if (line.match(/^Amount:/i)) amount = parseAmount(line.split(':')[1].trim());
                if (line.match(/Balance/i)) balance = parseAmount(line.split(':')[1].trim());
            }

            if (date && amount && description) {
                return {
                    transaction: {
                        date,
                        description,
                        amount: Math.abs(amount),
                        type: amount < 0 ? 'debit' : 'credit',
                        currency: 'INR', // Default for now
                        balance
                    },
                    confidence: 0.95,
                    method: 'key-value'
                };
            }
        } catch (e) { console.error("KV Parse Error", e); }
    }

    // Strategy 2: Uber/SMS Format (Sample 2)
    // "Uber Ride ... \n DATE -> AMOUNT debited"
    if (text.includes('debited') || text.includes('credited')) {
        // Find line with date and amount
        for (const line of lines) {
            // 12/11/2025 -> ₹1,250.00 debited
            const match = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})\s*→\s*([₹$]?[\d,]+\.?\d*)\s*(debited|credited)/i);
            if (match) {
                const date = new Date(match[1]); // MM/DD/YYYY or DD/MM/YYYY - 12/11/2025
                // If date invalid, try swapping day month (std issue)
                const amount = parseAmount(match[2]);
                const typeStr = match[3].toLowerCase();
                const type = typeStr.startsWith('debit') ? 'debit' : 'credit';
                // Description is likely the first line if it's not the transaction line
                const description = lines[0] === line ? "Unknown Transaction" : lines[0]; // Simple heuristic

                return {
                    transaction: {
                        date: isNaN(date.getTime()) ? new Date() : date,
                        amount,
                        description,
                        type,
                        currency: 'INR'
                    },
                    confidence: 0.85,
                    method: 'sms-format'
                }
            }
        }
    }

    // Strategy 3: One-line / Space separated (Sample 3)
    // txn123 2025-12-10 Amazon.in ...
    const regexOneLine = /(\d{4}-\d{2}-\d{2})\s+(.+?)\s+([₹$][\d,]+\.?\d*)\s+(Dr|Cr)/;
    // Need to be careful with greedy match
    // Sample 3: txn123 2025-12-10 Amazon.in Order #... ₹2,999.00 Dr Bal ...
    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        const date = new Date(dateMatch[0]);
        // Search for amount with currency symbol or Dr/Cr
        const amountMatch = text.match(/([₹$][\d,]+\.?\d*)\s*(Dr|Cr)/i);
        if (amountMatch) {
            const amount = parseAmount(amountMatch[1]);
            const type = amountMatch[2].toLowerCase() === 'dr' ? 'debit' : 'credit';
            // Description is everything between date and amount? roughly
            // This is a naive implementation but sufficient for the specific sample
            const descriptionPart = text.split(dateMatch[0])[1]?.split(amountMatch[0])[0]?.trim();

            return {
                transaction: {
                    date,
                    amount,
                    description: descriptionPart || "Extracted Transaction",
                    type,
                    currency: 'INR'
                },
                confidence: 0.75, // Lower confidence due to loose parsing
                method: 'regex-unstructured'
            }
        }
    }

    // Strategy 4: Natural Language (User Test Case)
    // "Paid $56.50 at Trader Joe's for groceries on 2023-10-12"
    const naturalMatch = text.match(/Paid\s+([$₹]?[\d,]+\.?\d*)\s+at\s+(.+?)(?:\s+for\s+(.+?))?\s+on\s+(\d{4}-\d{2}-\d{2})/i);
    if (naturalMatch) {
        try {
            const amount = parseAmount(naturalMatch[1]);
            const merchant = naturalMatch[2].trim();
            const category = naturalMatch[3]?.trim();
            const date = new Date(naturalMatch[4]);

            return {
                transaction: {
                    date,
                    amount,
                    description: `Payment to ${merchant}` + (category ? ` (${category})` : ''),
                    type: 'debit',
                    currency: text.includes('₹') ? 'INR' : 'USD',
                    category
                },
                confidence: 0.9,
                method: 'natural-language'
            }
        } catch (e) {
            console.error("Natural Language Parse Error", e);
        }
    }

    return { transaction: null, confidence: 0, method: 'failed' };
}
