import { Redis } from '@upstash/redis'

// Upstash Redis configuration for serverless caching
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Local Redis fallback for development
import RedisClient from 'ioredis'
let localRedis: RedisClient | null = null

if (process.env.NODE_ENV === 'development' && process.env.REDIS_HOST) {
  try {
    localRedis = new RedisClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 50, 2000)),
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    })
    localRedis.on('error', () => {
      // Suppress spam when Redis is not running locally
    })
  } catch {
    localRedis = null
  }
}

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
  prefix?: string // Key prefix
}

export class RedisCache {
  private static instance: RedisCache
  private memoryCache = new Map<string, { value: any; expires: number }>()

  static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache()
    }
    return RedisCache.instance
  }

  private generateKey(key: string, prefix = 'madrasa:'): string {
    return `${prefix}${key}`
  }

  private isExpired(item: { expires: number }): boolean {
    return Date.now() > item.expires
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      // Try Upstash Redis first
      if (process.env.UPSTASH_REDIS_REST_URL) {
        const result = await redis.get(this.generateKey(key))
        if (result) return result as T
      }

      // Try local Redis
      if (localRedis) {
        const result = await localRedis.get(this.generateKey(key))
        if (result) return JSON.parse(result)
      }

      // Fallback to memory cache
      const memoryItem = this.memoryCache.get(this.generateKey(key))
      if (memoryItem && !this.isExpired(memoryItem)) {
        return memoryItem.value
      }

      // Clean up expired memory cache
      if (memoryItem && this.isExpired(memoryItem)) {
        this.memoryCache.delete(this.generateKey(key))
      }

      return null
    } catch (error) {
      console.error('❌ Redis get error:', error)
      return null
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const { ttl = 3600, tags = [] } = options // Default 1 hour TTL
    const cacheKey = this.generateKey(key)

    try {
      // Store in Upstash Redis
      if (process.env.UPSTASH_REDIS_REST_URL) {
        await redis.set(cacheKey, value, { ex: ttl })
      }

      // Store in local Redis
      if (localRedis) {
        await localRedis.setex(cacheKey, ttl, JSON.stringify(value))
      }

      // Always store in memory cache as fallback
      this.memoryCache.set(cacheKey, {
        value,
        expires: Date.now() + ttl * 1000,
      })

      // Store tags for invalidation
      if (tags.length > 0) {
        const tagKey = `tags:${key}`
        this.memoryCache.set(this.generateKey(tagKey), {
          value: tags,
          expires: Date.now() + ttl * 1000,
        })
      }
    } catch (error) {
      console.error('❌ Redis set error:', error)
      // Fallback to memory cache only
      this.memoryCache.set(cacheKey, {
        value,
        expires: Date.now() + ttl * 1000,
      })
    }
  }

  async invalidate(key: string): Promise<void> {
    const cacheKey = this.generateKey(key)
    
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        await redis.del(cacheKey)
      }
      
      if (localRedis) {
        await localRedis.del(cacheKey)
      }
      
      this.memoryCache.delete(cacheKey)
    } catch (error) {
      console.error('❌ Redis invalidate error:', error)
      this.memoryCache.delete(cacheKey)
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    try {
      // This is a simplified implementation
      // In production, you'd want to maintain a tag-to-keys mapping
      const keysToInvalidate: string[] = []
      
      for (const [key, item] of this.memoryCache.entries()) {
        if (key.startsWith('madrasa:tags:')) {
          const tags = item.value as string[]
          if (tags.includes(tag)) {
            const originalKey = key.replace('madrasa:tags:', '')
            keysToInvalidate.push(originalKey)
          }
        }
      }

      await Promise.all(keysToInvalidate.map(key => this.invalidate(key)))
    } catch (error) {
      console.error('❌ Redis invalidateByTag error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        await redis.flushdb()
      }
      
      if (localRedis) {
        await localRedis.flushdb()
      }
      
      this.memoryCache.clear()
    } catch (error) {
      console.error('❌ Redis clear error:', error)
      this.memoryCache.clear()
    }
  }

  // Health check
  async health(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        await redis.ping()
        return { status: 'healthy', message: 'Upstash Redis connected' }
      }
      
      if (localRedis) {
        await localRedis.ping()
        return { status: 'healthy', message: 'Local Redis connected' }
      }
      
      return { status: 'healthy', message: 'Memory cache active' }
    } catch (error) {
      return { status: 'unhealthy', message: `Redis error: ${error}` }
    }
  }
}

// Export singleton instance
export const redisCache = RedisCache.getInstance()

// Helper functions for common caching patterns
export const cacheMadrasaData = async (key: string, data: any, ttl = 1800) => {
  await redisCache.set(`madrasa:${key}`, data, { 
    ttl,
    tags: ['madrasas', 'data'],
    prefix: '' 
  })
}

export const getCachedMadrasaData = async (key: string) => {
  return await redisCache.get(`madrasa:${key}`)
}

export const invalidateMadrasaCache = async () => {
  await redisCache.invalidateByTag('madrasas')
}