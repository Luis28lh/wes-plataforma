// Service Worker Oficial de Warn Electrical Services (WES) PWA
const CACHE_NAME = 'wes-pwa-v20261010_2120';
const CORE_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'assets/logo-buho.jpg',
  'assets/logo-wes.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'js/app.js',
  'js/products.js',
  'js/feature_flags.js',
  'js/supabase_client.js',
  'js/admin_auth.js',
  'js/user_auth.js'
];

// Instalación: Precargar recursos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS).catch(err => {
        console.warn('[WES SW] Algunos recursos iniciales no pudieron cachearse:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpiar cachés antiguas y tomar control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Network-First con Fallback a Caché
self.addEventListener('fetch', event => {
  // Solo procesar peticiones GET dentro del mismo origen
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // No interceptar rutas de administración o llamadas a APIs externas/Supabase
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});