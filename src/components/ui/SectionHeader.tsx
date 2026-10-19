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
  /** Accent bar or dot indicator */
  accent?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  actionHref,
  actionLabel = 'Lihat Semua',
  className,
  accent = false,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between mb-3.5 mt-6', className)}>
      <div>
        <div className="flex items-center gap-2">
          {accent && (
            <span className="w-1.5 h-4.5 rounded-full bg-primary-gradient flex-shrink-0" aria-hidden />
          )}
          <h2 className="text-base sm:text-lg font-extrabold text-text-primary tracking-tight leading-snug">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary-text hover:text-primary transition-colors duration-150 flex-shrink-0 ml-4 group"
        >
          <span>{actionLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
        </Link>
      )}
    </div>
  );
}
