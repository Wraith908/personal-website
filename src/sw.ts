
import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches
} from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// Vite injects the revisioned build files here.
precacheAndRoute(self.__WB_MANIFEST);

// Remove caches from older precache versions.
cleanupOutdatedCaches();

// Do not automatically skip waiting.
// NPCinator decides when the update is safe.
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Control open pages after activation.
clientsClaim();
