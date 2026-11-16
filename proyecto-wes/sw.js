// Service Worker Oficial de Warn Electrical Services (WES) PWA
const CACHE_NAME = 'wes-pwa-v20261104_1245';
const CORE_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'assets/logo-buho.jpg',
  'assets/logo-wes.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'js/app.js',
  'js/chat_cliente.js',
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
// Escuchar mensajes del cliente para forzar actualización inmediata
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});


// ============================================================================
// RECEPCIÓN Y GESTIÓN DE NOTIFICACIONES WEB PUSH WES
// ============================================================================

self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data = { title: 'WES · Notificación', body: event.data.text() };
    }
  }

  // Aviso por defecto discreto: No expone información privada en la pantalla bloqueada
  const title = data.title || 'WES: tiene un nuevo mensaje';
  const options = {
    body: data.body || 'Tiene una nueva notificación en su cuenta de Warn Electrical Services.',
    icon: 'assets/icon-192.png',
    badge: 'assets/icon-192.png',
    tag: data.tag || ('wes-msg-' + Date.now()),
    data: {
      url: data.url || 'index.html?openMessages=true',
      messageId: data.messageId || null,
      timestamp: Date.now()
    },
    vibrate: [100, 50, 100],
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : 'index.html?openMessages=true';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si la ventana ya está abierta, enfocarla y navegar
      for (let client of windowClients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            client.navigate(targetUrl);
          } else {
            client.postMessage({ action: 'open_user_messages', messageId: event.notification.data?.messageId });
          }
          return;
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
