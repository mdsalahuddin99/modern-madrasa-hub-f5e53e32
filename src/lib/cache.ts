import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { Madrasa, madrasas } from "@/data/madrasas";
import { defaultSiteContent } from "@/data/siteContent";
import { redisCache, cacheMadrasaData, getCachedMadrasaData, invalidateMadrasaCache } from "./redis";

// Cache configuration
const CACHE_TAGS = {
  MADRASAS: 'madrasas',
  STATS: 'stats',
  FEATURED: 'featured',
  HOME_PAGE: 'home-page',
} as const;

// Cache durations in seconds
const CACHE_DURATIONS = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 900,   // 15 minutes  
  LONG: 3600,    // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Fallback stats from default site content
const fallbackStats = {
  totalMadrasas: defaultSiteContent.stats[0].value,
  totalDivisions: 8,
  totalDistricts: 64,
  totalStudents: defaultSiteContent.stats[1].value,
};

// Fallback featured madrasas from data/madrasas.ts
const fallbackFeaturedMadrasas = madrasas.filter(m => m.featured);

/**
 * Get cached madrasa list with Redis integration and fallback
 */
export const getCachedMadrasas = unstable_cache(
  async (limit = 100): Promise<Madrasa[]> => {
    console.log("🔄 Fetching madrasas from database...");
    
    // Try Redis first
    const cacheKey = `madrasas:list:${limit}`
    const cached = await getCachedMadrasaData(cacheKey)
    if (cached) {
      console.log("✅ Returning cached madrasas from Redis")
      return cached as Madrasa[]
    }
    
    try {
      const dbMadrasas = await prisma.madrasa.findMany({
        select: {
          id: true,
          name: true,
          division: true,
          district: true,
          thana: true,
          category: true,
          board: true,
          established: true,
          students: true,
          image: true,
          description: true,
          rating: true,
          featured: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      if (dbMadrasas.length > 0) {
        const result = dbMadrasas.map(m => ({
          ...m,
          image: m.image || "/placeholder.svg",
        }))

        // Cache in Redis
        await cacheMadrasaData(cacheKey, result, 1800) // 30 minutes
        return result as any
      }
      
      // Fallback to static data
      console.log("ℹ️ No madrasas in DB, using fallback data")
      return madrasas.slice(0, limit)
    } catch (error) {
      console.error("❌ Error fetching madrasas, using fallback:", error)
      return madrasas.slice(0, limit)
    }
  },
  ['madrasa-list'],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [CACHE_TAGS.MADRASAS],
  }
);

/**
 * Get cached featured madrasas with Redis integration and fallback
 */
export const getCachedFeaturedMadrasas = unstable_cache(
  async (limit = 6): Promise<Madrasa[]> => {
    console.log("🔄 Fetching featured madrasas from database...");
    
    // Try Redis first
    const cacheKey = `madrasas:featured:${limit}`
    const cached = await getCachedMadrasaData(cacheKey)
    if (cached) {
      console.log("✅ Returning cached featured madrasas from Redis")
      return cached as Madrasa[]
    }
    
    try {
      const dbFeatured = await prisma.madrasa.findMany({
        where: { featured: true },
        select: {
          id: true,
          name: true,
          division: true,
          district: true,
          thana: true,
          category: true,
          board: true,
          established: true,
          students: true,
          image: true,
          description: true,
          rating: true,
          featured: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      if (dbFeatured.length > 0) {
        const result = dbFeatured.map(m => ({
          ...m,
          image: m.image || "/placeholder.svg",
        }))

        // Cache in Redis
        await cacheMadrasaData(cacheKey, result, 1800) // 30 minutes
        return result as any
      }
      
      // Fallback to static featured madrasas
      console.log("ℹ️ No featured madrasas in DB, using fallback data")
      return fallbackFeaturedMadrasas.slice(0, limit)
    } catch (error) {
      console.error("❌ Error fetching featured madrasas, using fallback:", error)
      return fallbackFeaturedMadrasas.slice(0, limit)
    }
  },
  ['featured-madrasas'],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [CACHE_TAGS.FEATURED, CACHE_TAGS.MADRASAS],
  }
);

/**
 * Get cached home page statistics with Redis integration and fallback
 */
export const getCachedHomeStats = unstable_cache(
  async () => {
    console.log("🔄 Fetching home page statistics from database...");
    
    // Try Redis first
    const cacheKey = `home:stats`
    const cached = await getCachedMadrasaData(cacheKey)
    if (cached) {
      console.log("✅ Returning cached home stats from Redis")
      return cached as {
        totalMadrasas: number;
        totalDivisions: number;
        totalDistricts: number;
        totalStudents: number;
      }
    }
    
    try {
      const totalMadrasas = await prisma.madrasa.count()
      
      const [divisionsResult, districtsResult, studentsResult] = await Promise.all([
        prisma.madrasa.groupBy({
          by: ['division'],
          _count: true
        }),
        prisma.madrasa.groupBy({
          by: ['district'],
          _count: true
        }),
        prisma.madrasa.aggregate({
          _sum: { students: true }
        })
      ])

      if (totalMadrasas > 0) {
        const result = {
          totalMadrasas,
          totalDivisions: divisionsResult.length,
          totalDistricts: districtsResult.length,
          totalStudents: studentsResult._sum.students || 0,
        }

        // Cache in Redis
        await cacheMadrasaData(cacheKey, result, 900) // 15 minutes
        return result
      }
      
      // Fallback to default stats
      console.log("ℹ️ No stats in DB, using fallback data")
      return fallbackStats
    } catch (error) {
      console.error("❌ Error fetching home stats, using fallback:", error)
      return fallbackStats
    }
  },
  ['home-stats'],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [CACHE_TAGS.STATS, CACHE_TAGS.HOME_PAGE],
  }
) as () => Promise<{
  totalMadrasas: number;
  totalDivisions: number;
  totalDistricts: number;
  totalStudents: number;
}>;

/**
 * Get cached individual madrasa with relations and Redis integration
 */
export const getCachedMadrasaById = unstable_cache(
  async (id: string) => {
    console.log(`🔄 Fetching madrasa ${id} from database...`);
    
    // Try Redis first
    const cacheKey = `madrasa:${id}`
    const cached = await getCachedMadrasaData(cacheKey)
    if (cached) {
      console.log(`✅ Returning cached madrasa ${id} from Redis`)
      return cached as any
    }
    
    try {
      const madrasa = await prisma.madrasa.findUnique({
        where: { id },
        include: {
          courses: true,
          facilities: true,
          director: { 
            select: { 
              id: true, 
              name: true, 
              email: true,
              image: true 
            } 
          },
          galleryImages: {
            orderBy: { order: 'asc' },
          },
        },
      })

      if (!madrasa) return null

      const result = {
        ...madrasa,
        image: madrasa.image || "/placeholder.svg",
        bannerImage: madrasa.bannerImage || "/placeholder-banner.svg",
        courses: (madrasa.courses || []).map((c: any) => c.name),
        facilities: (madrasa.facilities || []).map((f: any) => f.name),
        galleryImages: (madrasa.galleryImages || []).map((img: any) => ({
          ...img,
          url: img.url || "/placeholder.svg"
        })),
      }

      // Cache in Redis
      await cacheMadrasaData(cacheKey, result, 3600) // 1 hour
      return result
    } catch (error) {
      console.error(`❌ Error fetching madrasa ${id}:`, error)
      return null
    }
  },
  ['madrasa-', 'id'],
  {
    revalidate: CACHE_DURATIONS.LONG,
    tags: [CACHE_TAGS.MADRASAS],
  }
);

/**
 * Intelligent cache revalidation with Redis integration
 */
export async function revalidateMadrasaCache(madrasaId?: string) {
  console.log("🔄 Revalidating madrasa cache...");
  
  try {
    // Revalidate specific madrasa if ID provided
    if (madrasaId) {
      console.log(`Revalidating cache for madrasa: ${madrasaId}`);
      await redisCache.invalidate(`madrasa:${madrasaId}`);
    }
    
    // Invalidate general caches
    await invalidateMadrasaCache();
    
    console.log("✅ Cache revalidation completed");
  } catch (error) {
    console.error("❌ Error revalidating cache:", error);
  }
}

/**
 * Enhanced cache warming with Redis integration
 */
export async function warmMadrasaCache() {
  console.log("🔥 Warming up madrasa cache...");
  
  try {
    // Check Redis health first
    const redisHealth = await redisCache.health();
    console.log(`Redis status: ${redisHealth.status} - ${redisHealth.message}`);
    
    // Warm up critical data with parallel execution
    const startTime = Date.now();
    
    await Promise.all([
      getCachedHomeStats(),
      getCachedFeaturedMadrasas(),
      getCachedMadrasas(20), // Warm up first 20 madrasas
      getCachedMadrasas(50), // Additional batch for better coverage
    ]);
    
    const endTime = Date.now();
    console.log(`✅ Cache warming completed in ${endTime - startTime}ms`);
    
    // Log cache statistics
    console.log("📊 Cache warming statistics:");
    console.log("- Home stats warmed up");
    console.log("- Featured madrasas warmed up");
    console.log("- First 20 madrasas warmed up");
    console.log("- Additional 50 madrasas warmed up");
    
  } catch (error) {
    console.error("❌ Error warming cache:", error);
  }
}