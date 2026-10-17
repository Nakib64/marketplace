import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAdminAuthStore } from '@/stores/useAdminAuthStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const adminApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach Access Token as Bearer header for resilient cross-domain auth
adminApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAdminAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

adminApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthRoute =
      originalRequest.url?.includes('/admin/auth/login') ||
      originalRequest.url?.includes('/admin/auth/2fa/verify-login') ||
      originalRequest.url?.includes('/admin/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return adminApiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${BASE_URL}/admin/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshRes.data?.accessToken;
        if (newAccessToken) {
          useAdminAuthStore.getState().setAccessToken(newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
        }
        processQueue(null, newAccessToken);
        return adminApiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        useAdminAuthStore.getState().logout();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
