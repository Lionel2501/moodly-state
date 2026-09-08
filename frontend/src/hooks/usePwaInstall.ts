import { useCallback, useEffect, useRef, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

function isRunningStandalone(): boolean {
  const displayModeStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone = (window.navigator as NavigatorWithStandalone).standalone === true;
  return displayModeStandalone || iosStandalone;
}

interface UsePwaInstallResult {
  /** True only when the browser has offered an install prompt we can still trigger. */
  canInstall: boolean;
  /** True when Kanjoo is already running as an installed/standalone app. */
  isInstalled: boolean;
  /** Triggers the native install prompt. No-op if there is nothing to prompt. */
  install: () => Promise<void>;
}

// beforeinstallprompt fires at most once per page load (Chromium browsers only;
// Safari/iOS never fires it). Once consumed via install(), the browser won't
// offer another prompt until the next navigation, so canInstall goes back to
// false and stays there for the rest of the session — this mirrors real
// browser behavior rather than an app-level restriction.
export function usePwaInstall(): UsePwaInstallResult {
  const deferredEventRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(isRunningStandalone);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      deferredEventRef.current = event as BeforeInstallPromptEvent;
      setCanInstall(true);
    }

    function handleAppInstalled() {
      deferredEventRef.current = null;
      setCanInstall(false);
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    const event = deferredEventRef.current;
    if (!event) return;
    // Consume the reference before awaiting so a second click during the
    // prompt (or a stale re-render) can never trigger it twice.
    deferredEventRef.current = null;
    setCanInstall(false);
    await event.prompt();
    await event.userChoice;
  }, []);

  return { canInstall: canInstall && !isInstalled, isInstalled, install };
}
