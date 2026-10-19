'use client';

import * as React from 'react';

interface PrayerCountdownProps {
  targetDate?: Date | null;
  onExpire?: () => void;
  className?: string;
}

function calculateDiff(targetDate?: Date | null): number {
  if (!targetDate) return 0;
  const diff = Math.floor((targetDate.getTime() - Date.now()) / 1000);
  return Math.max(0, diff);
}

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${String(hours).padStart(2, '0')} jam`);
  }
  parts.push(`${String(minutes).padStart(2, '0')} menit`);
  parts.push(`${String(seconds).padStart(2, '0')} dtk`);

  return parts.join(' ');
}

/**
 * Isolated countdown timer:
 * Only this tiny component re-renders every 1 second,
 * preventing expensive parent component tree (HomePrayerCard / PrayerCard) from re-rendering!
 */
export function PrayerCountdown({
  targetDate,
  onExpire,
  className = '',
}: PrayerCountdownProps) {
  const [remaining, setRemaining] = React.useState<number>(() => calculateDiff(targetDate));
  const hasExpiredRef = React.useRef(false);

  React.useEffect(() => {
    // Reset expiration flag when targetDate changes
    hasExpiredRef.current = false;
    setRemaining(calculateDiff(targetDate));

    if (!targetDate) return;

    const timer = setInterval(() => {
      const diff = calculateDiff(targetDate);
      setRemaining(diff);

      if (diff === 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {formatCountdown(remaining)}
    </span>
  );
}
