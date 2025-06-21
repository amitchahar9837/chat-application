import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import Message from "../models/message.model.js";
dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//used to store online users;
export const userSocketMap = {};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }-
  //typing socket event ----
  socket.on("typing", ({ receiverId, senderId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId });
    }
  });

  socket.on("stop_typing", ({ receiverId, senderId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop_typing", { senderId });
    }
  });

  //message socket events ----
  socket.on("message_delivered", async ({ messageId }) => {
    const updated = await Message.findByIdAndUpdate(
      messageId,
      { status: "delivered" },
      { new: true }
    ).lean();
    if (updated) {
      io.to(userSocketMap[updated.senderId]).emit("message_status_update", updated);
    }
  });
  socket.on("mark_as_seen", async ({ senderId, receiverId }) => {
    await Message.updateMany(
      { senderId, receiverId, status: { $ne: "seen" } },
      { $set: { status: "seen" } }
    );
    const updatedMessages = await Message.find({
      senderId,
      receiverId,
      status: "seen",
    }).select("_id");

    io.to(userSocketMap[senderId]).emit("message_seen", {
      from: receiverId,
      messageIds: updatedMessages.map((msg) => msg._id),
    });
  });

  // Emit the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //disconnect event
  socket.on("disconnect", () => {
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
