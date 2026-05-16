// ===================================================
// Rate Limiter — Redis + In-Memory Fallback
// ===================================================
// Production-এ Redis ব্যবহার করে multi-instance support
// In-memory fallback development-এর জন্য
// ===================================================

import { redisCache } from './redis';

interface RateLimitEntry {
  attempts: number;
  resetAt: number; // timestamp
  blockedUntil: number; // timestamp — 0 means not blocked
}

// In-memory fallback store
const memoryStore = new Map<string, RateLimitEntry>();

// পুরানো entry পরিষ্কার (memory leak ঠেকাতে)
let lastCleanup = Date.now();
function cleanupMemoryStore() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return; // প্রতি ১ মিনিটে
  lastCleanup = now;
  for (const [key, entry] of memoryStore) {
    if (now > entry.resetAt && now > entry.blockedUntil) {
      memoryStore.delete(key);
    }
  }
}

interface RateLimitConfig {
  /** সর্বোচ্চ কতটি attempt — এর বেশি হলে ব্লক */
  maxAttempts: number;
  /** Window সময়কাল (ms) — এই সময়ে maxAttempts গণনা */
  windowMs: number;
  /** ব্লক হলে কত সময় (ms) অপেক্ষা করতে হবে */
  blockDurationMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** কত সেকেন্ড পর আবার চেষ্টা করতে পারবে */
  retryAfterSeconds: number;
  /** বাকি কতটি attempt আছে */
  remaining: number;
}

/**
 * Redis ব্যবহার করে rate limit চেক করুন
 */
async function checkRateLimitRedis(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const redisKey = `ratelimit:${key}`;

  try {
    let entry = await redisCache.get<RateLimitEntry>(redisKey);

    // ব্লক চেক
    if (entry && entry.blockedUntil > now) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000),
        remaining: 0,
      };
    }

    // Window expired → রিসেট
    if (!entry || now > entry.resetAt) {
      entry = {
        attempts: 0,
        resetAt: now + config.windowMs,
        blockedUntil: 0,
      };
    }

    entry.attempts++;

    // লিমিট অতিক্রম → ব্লক
    if (entry.attempts > config.maxAttempts) {
      entry.blockedUntil = now + config.blockDurationMs;
    }

    // Redis-এ সেভ করুন (TTL = সর্বোচ্চ সময়কাল)
    const maxTtl = Math.max(config.windowMs, config.blockDurationMs) / 1000;
    await redisCache.set(redisKey, entry, { ttl: maxTtl });

    return {
      allowed: entry.blockedUntil === 0 || entry.blockedUntil <= now,
      retryAfterSeconds: entry.blockedUntil > now ? Math.ceil((entry.blockedUntil - now) / 1000) : 0,
      remaining: Math.max(0, config.maxAttempts - entry.attempts),
    };
  } catch (error) {
    console.error('❌ Redis rate limit error, falling back to memory:', error);
    return checkRateLimitMemory(key, config);
  }
}

/**
 * In-memory fallback rate limit check
 */
function checkRateLimitMemory(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupMemoryStore();

  const now = Date.now();
  let entry = memoryStore.get(key);

  // ব্লক চেক
  if (entry && entry.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000),
      remaining: 0,
    };
  }

  // Window expired → রিসেট
  if (!entry || now > entry.resetAt) {
    entry = {
      attempts: 0,
      resetAt: now + config.windowMs,
      blockedUntil: 0,
    };
    memoryStore.set(key, entry);
  }

  entry.attempts++;

  // লিমিট অতিক্রম → ব্লক
  if (entry.attempts > config.maxAttempts) {
    entry.blockedUntil = now + config.blockDurationMs;
    memoryStore.set(key, entry);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(config.blockDurationMs / 1000),
      remaining: 0,
    };
  }

  memoryStore.set(key, entry);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: config.maxAttempts - entry.attempts,
  };
}

/**
 * Rate limiter চেক করুন (Redis + Memory fallback)।
 * @param key — ইউনিক identifier (IP, email, IP+email combo)
 * @param config — rate limit settings
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // যদি Redis উপলব্ধ থাকে, তাহলে Redis ব্যবহার করুন
  if (process.env.UPSTASH_REDIS_REST_URL) {
    return await checkRateLimitRedis(key, config);
  }
  // নাহলে in-memory fallback
  return checkRateLimitMemory(key, config);
}

/**
 * সফল login-এর পর attempt কাউন্ট রিসেট
 */
export async function resetRateLimit(key: string) {
  const redisKey = `ratelimit:${key}`;
  try {
    if (process.env.UPSTASH_REDIS_REST_URL) {
      await redisCache.invalidate(redisKey);
    }
  } catch (error) {
    console.error('❌ Redis reset error:', error);
  }
  memoryStore.delete(key);
}

// ─── Preset Configs ───────────────────────────────

/** Login: ৫ মিনিটে ৫ বার → ১৫ মিনিট ব্লক */
export const LOGIN_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 5 * 60 * 1000,
  blockDurationMs: 15 * 60 * 1000,
};

/** Forgot Password: ১৫ মিনিটে ৩ বার → ৩০ মিনিট ব্লক */
export const FORGOT_PASSWORD_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 3,
  windowMs: 15 * 60 * 1000,
  blockDurationMs: 30 * 60 * 1000,
};

/** Signup: ১ ঘণ্টায় ৫ বার → ১ ঘণ্টা ব্লক */
export const SIGNUP_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 60 * 60 * 1000,
  blockDurationMs: 60 * 60 * 1000,
};

/** General API: ১ মিনিটে ৬০ বার → ১ মিনিট ব্লক */
export const API_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 60,
  windowMs: 60 * 1000,
  blockDurationMs: 60 * 1000,
};
