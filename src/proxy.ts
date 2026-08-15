import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis only if tokens are provided
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;
if (redisUrl && redisToken) {
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds per IP
    analytics: true,
  });
}

export async function proxy(request: NextRequest) {
  // Only apply rate limiting to community API routes
  if (request.nextUrl.pathname.startsWith('/api/community') && request.method === 'POST') {
    if (!ratelimit) {
      // If Upstash is not configured, just let it pass (development mode)
      return NextResponse.next();
    }

    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'You are being rate limited. Please try again later.'
        }),
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
