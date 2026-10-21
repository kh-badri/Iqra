'use client';

import React, { useState } from 'react';
import { Search, BookA, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { Chip } from '@/components/ui/Chip';
import type { TajwidGlossaryTerm } from '../types';

interface TajwidGlossaryProps {
  terms: TajwidGlossaryTerm[];
}

export const TajwidGlossary: React.FC<TajwidGlossaryProps> = ({ terms }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(terms.map((t) => t.category)))];

  const filtered = terms.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.term.toLowerCase().includes(q) ||
      item.arabic.includes(q) ||
      item.definition.toLowerCase().includes(q) ||
      item.example.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="w-full sm:max-w-md">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Cari istilah tajwid (misal: Ikhfa, Ghunnah, Waqaf)..."
          />
        </div>

        <span className="text-xs text-text-secondary self-end sm:self-center">
          Menampilkan {filtered.length} istilah
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
              selectedCategory === cat
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-text-secondary border-border hover:border-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <Card key={idx} className="p-5 border border-border bg-surface flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Chip variant="secondary" className="text-[10px]">
                  {item.category}
                </Chip>
                <span dir="rtl" className="font-arabic text-xl text-primary font-bold leading-relaxed">
                  {item.arabic}
                </span>
              </div>

              <h4 className="text-base font-bold text-text-primary mb-2">
                {item.term}
              </h4>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-3">
                {item.definition}
              </p>
            </div>

            <div className="pt-3 border-t border-border text-[11px] text-text-secondary">
              <strong className="text-text-primary">Contoh:</strong> {item.example}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
