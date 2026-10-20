import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/useAuthStore';

let socket: Socket | null = null;

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000';

/**
 * Returns an existing connected socket or establishes a new connection
 */
export function getSocket(): Socket {
  const token = useAuthStore.getState().accessToken;

  if (!socket) {
    socket = io(`${WS_URL}/chat`, {
      withCredentials: true,
      auth: (cb) => {
        const currentToken = useAuthStore.getState().accessToken;
        cb({ token: currentToken ? `Bearer ${currentToken}` : '' });
      },
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  } else if (token) {
    socket.auth = { token: `Bearer ${token}` };
  }

  return socket;
}

/**
 * Connects the socket if disconnected
 */
export function connectSocket(): Socket {
  const s = getSocket();
  const token = useAuthStore.getState().accessToken;
  if (token) {
    s.auth = { token: `Bearer ${token}` };
  }
  if (!s.connected) {
    s.connect();
  }
  return s;
}

/**
 * Disconnects and resets the socket instance
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
