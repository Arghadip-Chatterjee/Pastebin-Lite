# Pastebin App

A secure, persistent Pastebin application built with Next.js and Upstash Redis.

## Features
- Create text pastes with optional **Time-to-Live (TTL)** and **Max View Limits**.
- Shareable URLs.
- Persistent storage using Redis.
- Deterministic testing support.

## Getting Started

### Prerequisites
- Node.js
- Upstash Redis credentials (URL & Token)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   Create a `.env` file with:
   ```env
   UPSTASH_REDIS_REST_URL=your_url
   UPSTASH_REDIS_REST_TOKEN=your_token
   # TEST_MODE=1  # Optional, for deterministic testing
   ```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Verification
Run the automated test suite against the running server:
```bash
node scripts/verify-pastebin.js
```

## API Reference
- `GET /api/healthz`: Service health.
- `POST /api/pastes`: Create paste. Body: `{ content, ttl_seconds?, max_views? }`.
- `GET /api/pastes/:id`: Retrieve paste.
