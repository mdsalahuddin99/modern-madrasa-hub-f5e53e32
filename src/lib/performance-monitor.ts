import { Analytics } from '@vercel/analytics/react';

interface PerformanceMetrics {
  pageLoadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
}

interface UserInteraction {
  type: 'click' | 'scroll' | 'input' | 'navigation';
  element?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: number;
  context?: string;
  userAgent?: string;
  url?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private interactions: UserInteraction[] = [];
  private errors: ErrorLog[] = [];
  private startTime: number;
  private sessionId: string;

  constructor() {
    this.startTime = Date.now();
    this.sessionId = this.generateSessionId();
    this.initializePerformanceObserver();
    this.initializeErrorTracking();
    this.initializeUserInteractionTracking();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.name) {
            case 'first-contentful-paint':
              this.metrics.firstContentfulPaint = entry.startTime;
              break;
            case 'largest-contentful-paint':
              this.metrics.largestContentfulPaint = entry.startTime;
              break;
            case 'first-input-delay':
              // Store FID if needed
              break;
          }
        }
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });

      // Navigation timing
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          this.metrics.timeToInteractive = navigation.domInteractive - navigation.fetchStart;
        }
      });

      // Layout Shift
      let clsValue = 0;
      let clsEntries: PerformanceEntry[] = [];

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsEntries.push(entry);
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Total Blocking Time
      let tbtValue = 0;
      const tbtObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.startTime < 10000) { // Only consider first 10 seconds
            tbtValue += (entry.duration - 50); // Tasks over 50ms are blocking
          }
        }
        this.metrics.totalBlockingTime = tbtValue;
      });

      tbtObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  private initializeErrorTracking() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logError({
          message: event.message,
          stack: event.error?.stack,
          timestamp: Date.now(),
          context: 'window.error',
          userAgent: navigator.userAgent,
          url: window.location.href
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.logError({
          message: event.reason?.message || 'Unhandled Promise Rejection',
          stack: event.reason?.stack,
          timestamp: Date.now(),
          context: 'unhandledrejection',
          userAgent: navigator.userAgent,
          url: window.location.href
        });
      });
    }
  }

  private initializeUserInteractionTracking() {
    if (typeof window !== 'undefined') {
      // Click tracking
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        this.logInteraction({
          type: 'click',
          element: target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ')[0]}` : ''),
          timestamp: Date.now(),
          metadata: {
            text: target.textContent?.slice(0, 50),
            href: target.closest('a')?.href
          }
        });
      });

      // Scroll tracking (throttled)
      let scrollTimeout: NodeJS.Timeout;
      document.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.logInteraction({
            type: 'scroll',
            timestamp: Date.now(),
            metadata: {
              scrollY: window.scrollY,
              scrollPercentage: (window.scrollY / document.documentElement.scrollHeight) * 100
            }
          });
        }, 1000);
      });

      // Navigation tracking
      const originalPushState = history.pushState;
      history.pushState = (...args: any[]) => {
        originalPushState.apply(history, args as any);
        this.logInteraction({
          type: 'navigation',
          timestamp: Date.now(),
          metadata: {
            url: window.location.href,
            previousUrl: document.referrer
          }
        });
      };
    }
  }

  logInteraction(interaction: UserInteraction) {
    this.interactions.push(interaction);
    
    // Keep only last 100 interactions to prevent memory issues
    if (this.interactions.length > 100) {
      this.interactions = this.interactions.slice(-100);
    }

    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', interaction.type, {
        event_category: 'User Interaction',
        event_label: interaction.element,
        custom_map: interaction.metadata
      });
    }
  }

  logError(error: ErrorLog) {
    this.errors.push(error);
    
    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }

    // Console error for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Performance Monitor Error:', error);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getInteractions(): UserInteraction[] {
    return [...this.interactions];
  }

  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  getSessionReport() {
    const sessionDuration = Date.now() - this.startTime;
    return {
      sessionId: this.sessionId,
      sessionDuration,
      metrics: this.getMetrics(),
      interactionCount: this.interactions.length,
      errorCount: this.errors.length,
      timestamp: Date.now()
    };
  }

  // Send performance report to API
  async sendReport() {
    try {
      const report = this.getSessionReport();
      
      // In a real app, you'd send this to your analytics endpoint
      if (typeof window !== 'undefined') {
        // Example: Send to your analytics API
        await fetch('/api/analytics/performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
        });
      }
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export for use in components
export { performanceMonitor };

// Export Vercel Analytics component
export { Analytics };

// Hook for React components
export function usePerformanceMonitor() {
  return performanceMonitor;
}

// Utility functions
export const logCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
  
  // Also log to performance monitor
  performanceMonitor.logInteraction({
    type: 'navigation',
    timestamp: Date.now(),
    metadata: { eventName, ...parameters }
  });
};

export const logErrorEvent = (error: Error, context?: string) => {
  performanceMonitor.logError({
    message: error.message,
    stack: error.stack,
    timestamp: Date.now(),
    context,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined
  });
};

// Send report on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.sendReport();
  });
  
  // Send report periodically (every 30 seconds)
  setInterval(() => {
    performanceMonitor.sendReport();
  }, 30000);
}