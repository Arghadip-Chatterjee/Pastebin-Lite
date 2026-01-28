import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

export type PasteResult = {
    content: string;
    remaining_views: number | null;
    expires_at: string | null;
} | null;

export async function createPaste(
    content: string,
    ttl_seconds?: number,
    max_views?: number,
    now: number = Date.now()
): Promise<{ id: string }> {
    const id = nanoid(8);
    const key = `paste:${id}`;

    // Calculate expiry
    let expiresAt = null;
    if (ttl_seconds) {
        expiresAt = now + (ttl_seconds * 1000);
    }

    const pasteData = {
        content,
        maxViews: max_views ?? null, // Store null if undefined
        viewsUsed: 0,
        expiresAt,
        createdAt: now,
    };

    // Save to Redis
    await redis.hset(key, pasteData);

    // We do NOT set redis.expire(key, ttl) here because it would prevent
    // deterministic testing with "time travel" (e.g. creating a paste
    // and then simulating a time BEFORE it expires, even if server time passed).
    // The application logic handles expiry via 'expiresAt'.

    return { id };
}

export async function getPaste(id: string, now: number = Date.now()): Promise<PasteResult> {
    const key = `paste:${id}`;

    // Lua script logic (same as API)
    const script = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])

      local fields = redis.call('HMGET', key, 'expiresAt', 'maxViews', 'viewsUsed', 'content')
      local expiresAt = fields[1]
      local maxViews = fields[2]
      local viewsUsed = tonumber(fields[3] or '0')
      local content = fields[4]

      if not content then return nil end

      -- Check TTL
      if expiresAt and expiresAt ~= '' then
          local exp = tonumber(expiresAt)
          if exp and exp <= now then
             return nil
          end
      end

      -- Check View Limit
      if maxViews and maxViews ~= '' then
          local max = tonumber(maxViews)
          if max and viewsUsed >= max then
             return nil
          end
      end

      -- Increment
      redis.call('HINCRBY', key, 'viewsUsed', 1)
      
      -- Return data needed for response
      return {content, maxViews, viewsUsed + 1, fields[1]} 
    `;

    const result = await redis.eval(script, [key], [now]);

    if (!result) return null;

    const [content, maxViews, currentViews, expiresAt] = result as [string, string | null, number, string | null];

    let remaining_views = null;
    if (maxViews) {
        remaining_views = parseInt(maxViews) - currentViews;
        if (remaining_views < 0) remaining_views = 0;
    }

    return {
        content,
        remaining_views,
        expires_at: expiresAt ? new Date(parseInt(expiresAt)).toISOString() : null,
    };
}
