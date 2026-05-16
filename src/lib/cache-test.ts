// Test Redis caching functionality
import { redisCache, cacheMadrasaData, getCachedMadrasaData } from '@/lib/redis'
import { getCachedMadrasas, getCachedFeaturedMadrasas, getCachedHomeStats } from '@/lib/cache'

async function testRedisCaching() {
  console.log('🧪 Testing Redis caching implementation...')
  
  try {
    // Test Redis health
    const health = await redisCache.health()
    console.log(`Redis Health: ${health.status} - ${health.message}`)
    
    // Test basic cache operations
    const testKey = 'test:madrasa:123'
    const testData = {
      id: '123',
      name: 'Test Madrasa',
      division: 'Dhaka',
      rating: 4.5
    }
    
    // Set cache
    await cacheMadrasaData(testKey, testData, 60) // 1 minute TTL
    console.log('✅ Data cached successfully')
    
    // Get cache
    const cachedData = await getCachedMadrasaData(testKey)
    console.log('✅ Retrieved cached data:', cachedData)
    
    // Test cache functions
    console.log('\n🧪 Testing cache functions...')
    
    const startTime = Date.now()
    const madrasas = await getCachedMadrasas(10)
    const firstCallTime = Date.now() - startTime
    console.log(`First call (DB): ${madrasas.length} madrasas in ${firstCallTime}ms`)
    
    // Second call should be from cache
    const startTime2 = Date.now()
    const cachedMadrasas = await getCachedMadrasas(10)
    const secondCallTime = Date.now() - startTime2
    console.log(`Second call (Cache): ${cachedMadrasas.length} madrasas in ${secondCallTime}ms`)
    
    // Test featured madrasas
    const featuredStart = Date.now()
    const featured = await getCachedFeaturedMadrasas(6)
    const featuredTime = Date.now() - featuredStart
    console.log(`Featured madrasas: ${featured.length} in ${featuredTime}ms`)
    
    // Test home stats
    const statsStart = Date.now()
    const stats = await getCachedHomeStats()
    const statsTime = Date.now() - statsStart
    console.log(`Home stats:`, stats, `in ${statsTime}ms`)
    
    console.log('\n✅ All Redis caching tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Redis caching test failed:', error)
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testRedisCaching()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { testRedisCaching }