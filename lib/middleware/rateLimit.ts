/**
 * Simple in-memory rate limiter
 * For production, consider using Redis (Upstash) for distributed rate limiting
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

class RateLimiter {
    private requests: Map<string, RateLimitEntry> = new Map()
    private cleanupInterval: NodeJS.Timeout

    constructor() {
        // Clean up expired entries every minute
        this.cleanupInterval = setInterval(() => {
            const now = Date.now()
            for (const [key, entry] of this.requests.entries()) {
                if (now > entry.resetTime) {
                    this.requests.delete(key)
                }
            }
        }, 60000)
    }

    /**
     * Check if a request should be rate limited
     * @param identifier - Unique identifier (e.g., IP address, user ID)
     * @param limit - Maximum number of requests allowed
     * @param windowMs - Time window in milliseconds
     * @returns Object with allowed status and remaining requests
     */
    check(
        identifier: string,
        limit: number = 100,
        windowMs: number = 60000
    ): { allowed: boolean; remaining: number; resetTime: number } {
        const now = Date.now()
        const entry = this.requests.get(identifier)

        if (!entry || now > entry.resetTime) {
            // First request or window expired
            const resetTime = now + windowMs
            this.requests.set(identifier, { count: 1, resetTime })
            return { allowed: true, remaining: limit - 1, resetTime }
        }

        if (entry.count >= limit) {
            // Rate limit exceeded
            return { allowed: false, remaining: 0, resetTime: entry.resetTime }
        }

        // Increment count
        entry.count++
        this.requests.set(identifier, entry)
        return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime }
    }

    /**
     * Reset rate limit for a specific identifier
     */
    reset(identifier: string): void {
        this.requests.delete(identifier)
    }

    /**
     * Clean up and stop the cleanup interval
     */
    destroy(): void {
        clearInterval(this.cleanupInterval)
        this.requests.clear()
    }
}

export const rateLimiter = new RateLimiter()

/**
 * Helper function to get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")

    if (forwarded) {
        return forwarded.split(",")[0].trim()
    }

    if (realIp) {
        return realIp
    }

    // Fallback to a default identifier
    return "unknown"
}

/**
 * Middleware helper for API routes
 */
export function withRateLimit(
    handler: (req: Request) => Promise<Response>,
    options: { limit?: number; windowMs?: number } = {}
) {
    return async (req: Request): Promise<Response> => {
        const identifier = getClientIdentifier(req)
        const { limit = 100, windowMs = 60000 } = options

        const { allowed, remaining, resetTime } = rateLimiter.check(identifier, limit, windowMs)

        if (!allowed) {
            return new Response(
                JSON.stringify({
                    error: "Too many requests",
                    message: "Rate limit exceeded. Please try again later.",
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": new Date(resetTime).toISOString(),
                        "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
                    },
                }
            )
        }

        const response = await handler(req)

        // Add rate limit headers to successful responses
        response.headers.set("X-RateLimit-Limit", limit.toString())
        response.headers.set("X-RateLimit-Remaining", remaining.toString())
        response.headers.set("X-RateLimit-Reset", new Date(resetTime).toISOString())

        return response
    }
}
