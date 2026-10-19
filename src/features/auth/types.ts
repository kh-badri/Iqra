export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  picture?: string;
  isGuest: boolean;
  provider: 'guest' | 'google';
  connectedAt?: string;
}

export const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Tamu',
  isGuest: true,
  provider: 'guest',
};
