# Pastebin Lite App

A secure, persistent Pastebin application built with Next.js and Upstash Redis.

## Features
- **Create Pastes**: Securely save text snippets.
- **Expiration Control**: Optional "Time-to-Live" (TTL) to automatically expire pastes.
- **View Limits**: Optional "Max View Limits" to burn pastes after a certain number of reads.
- **Shareable URLs**: Easy access to your shared content.
- **Persistent Storage**: Robust storage using Upstash Redis.
- **Deterministic Testing**: Built-in support for time-travel testing.

## Getting Started

### Prerequisites
- Node.js (v18+)
- An [Upstash Redis](https://upstash.com/) database (URL & Token)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   # Upstash Redis Configuration
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token

   # App Base URL
   BASE_URL=http://localhost:3000

   # Optional: Set to 1 to enable deterministic testing headers
   # TEST_MODE=1
   ```

### Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack & Persistence
- **Framework**: Next.js 14 (App Router)
- **Database**: [Upstash Redis](https://upstash.com/) (Serverless Redis)
- **Styling**: Tailwind CSS
- **ID Generation**: `nanoid` for collision-resistant, URL-friendly IDs.

## Important Design Decisions

### 1. Application-Level TTL Management
Instead of relying on native Redis key expiration (`EXPIRE`), we handle TTL logic at the application layer.
- **Why?** This allows for **deterministic testing**. We can simulate "time travel" by injecting a mocked timestamp (`x-test-now-ms` header) to verify if a paste expires correctly without waiting for real time to pass.
- **Implementation**: The `expiresAt` timestamp is stored in the Redis hash. A Lua script checks this value against the current (or mocked) time during every read request.

### 2. Atomic Operations with Lua
To ensure data integrity specifically for **Max View Limits**, we use a custom Lua script for fetching pastes.
- **Race Condition Prevention**: Traditional "read-check-increment" logic usually suffers from race conditions under high load (e.g., 50 people viewing a "1-time view" paste simultaneously might all see it).
- **Solution**: Our Lua script atomically:
  1. Fetches the paste data.
  2. Checks if `expiresAt` has passed.
  3. Checks if `viewsUsed` >= `maxViews`.
  4. Increments `viewsUsed` and returns the content *only if* all checks pass.
  This guarantees that a paste with 1 max view is truly viewed only once.

### 3. Serverless Compatibility
The architecture is fully stateless and designed for serverless environments (like Vercel), leveraging Upstash's HTTP-based Redis client (`@upstash/redis`) which handles connection pooling and works perfectly in edge functions.

Redis is used instead of a traditional database because the application requires **atomic view counting and precise expiry enforcement** under concurrent access, which Redis supports naturally with simple key-based operations. Unlike in-memory storage or databases such as MongoDB or Postgres that require additional transactional logic, Redis provides a cleaner and more reliable approach for this workload. The system uses a **soft-delete strategy**, where expired or exhausted pastes are marked unavailable by logic rather than immediately relying on infrastructure-level deletion, allowing deterministic expiry testing while still enabling optional lazy cleanup from Redis when accessed.

The application is built using Next.js as a full-stack framework, leveraging server-side rendering and server-handled API routes, ensuring all validation, constraint enforcement, and data access are performed securely on the server without relying on client-side state.

