import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Thay đổi thành URL của server

export const useSocket = (userId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'], // Sử dụng WebSocket thay vì polling
    });

    setSocket(newSocket);

    // Đăng ký userId khi có
    if (userId) {
      newSocket.emit('register', userId);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // Hàm gửi sự kiện đến server
  const sendEvent = useCallback(
    (eventName: string, data?: any) => {
      if (socket) {
        socket.emit(eventName, data);
      }
    },
    [socket],
  );

  return { socket, sendEvent };
};
