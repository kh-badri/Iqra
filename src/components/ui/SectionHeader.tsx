import * as React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionHref,
  actionLabel = 'Lihat Semua',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between mb-3.5 mt-6', className)}>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-pressed transition-colors"
        >
          <span>{actionLabel}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
