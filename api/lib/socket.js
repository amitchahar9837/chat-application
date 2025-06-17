import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//used to store online users;
const userSocketMap = {};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("connected:", socket.id, "for user:", userId);

  if (userId) {
    // ✅ Always overwrite with latest socket ID
    userSocketMap[userId] = socket.id;

    // Optional: Log current map
    console.log("📍 userSocketMap:", userSocketMap);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ disconnected:", socket.id);

    // ✅ Clean only if it's the same socket
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
