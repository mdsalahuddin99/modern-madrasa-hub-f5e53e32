'use client'

import React from 'react'
import { SWRConfig, SWRConfiguration, Revalidator } from 'swr'
import { toast } from 'sonner'

interface SWRProviderProps {
  children: React.ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global configuration
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 300000, // 5 minutes
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        focusThrottleInterval: 5000,
        suspense: false,
        
        // Global fetcher with enhanced error handling
        fetcher: async (url: string) => {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

          try {
            const response = await fetch(url, {
              signal: controller.signal,
              headers: {
                'Content-Type': 'application/json',
              },
            })

            clearTimeout(timeoutId)

            const json = await response.json()

            if (!response.ok) {
              const error = new Error(json.error?.message || `HTTP error! status: ${response.status}`)
              // @ts-ignore
              error.status = response.status
              // @ts-ignore
              error.code = json.error?.code
              throw error
            }

            // Return the actual data if it's our standard success format
            if (json.success && json.data !== undefined) {
              return json.data
            }

            return json
          } catch (error: unknown) {
            clearTimeout(timeoutId)
            
            if ((error as Error).name === 'AbortError') {
              const timeoutError = new Error('Request timeout - please check your connection')
              timeoutError.name = 'TimeoutError'
              throw timeoutError
            }
            
            if ((error as Error).name === 'TypeError' && (error as Error).message.includes('fetch')) {
              const networkError = new Error('Network error - please check your connection')
              networkError.name = 'NetworkError'
              throw networkError
            }
            
            throw error
          }
        },

        // Global error handler
        onError: (error: Error, key: string) => {
          console.error(`❌ SWR Error for key: ${key}`, error)
          
          // Show user-friendly error messages
          if (error.name === 'TimeoutError') {
            toast.error('⏰ Request timeout - please try again')
          } else if (error.name === 'NetworkError') {
            toast.error('🌐 Network error - please check your connection')
          } else if (error.message?.includes('404')) {
            toast.error('❌ Data not found')
          } else if (error.message?.includes('500')) {
            toast.error('🔧 Server error - please try again later')
          } else {
            toast.error('❌ Failed to load data')
          }
        },

        // Success handler
        onSuccess: (data: unknown, key: string) => {
          console.log(`✅ SWR Success for key: ${key}`, data)
        },

        // Retry handler with exponential backoff
        onErrorRetry: (error: any, key: string, config: SWRConfiguration, revalidate: Revalidator, { retryCount }: { retryCount: number }) => {
          // Never retry on 404
          if (error.status === 404) return

          // Never retry on network errors
          if (error.name === 'NetworkError' || error.name === 'TimeoutError') return

          // Exponential backoff
          const maxRetries = 3
          if (retryCount >= maxRetries) return

          const timeout = Math.min(retryCount * 1000, 5000)
          console.log(`🔄 SWR Retry ${retryCount}/${maxRetries} for key: ${key} in ${timeout}ms`)
          
          setTimeout(() => revalidate({ retryCount: retryCount + 1 }), timeout)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}