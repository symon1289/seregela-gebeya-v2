if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,a)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(n[l])return;let r={};const o=e=>s(e,l),t={module:{uri:l},exports:r,require:o};n[l]=Promise.all(i.map((e=>t[e]||o(e)))).then((e=>(a(...e),r)))}}define(["./workbox-b20f670c"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"07a03b2681b77d40be5742167d797228"},{url:"assets/image_2024-11-08_17-21-35-D9VykgU4.png",revision:null},{url:"assets/image_2024-11-09_13-19-04-0N4l7JYn.png",revision:null},{url:"assets/image_2024-11-09_13-19-05-CIoga3A9.png",revision:null},{url:"assets/index-Cd7T0-qr.css",revision:null},{url:"assets/index-VDOe1FAb.js",revision:null},{url:"assets/left-DN41yb_3.png",revision:null},{url:"assets/logo-ByYqRo1m.png",revision:null},{url:"assets/payment-option-1-D7sqLwKo.png",revision:null},{url:"assets/payment-option-10-TI8ULizP.png",revision:null},{url:"assets/payment-option-11-ZF9hVm2Z.png",revision:null},{url:"assets/payment-option-4--YVsQekX.png",revision:null},{url:"assets/payment-option-5-D5uNahi4.png",revision:null},{url:"assets/payment-option-6-bLIMOluE.png",revision:null},{url:"assets/payment-option-7-DZqPh3La.png",revision:null},{url:"assets/payment-option-8-HER9kr5E.png",revision:null},{url:"assets/payment-option-9-Bl2r1Kpt.png",revision:null},{url:"assets/right-DkVNpYrw.png",revision:null},{url:"assets/workbox-window.prod.es5-DL_hIMXg.js",revision:null},{url:"favicon-16x16.png",revision:"be0140d17dcd043d02c3f280361c0fed"},{url:"favicon-32x32.png",revision:"d58a93df73a45034af9891ca77480e7a"},{url:"favicon.ico",revision:"fd274c102c2e264a21858a3f878d6a91"},{url:"index.html",revision:"f7435db3cb871ec35e39e3893fdd447b"},{url:"pwa-192x192.png",revision:"4e062e1626014bdfcdd3a5c52c2ac53f"},{url:"pwa-512x512.png",revision:"828c8505f2de044db03ae2277b7eee92"},{url:"pwa-maskable-192x192.png",revision:"98fb876c0ef330132a4051eb4d186c8b"},{url:"pwa-maskable-512x512.png",revision:"4bc81670aa2a5dedbeac269b6925a2c2"},{url:"pwa-192x192.png",revision:"4e062e1626014bdfcdd3a5c52c2ac53f"},{url:"pwa-512x512.png",revision:"828c8505f2de044db03ae2277b7eee92"},{url:"pwa-maskable-192x192.png",revision:"98fb876c0ef330132a4051eb4d186c8b"},{url:"pwa-maskable-512x512.png",revision:"4bc81670aa2a5dedbeac269b6925a2c2"},{url:"manifest.webmanifest",revision:"a318667e5a46e863d82761d5e1a2f57c"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({request:e})=>"document"===e.destination),new e.NetworkFirst({cacheName:"html",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute((({request:e})=>"script"===e.destination||"style"===e.destination),new e.StaleWhileRevalidate({cacheName:"static",plugins:[]}),"GET"),e.registerRoute((({request:e})=>"image"===e.destination),new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:60,maxAgeSeconds:2592e3})]}),"GET")}));
