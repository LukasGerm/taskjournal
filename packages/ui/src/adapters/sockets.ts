import { io } from "socket.io-client";

export const channelSocket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
});
