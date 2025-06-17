import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:3001", {
      withCredentials: true,
      query: {
        userId,
      },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
};

export const getSocket = () => socket;
