// NeedFix Service Worker - High Reliability Offline Caching & PWA Engine
const CACHE_STATIC_NAME = 'needfix-static-v5';
const CACHE_DYNAMIC_NAME = 'needfix-dynamic-v5';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png',
  '/favicon-32.png',
  '/favicon-192.png',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/logo.png',
  '/needfix-logo.png',
  '/needfix-squircle.png',
];

// Offline HTML fallback template
const OFFLINE_FALLBACK_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeedFix - Offline Mode</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f8fafc;
      color: #0f172a;
      text-align: center;
    }
    .card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 32px 24px;
      max-width: 400px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .icon {
      width: 56px;
      height: 56px;
      background: #eff6ff;
      color: #2563eb;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    h1 { font-size: 20px; font-weight: 800; margin: 0 0 8px; color: #0f172a; }
    p { font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 0 20px; }
    .btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
    </div>
    <h1>You are currently offline</h1>
    <p>NeedFix local records and verified technician contacts remain accessible offline. Please check your internet connection and tap retry.</p>
    <button class="btn" onclick="window.location.reload()">Retry Connection</button>
  </div>
</body>
</html>
`;

// 1. Install Event: Cache Core Static Assets safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Static assets pre-cache note:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean ALL old caches immediately & Claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[NeedFix Service Worker] Deleting obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Safe Network-First Strategy to prevent broken builds
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Only handle http / https requests
  if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
    return;
  }

  const url = new URL(request.url);

  // A. Database queries & API calls (Supabase & backend API) -> Network-First
  if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            try {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
                cache.put(request, responseClone);
              }).catch(() => {});
            } catch {}
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(JSON.stringify({ error: 'offline', offline: true }), {
              headers: { 'Content-Type': 'application/json' },
            });
          });
        })
    );
    return;
  }

  // B. Navigation requests (HTML pages) -> Network-First with Cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            try {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
                cache.put(request, responseClone);
              }).catch(() => {});
            } catch {}
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          const indexPage = await caches.match('/index.html');
          if (indexPage) return indexPage;

          return new Response(OFFLINE_FALLBACK_HTML, {
            headers: { 'Content-Type': 'text/html' },
          });
        })
    );
    return;
  }

  // C. JavaScript scripts & CSS stylesheets -> Network-First to guarantee latest deploy is loaded
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/assets/')
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            try {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
                cache.put(request, responseClone);
              }).catch(() => {});
            } catch {}
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // D. Static Assets (Images, Icons, Fonts) -> Cache-First with Network Revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Background revalidate
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            try {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
                cache.put(request, responseClone);
              }).catch(() => {});
            } catch {}
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          try {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(request, responseClone);
            }).catch(() => {});
          } catch {}
        }
        return networkResponse;
      }).catch(async () => {
        if (request.destination === 'image') {
          const fallbackLogo = await caches.match('/logo.png');
          if (fallbackLogo) return fallbackLogo;
        }
        return new Response('', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
