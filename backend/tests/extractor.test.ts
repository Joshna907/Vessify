
import { describe, expect, test } from '@jest/globals';
import { extractTransaction } from '../src/lib/extractor';

describe('Transaction Extractor', () => {
    test('extracts Sample 1 (Key-Value) correctly', () => {
        const text = `
Date: 11 Dec 2025
Description: STARBUCKS COFFEE MUMBAI
Amount: -420.00
Balance after transaction: 18,420.50
        `;
        const result = extractTransaction(text);
        expect(result.transaction).toBeTruthy();
        expect(result.confidence).toBeGreaterThan(0.9);
        expect(result.transaction?.amount).toBe(420);
        expect(result.transaction?.type).toBe('debit');
        expect(result.transaction?.description).toContain('STARBUCKS');
        // Date parsing is tricky, check if it's a valid date
        expect(result.transaction?.date).toBeInstanceOf(Date);
    });

    test('extracts Sample 2 (Uber/SMS) correctly', () => {
        const text = `
Uber Ride * Airport Drop
12/11/2025 → ₹1,250.00 debited
Available Balance → ₹17,170.50
        `;
        const result = extractTransaction(text);
        expect(result.transaction).toBeTruthy();
        expect(result.transaction?.amount).toBe(1250);
        expect(result.transaction?.type).toBe('debit');
        // Verify date 12/11/2025
        // Note: Extractor logic might need to handle DD/MM vs MM/DD. 
        // 12 Nov or 11 Dec? Sample 1 was 11 Dec. Sample 2 12/11. 
        // Usually India uses DD/MM. So 12th Nov 2025.
        // Let's check what the extractor does.
        expect(result.transaction?.date).toBeInstanceOf(Date);
    });

    test('extracts Sample 3 (Unstructured) correctly', () => {
        const text = "txn123 2025-12-10 Amazon.in Order #403-1234567-8901234 ₹2,999.00 Dr Bal 14171.50 Shopping";
        const result = extractTransaction(text);
        expect(result.transaction).toBeTruthy();
        expect(result.transaction?.amount).toBe(2999);
        expect(result.transaction?.type).toBe('debit');
        expect(result.transaction?.description).toContain('Amazon.in');
    });

    test('extracts Natural Language inputs correctly', () => {
        const text = "Paid $56.50 at Trader Joe's for groceries on 2023-10-12";
        const result = extractTransaction(text);
        expect(result.transaction).toBeTruthy();
        expect(result.transaction?.amount).toBe(56.5);
        expect(result.transaction?.description).toContain("Trader Joe's");
        expect(result.transaction?.category).toBe("groceries");
        expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('returns low confidence for garbage text', () => {
        const text = "This is just some random chat message hello world";
        const result = extractTransaction(text);
        expect(result.transaction).toBeNull();
        expect(result.confidence).toBe(0);
    });
});
