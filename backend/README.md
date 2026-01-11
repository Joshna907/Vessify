# Vessify Internship - Backend

This is the backend service for the Personal Finance Transaction Extractor.
Built with **Hono**, **Prisma**, and **Better Auth**.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (NeonDB recommended)

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in your values.
    ```bash
    cp .env.example .env
    ```
    *   `DATABASE_URL`: Your NeonDB connection string.
    *   `BETTER_AUTH_SECRET`: Generate a random string.

3.  **Database Setup**
    Push the schema to your database:
    ```bash
    npx prisma db push
    ```

## Running the Server

```bash
npm start
# or for development
npm run dev
```
The server runs on port 4000 by default.

## Testing

Run the Jest test suite (Auth + Extraction + Isolation):
```bash
npm test
```

## API Endpoints

-   `POST /api/auth/*`: Managed by Better Auth.
-   `POST /api/transactions/extract`: Extract transaction from text.
-   `GET /api/transactions`: List user transactions (cursor paginated).

## Security & Multi-tenancy
This backend uses a strict **Organization-based** isolation model.
-   Users must belong to an Organization to save/view transactions.
-   Middleware verifies `(userId, organizationId)` membership for EVERY protected request.
