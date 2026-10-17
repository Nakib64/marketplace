import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AdminUser } from '@/types/adminTypes';

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  preAuthToken: string | null;
  setAdminAuth: (admin: AdminUser) => void;
  setPreAuthToken: (token: string | null) => void;
  updateAdmin: (partial: Partial<AdminUser>) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      preAuthToken: null,

      setAdminAuth: (admin) =>
        set({
          admin,
          isAuthenticated: true,
          preAuthToken: null,
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
          isAuthenticated: false,
          preAuthToken: null,
        }),
    }),
    {
      name: 'marketplace-admin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
