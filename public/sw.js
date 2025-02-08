// Cache name for static assets
const CACHE_NAME = 'seregela-gebeya-cache-v1';

// Install event: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/products',
                '/cart',
                '/login',
                '/wishlist',
                '/checkout/shipping',
                '/checkout/payment',
                '/manifest.json',
                '/apple-touch-icon.png',
                '/favicon.ico',
                '/favicon-16x16.png',
                '/pwa-192x192.png',
                '/pwa-512x512.png',
                '/pwa-maskable-192x192.png',
                '/pwa-maskable-512x512.png',
            ]);
        })
    );
});

// Fetch event: Serve cached assets or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if available
            if (response) {
                return response;
            }

            // Fetch from network for navigation requests
            return fetch(event.request).then((networkResponse) => {
                // Cache the fetched response for future use
                const clonedResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clonedResponse);
                });
                return networkResponse;
            });
        })
    );
});

// Push event: Handle push notifications
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.title || 'New Notification';
    const options = {
        body: data.body || 'You have a new message!',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event: Handle notification interactions
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification

    // Handle the notification click
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            if (clientList.length > 0) {
                const client = clientList[0];
                client.focus();
            } else {
                clients.openWindow('/'); // Open the app in a new window
            }
        })
    );
});

// Geolocation access: Request geolocation permission
self.addEventListener('message', (event) => {
    if (event.data.type === 'REQUEST_GEOLOCATION') {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                event.ports[0].postMessage({ success: true, position });
            },
            (error) => {
                event.ports[0].postMessage({
                    success: false,
                    error: error.message,
                });
            }
        );
    }
});
