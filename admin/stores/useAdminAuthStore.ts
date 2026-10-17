import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AdminUser } from '@/types/adminTypes';

interface AdminAuthState {
  admin: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  preAuthToken: string | null;
  setAdminAuth: (admin: AdminUser, accessToken?: string) => void;
  setAccessToken: (token: string | null) => void;
  setPreAuthToken: (token: string | null) => void;
  updateAdmin: (partial: Partial<AdminUser>) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,
      isAuthenticated: false,
      preAuthToken: null,

      setAdminAuth: (admin, accessToken) =>
        set({
          admin,
          accessToken: accessToken || null,
          isAuthenticated: true,
          preAuthToken: null,
        }),

      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),

      setPreAuthToken: (preAuthToken) =>
        set({
          preAuthToken,
        }),

      updateAdmin: (partial) =>
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...partial } : null,
        })),

      logout: () =>
        set({
          admin: null,
          accessToken: null,
          isAuthenticated: false,
          preAuthToken: null,
        }),
    }),
    {
      name: 'marketplace-admin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        admin: state.admin,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
