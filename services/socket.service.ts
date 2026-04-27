import { io, Socket } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(`${BACKEND_URL}/guest/orders`, {
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return socket;
};