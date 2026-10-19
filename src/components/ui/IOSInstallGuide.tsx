/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Share, PlusSquare, ArrowUpRight } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

export interface IOSInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallGuide({ isOpen, onClose }: IOSInstallGuideProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Install di iPhone / iPad">
      <div className="space-y-4 py-2">
        {/* App Icon Preview */}
        <div className="flex items-center gap-3.5 p-3.5 bg-surface-alt/70 border border-border/80 rounded-2xl">
          <img
            src="/icons/icon-192.png?v=lime"
            alt="Logo Iqra"
            className="w-12 h-12 rounded-2xl shadow-elevated shrink-0 object-cover ring-1 ring-border/50"
          />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary">Iqra: Belajar Agama Islam</h4>
            <p className="text-xs text-text-secondary mt-0.5">
              Ikon elegan ini akan langsung muncul di Layar Utama HP Anda
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Ikuti langkah mudah berikut di peramban <strong>Safari</strong> untuk menginstall Iqra ke Layar Utama iPhone/iPad Anda:
        </p>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-card">
            <div className="w-8 h-8 rounded-full bg-primary-gradient text-on-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
              1
            </div>
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-text-primary">
                Ketuk tombol Bagikan (Share)
              </p>
              <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                Ikon kotak dengan panah ke atas <Share className="w-3.5 h-3.5 text-primary inline" /> di bilah bawah Safari.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-card">
            <div className="w-8 h-8 rounded-full bg-primary-gradient text-on-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
              2
            </div>
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-text-primary">
                Pilih "Tambah ke Layar Utama"
              </p>
              <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                Gulir ke bawah pada menu bagikan dan ketuk <PlusSquare className="w-3.5 h-3.5 text-primary inline" /> <em>Add to Home Screen</em>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-card">
            <div className="w-8 h-8 rounded-full bg-primary-gradient text-on-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
              3
            </div>
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-text-primary">
                Ketuk tombol "Tambah" (Add)
              </p>
              <p className="text-text-secondary text-xs mt-0.5">
                Di pojok kanan atas layar. Ikon Iqra akan langsung muncul di Layar Utama HP Anda!
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="primary" className="w-full" onClick={onClose}>
            Saya Mengerti
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
