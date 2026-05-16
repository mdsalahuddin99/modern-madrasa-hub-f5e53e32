const CACHE_NAME = 'madrasa-directory-v5'; // Bumped version to clear stale HTML/chunk cache
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/placeholder.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper to determine if a request is for an image
const isImageRequest = (request) => {
  return request.destination === 'image' || 
         request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ||
         request.url.includes('res.cloudinary.com');
};

// Fetch event with mixed strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-http/https requests (like chrome-extension://, etc.)
  if (!request.url.startsWith('http')) return;

  // In local development, never cache via SW to avoid stale chunk/runtime errors.
  const isLocalhost = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
  if (isLocalhost) {
    event.respondWith(fetch(request));
    return;
  }

  // Only handle GET requests for caching strategies. 
  // POST/PUT/DELETE should generally bypass SW caching or use background sync.
  if (request.method !== 'GET') {
    return; // Let the browser handle non-GET requests normally
  }

  const url = new URL(request.url);

  // Next.js static assets (chunks, CSS, etc.) - Cache First, then Network
  // These are hashed, so they are safe to cache indefinitely until CACHE_NAME changes.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => {
          // Return a 408 Response instead of undefined to avoid SW crash
          return new Response('Network error', { status: 408 });
        });
      })
    );
    return;
  }

  // Other Next.js internal requests (like data, etc.) - Network Only
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response('Network error', { status: 408 });
      })
    );
    return;
  }

  // 1. API Requests - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 2. Images - Cache First
  if (isImageRequest(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. Documents - Network First (prevents stale HTML referencing removed chunks)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match('/offline');
          if (offline) return offline;
          // If all else fails, let it throw so browser shows default offline page
          // instead of "Failed to convert value to Response"
        })
    );
    return;
  }

  // 4. Other static assets - Stale While Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networked = fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // If network fails, we return null so that 'cached || networked' 
          // can fall back to 'cached'. But we must handle the case where both are null.
          return null; 
        });
      
      return cached || networked || new Response('Asset not found', { status: 404 });
    }).catch(() => {
      // Final fallback to avoid "Failed to convert value to Response"
      return new Response('Network error occurred', { status: 408, headers: { 'Content-Type': 'text/plain' } });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-submissions') {
    event.waitUntil(syncSubmissions());
  }
});

async function syncSubmissions() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/')) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            // Remove from cache if successful
            await cache.delete(request);
          }
        } catch (error) {
          console.error('Failed to sync request:', request.url, error);
        }
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'নতুন নোটিফিকেশন',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'দেখুন',
        icon: '/icons/check.png'
      },
      {
        action: 'close',
        title: 'বন্ধ করুন',
        icon: '/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('মাদ্রাসা ডিরেক্টরি', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
