'use client';

import * as React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { MobileHeader } from './MobileHeader';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { UpdateToast } from '@/components/ui/UpdateToast';
import { GlobalAudioEngine } from '@/features/audio/components/GlobalAudioEngine';
import { PersistentAudioMiniPlayer } from '@/features/audio/components/PersistentAudioMiniPlayer';
import { AudioPlayerDrawer } from '@/features/audio/components/AudioPlayerDrawer';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';
import { UserProfileModal } from '@/features/auth/components/UserProfileModal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    // Listen for custom service worker update event
    const handleUpdate = () => setUpdateAvailable(true);
    window.addEventListener('swUpdateAvailable', handleUpdate);

    // Listen for Ctrl+K / Cmd+K and custom open search event
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    const handleOpenSearch = () => setIsSearchOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openGlobalSearch', handleOpenSearch);

    return () => {
      window.removeEventListener('swUpdateAvailable', handleUpdate);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openGlobalSearch', handleOpenSearch);
    };
  }, []);

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col md:flex-row bg-background text-text-primary antialiased">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        <div className="w-full max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Persistent Audio Player System */}
      <GlobalAudioEngine />
      <PersistentAudioMiniPlayer />
      <AudioPlayerDrawer />

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global User Profile & Google Auth Modal */}
      <UserProfileModal />

      {/* Service Worker Update Toast */}
      {updateAvailable && (
        <UpdateToast
          onReload={handleReload}
          onDismiss={() => setUpdateAvailable(false)}
        />
      )}
    </div>
  );
}
