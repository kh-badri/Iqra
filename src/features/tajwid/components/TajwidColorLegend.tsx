import React from 'react';
import { Card } from '@/components/ui/Card';

export interface TajwidColorItem {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  chipClass: string;
}

export const TAJWID_COLOR_RULES: TajwidColorItem[] = [
  {
    id: 'izhar',
    name: 'Izhar (Jelas)',
    arabicName: 'إظهار',
    description: 'Dibaca terang dan tegas tanpa dengung',
    chipClass: 'bg-success/15 text-success border-success/40',
  },
  {
    id: 'idgham',
    name: 'Idgham (Melebur)',
    arabicName: 'إدغام',
    description: 'Dileburkan dengan atau tanpa dengung',
    chipClass: 'bg-warning/15 text-warning border-warning/40',
  },
  {
    id: 'iqlab',
    name: 'Iqlab (Menukar Mim)',
    arabicName: 'إقلاب',
    description: 'Ditukar menjadi bunyi mim dengan dengung',
    chipClass: 'bg-accent/15 text-accent border-accent/40',
  },
  {
    id: 'ikhfa',
    name: 'Ikhfa (Samar)',
    arabicName: 'إخفاء',
    description: 'Disamarkan antara jelas dan lebur berdengung',
    chipClass: 'bg-primary-soft text-primary border-primary/30',
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah (Memantul)',
    arabicName: 'قلقلة',
    description: 'Suara memantul saat sukun / waqaf',
    chipClass: 'bg-danger/15 text-danger border-danger/40',
  },
  {
    id: 'mad',
    name: 'Mad (Panjang)',
    arabicName: 'مد',
    description: 'Dipanjangkan 2 hingga 6 harakat',
    chipClass: 'bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#A78BFA] border-[#8B5CF6]/40',
  },
  {
    id: 'ghunnah',
    name: 'Ghunnah (Dengung)',
    arabicName: 'غنة',
    description: 'Dengung sempurna pada nun dan mim bertasydid',
    chipClass: 'bg-primary/15 text-primary border-primary/30',
  },
];

export const TajwidColorLegend: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <Card className={`border border-border bg-surface ${compact ? 'p-3.5' : 'p-5'}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs sm:text-sm font-bold text-text-primary">
          Panduan Warna Hukum Tajwid
        </h4>
        <span className="text-[11px] text-text-secondary">Terbaca Light &amp; Dark</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {TAJWID_COLOR_RULES.map((rule) => (
          <div
            key={rule.id}
            className={`px-2.5 py-1.5 rounded-card border flex items-center justify-between text-xs font-medium ${rule.chipClass}`}
          >
            <div className="truncate">
              <span className="block truncate font-bold text-[11px]">{rule.name}</span>
              {!compact && (
                <span className="text-[10px] opacity-80 block truncate">
                  {rule.description}
                </span>
              )}
            </div>
            <span className="font-arabic text-xs ml-1 shrink-0 font-normal">
              {rule.arabicName}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
