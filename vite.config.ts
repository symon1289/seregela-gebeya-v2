import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Seregela Gebeya",
                short_name: "Seregela Gebeya",
                description: "Seregela Gebeya",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                display: "standalone",
                start_url: "/seregela-gebeya-v2/",
                orientation: "portrait",
                icons: [
                    {
                        src: "/seregela-gebeya-v2/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/seregela-gebeya-v2/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/seregela-gebeya-v2/pwa-maskable-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/seregela-gebeya-v2/pwa-maskable-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
            devOptions: {
                enabled: true,
                navigateFallback: "index.html",
                suppressWarnings: true,
                type: "module",
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) =>
                            request.destination === "document",
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "html",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 30,
                            },
                        },
                    },
                    {
                        urlPattern: ({ url }) =>
                            url.pathname.startsWith("/api"),
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "api-cache",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 24 * 60 * 60,
                            },
                        },
                    },
                    {
                        urlPattern: ({ request }) =>
                            request.destination === "script" ||
                            request.destination === "style",
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "static",
                        },
                    },
                    {
                        urlPattern: ({ request }) =>
                            request.destination === "image",
                        handler: "CacheFirst",
                        options: {
                            cacheName: "images",
                            expiration: {
                                maxEntries: 60,
                                maxAgeSeconds: 60 * 60 * 24 * 30,
                            },
                        },
                    },
                ],
                globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
            },
            srcDir: "public",
            filename: "sw.js",
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    base: "/seregela-gebeya-v2",
});
