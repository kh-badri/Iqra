import * as React from 'react';

let globalWakeLockSentinel: any = null;

export function isWakeLockSupported(): boolean {
  return typeof window !== 'undefined' && 'wakeLock' in navigator;
}

export async function requestScreenWakeLock(): Promise<boolean> {
  if (!isWakeLockSupported()) return false;
  try {
    if (!globalWakeLockSentinel) {
      globalWakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      globalWakeLockSentinel.addEventListener('release', () => {
        globalWakeLockSentinel = null;
      });
    }
    return true;
  } catch (err) {
    // Silently fallback if rejected (e.g. low battery mode or background tab)
    return false;
  }
}

export async function releaseScreenWakeLock(): Promise<void> {
  if (globalWakeLockSentinel) {
    try {
      await globalWakeLockSentinel.release();
    } catch {
      // Ignored
    }
    globalWakeLockSentinel = null;
  }
}

export function useWakeLock(isActive: boolean) {
  React.useEffect(() => {
    if (!isActive || !isWakeLockSupported()) return;

    requestScreenWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        requestScreenWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseScreenWakeLock();
    };
  }, [isActive]);
}
