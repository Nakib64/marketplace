import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { LoginPayload, RegisterPayload, VerifyEmailPayload } from '../types/authTypes';
import { useAuthStore } from '@/stores/useAuthStore';
import { AxiosError } from 'axios';
import { User } from '@/types/user';

export function useAuthActions() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logoutStore = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (res) => {
      setAuth(res.user as User);
      toast.success('Signed in successfully!');
      if (res.user.role === 'CLIENT') {
        router.push('/client/jobs');
      } else {
        router.push('/jobs');
      }
    },
    onError: (error: AxiosError<{ message?: string | string[] }>) => {
      const msg = error.response?.data?.message;
      const displayMsg = Array.isArray(msg) ? msg[0] : msg || 'Invalid email or password.';
      toast.error(displayMsg);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (res) => {
      toast.success(res.message || 'Account created successfully! Please sign in.');
      router.push('/login');
    },
    onError: (error: AxiosError<{ message?: string | string[] }>) => {
      const msg = error.response?.data?.message;
      const displayMsg = Array.isArray(msg) ? msg[0] : msg || 'Registration failed. Please try again.';
      toast.error(displayMsg);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (payload?: VerifyEmailPayload) => authApi.verifyEmail(payload),
    onSuccess: (res) => {
      updateUser({ isEmailVerified: true });
      toast.success(res.message || 'Email verified successfully!');
      router.push('/');
    },
    onError: (error: AxiosError<{ message?: string | string[] }>) => {
      const msg = error.response?.data?.message;
      const displayMsg = Array.isArray(msg) ? msg[0] : msg || 'Email verification failed.';
      toast.error(displayMsg);
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (payload?: VerifyEmailPayload) => authApi.resendVerification(payload),
    onSuccess: (res) => {
      toast.success(res.message || 'Verification link sent to your inbox.');
    },
    onError: (error: AxiosError<{ message?: string | string[] }>) => {
      const msg = error.response?.data?.message;
      const displayMsg = Array.isArray(msg) ? msg[0] : msg || 'Failed to resend verification.';
      toast.error(displayMsg);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logoutStore();
      toast.success('Logged out successfully.');
      router.push('/');
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifying: verifyEmailMutation.isPending,
    resendVerification: resendVerificationMutation.mutate,
    isResending: resendVerificationMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

