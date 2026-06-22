import useSWR, { SWRConfiguration, mutate } from 'swr'
import { useState, useEffect } from 'react'
import { Madrasa } from '@/data/madrasas'

// SWR Configuration
const swrConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 300000, // 5 minutes
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  focusThrottleInterval: 5000,
  suspense: false,
}

// Fetcher function with error handling
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Enhanced fetcher with timeout and retry logic
const enhancedFetcher = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error?.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

// Custom SWR hooks for madrasa data
export function useMadrasas(page = 1, limit = 20, filters = {}) {
  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  }).toString()

  const { data, error, isLoading, mutate } = useSWR(
    `/api/madrasas?${queryString}`,
    enhancedFetcher,
    {
      ...swrConfig,
      keepPreviousData: true, // Keep previous data while loading new data
    }
  )

  return {
    madrasas: data?.madrasas || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useFeaturedMadrasas(limit = 6) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/madrasas/featured?limit=${limit}`,
    enhancedFetcher,
    swrConfig
  )

  return {
    featuredMadrasas: data?.madrasas || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useMadrasaById(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/madrasas/${id}` : null,
    enhancedFetcher,
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  )

  return {
    madrasa: data?.madrasa,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useHomeStats() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/stats/home',
    enhancedFetcher,
    swrConfig
  )

  return {
    stats: data?.stats || {
      totalMadrasas: 0,
      totalDivisions: 0,
      totalDistricts: 0,
      totalStudents: 0,
    },
    isLoading,
    isError: error,
    mutate,
  }
}

// Real-time search hook with debouncing
export function useMadrasaSearch(query: string, debounceMs = 500) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  const { data, error, isLoading } = useSWR(
    debouncedQuery ? `/api/madrasas/search?q=${encodeURIComponent(debouncedQuery)}` : null,
    enhancedFetcher,
    {
      ...swrConfig,
      keepPreviousData: true,
    }
  )

  return {
    searchResults: data?.results || [],
    isLoading,
    isError: error,
    query: debouncedQuery,
  }
}

// Optimistic updates for better UX
import { editMadrasaAction } from '@/actions/madrasa.actions'

export function useOptimisticMadrasaUpdate() {
  const updateMadrasa = async (id: string, data: Partial<Madrasa>) => {
    // Optimistically update the cache
    await mutate(
      `/api/madrasas/${id}`,
      async (currentData: any) => {
        if (!currentData?.madrasa) return currentData
        
        return {
          ...currentData,
          madrasa: {
            ...currentData.madrasa,
            ...data,
          },
        }
      },
      false // Don't revalidate immediately
    )

    // Make the actual API call (Now using Server Action)
    try {
      const result = await editMadrasaAction(id, data)

      if (!result.success) {
        throw new Error(result.error || 'Update failed')
      }

      // Revalidate to get the latest data
      await mutate(`/api/madrasas/${id}`)
      
      return { success: true }
    } catch (error) {
      // Rollback on error
      await mutate(`/api/madrasas/${id}`)
      return { success: false, error }
    }
  }

  return { updateMadrasa }
}

// Real-time subscription hook (WebSocket simulation)
export function useMadrasaSubscription(madrasaId?: string) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate WebSocket connection
    const connect = () => {
      setIsConnected(true)
      console.log('📡 Connected to madrasa updates')
    }

    const disconnect = () => {
      setIsConnected(false)
      console.log('📡 Disconnected from madrasa updates')
    }

    connect()

    // Simulate receiving updates
    const interval = setInterval(() => {
      if (isConnected && madrasaId) {
        // Revalidate specific madrasa data
        mutate(`/api/madrasas/${madrasaId}`)
      }
    }, 30000) // Check every 30 seconds

    return () => {
      clearInterval(interval)
      disconnect()
    }
  }, [madrasaId, isConnected])

  return { isConnected }
}

// Batch operations for better performance
export function useBatchMadrasaOperations() {
  const batchUpdate = async (updates: Array<{ id: string; data: Partial<Madrasa> }>) => {
    try {
      const response = await fetch('/api/madrasas/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      })

      if (!response.ok) {
        throw new Error('Batch update failed')
      }

      // Revalidate affected madrasas
      await Promise.all(
        updates.map(({ id }) => mutate(`/api/madrasas/${id}`))
      )

      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  return { batchUpdate }
}