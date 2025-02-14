// Cache name for static assets
const CACHE_NAME = "seregela-gebeya-cache-v2";

// Install event: Cache static assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/seregela-gebeya-v2",
                "/seregela-gebeya-v2/products",
                "/seregela-gebeya-v2/cart",
                "/seregela-gebeya-v2/products/:id",
                "/seregela-gebeya-v2/category/:id",
                "/seregela-gebeya-v2/subcategory/:id",
                "/seregela-gebeya-v2/wishlist",
                "/seregela-gebeya-v2/privacy-policy",
                "/seregela-gebeya-v2/terms-of-service",
                "/seregela-gebeya-v2/faq",
                "/seregela-gebeya-v2/return-policy",
                "/seregela-gebeya-v2/contact",
                "/seregela-gebeya-v2/login",
                "/seregela-gebeya-v2/profile",
                "/seregela-gebeya-v2/checkout/shipping",
                "/seregela-gebeya-v2/checkout/payment",
                "/seregela-gebeya-v2/checkout/payment/cbebanking",
                "/seregela-gebeya-v2/checkout/payment/apollo",
                "/seregela-gebeya-v2/test",
                "/manifest.json",
                "/apple-touch-icon.png",
                "/favicon.ico",
                "/favicon-16x16.png",
                "/pwa-192x192.png",
                "/pwa-512x512.png",
                "/pwa-maskable-192x192.png",
                "/pwa-maskable-512x512.png",
            ]);
        })
    );
});

// Fetch event: Serve cached assets or fetch from network
self.addEventListener("fetch", (event) => {
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
self.addEventListener("push", (event) => {
    const data = event.data.json();
    const title = data.title || "New Notification";
    const options = {
        body: data.body || "You have a new message!",
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event: Handle notification interactions
self.addEventListener("notificationclick", (event) => {
    event.notification.close(); // Close the notification

    // Handle the notification click
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
            if (clientList.length > 0) {
                const client = clientList[0];
                client.focus();
            } else {
                clients.openWindow("/"); // Open the app in a new window
            }
        })
    );
});

// Geolocation access: Request geolocation permission
self.addEventListener("message", (event) => {
    if (event.data.type === "REQUEST_GEOLOCATION") {
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
