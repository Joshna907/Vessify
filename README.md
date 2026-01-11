# Vessify Internship Assignment - Transaction Extractor

This repository contains the full stack implementation of the personal finance transaction extractor.

## Tech Stack
- **Backend**: Hono + TypeScript + Prisma + PostgreSQL (Better Auth for authentication)
- **Frontend**: Next.js 15 (App Router) + Shadcn UI + Tailwind CSS (Glassmorphism Dark Mode)
- **Auth**: Better Auth (Backend) + NextAuth v5 (Frontend wrapper)

## Project Structure
- `/backend`: Hono API server running on port 4000
- `/frontend`: Next.js application running on port 3000

## Setup Instructions

### 1. Database Setup
Ensure you have PostgreSQL running. Update the `.env` file in `backend/.env` with your database URL.

```bash
cd backend
npx prisma migrate dev
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Server starts at http://localhost:4000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:3000
```

## Features
- **Authentication**: Secure email/password login integrated with Better Auth.
- **Transaction Extraction**: Paste text from SMS/Emails, and the AI/Regex logic extracts Date, Amount, Description.
- **Data Isolation**: Users can only access their own transactions (Organization-based multi-tenancy).
- **Dashboard**: Real-time transaction list with "Load More" pagination.

## Samples to Test
**Sample 1**
```text
Date: 11 Dec 2025
Description: STARBUCKS COFFEE MUMBAI
Amount: -420.00
Balance after transaction: 18,420.50
```

**Sample 2**
```text
Uber Ride * Airport Drop
12/11/2025 → ₹1,250.00 debited
Available Balance → ₹17,170.50
```

**Sample 3 (Messy)**
```text
txn123 2025-12-10 Amazon.in Order #403-1234567-8901234 ₹2,999.00 Dr Bal 14171.50 Shopping
```

## Submission Details

### Test Credentials
Use these accounts to verify multi-tenancy and isolation:

**User 1 (Organization A):**
- **Email:** `test@example.com`
- **Password:** `password123`

**User 2 (Organization B):**
- **Email:** `demo@example.com`
- **Password:** `password123`

### Approach to Better Auth Integration
We implemented Better Auth using a **Dual-Layer Strategy**:
1.  **Backend (Primary):** Hono API uses Better Auth's core library with the Prisma Adapter. Middleware manually validates Sessions (supporting both Cookies and Bearer Tokens) to enforce `organizationId` scoping.
2.  **Frontend (Client):** NextAuth v5 acts as a lightweight wrapper, syncing the Session Token to the backend via headers. This ensures type-safe, secure calls from Client Components.

### Deployment
- **Frontend:** [Link to Vercel URL]
- **Backend:** [Link to Railway/Render URL]

## Testing
The backend includes a comprehensive test suite using Jest.

```bash
cd backend
npm test
```
This runs:
- **Unit Tests**: Verifying the extraction logic against sample texts.
- **Integration Tests**: Verifying API endpoints and Data Isolation (Auth/Organizations).
