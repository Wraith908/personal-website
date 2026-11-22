
import { registerSW } from 'virtual:pwa-register';

type Listener = (available: boolean) => void;

let updateAvailable = false;
let updateSW:
  ((reloadPage?: boolean) => Promise<void>) | null = null;

const listeners = new Set<Listener>();

function setUpdateAvailable(available: boolean) {
  updateAvailable = available;

  listeners.forEach(listener => {
    listener(available);
  });
}

export function subscribeToUpdates(listener: Listener) {
  listeners.add(listener);
  listener(updateAvailable);

  return () => {
    listeners.delete(listener);
  };
}

export function applyAvailableUpdate() {
  if (!updateAvailable || !navigator.onLine) {
    return;
  }

  // Activate the waiting worker and reload.
  void updateSW?.(true);
}

export function initialisePWA() {
  if (
    !('serviceWorker' in navigator) ||
    import.meta.env.DEV
  ) {
    return;
  }

  updateSW = registerSW({
    immediate: true,

    onNeedRefresh() {
      // A complete new version is waiting.
      setUpdateAvailable(true);
    },

    onOfflineReady() {
      console.info('NPCinator is ready for offline use');
    },

    onRegisteredSW(_url, registration) {
      if (!registration) return;

      const checkForUpdates = () => {
        if (navigator.onLine) {
          void registration.update().catch(error => {
            console.warn('PWA update check failed:', error);
          });
        }
      };

      // Check when returning to the application.
      document.addEventListener(
        'visibilitychange',
        () => {
          if (!document.hidden) {
            checkForUpdates();
          }
        }
      );

      // Check after connectivity returns.
      window.addEventListener('online', checkForUpdates);

      // Check periodically while the app remains open.
      window.setInterval(checkForUpdates, 60 * 60 * 1000);

      checkForUpdates();
    },

    onRegisterError(error) {
      console.error('PWA registration failed:', error);
    }
  });
}
