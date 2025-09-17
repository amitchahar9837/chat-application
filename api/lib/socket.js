import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";
import cors from "cors";
import User from "../models/user.model.js";
//used to store online users;
export const userSocketMap = {};

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("user_connected", async ({ userId }) => {
    userSocketMap[userId] = socket.id;

    // Step 1: Find all "sent" messages for this user
    const undeliveredMessages = await Message.find({
      receiverId: userId,
      status: "sent",
    });

    // Step 2: Mark them as delivered
    for (const msg of undeliveredMessages) {
      msg.status = "delivered";
      await msg.save();

      const sender = await User.findById(msg.senderId).select(
        "fullName profilePic"
      );
      const receiver = await User.findById(msg.receiverId).select(
        "fullName profilePic"
      );

      // Step 3: Notify the sender that their message is now delivered
      io.to(userSocketMap[msg.senderId])?.emit("message_status_update", {
        message: msg,
        sender,
        receiver,
      });
    }
  });

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
    const sender = await User.findById(updated.senderId).select(
      "fullName profilePic"
    );
    const receiver = await User.findById(updated.receiverId).select(
      "fullName profilePic"
    );

    if (updated) {
      io.to(userSocketMap[updated.senderId._id]).emit("message_status_update", {
        message: updated,
        sender,
        receiver,
      });
    }
  });

  // socket.on("mark_as_seen", async ({ senderId, receiverId }) => {
  //   await Message.updateMany(
  //     { senderId, receiverId, status: { $ne: "seen" } },
  //     { $set: { status: "seen" } }
  //   );
  //   const updatedMessages = await Message.find({
  //     senderId,
  //     receiverId,
  //     status: "seen",
  //   }).select("_id");

  //   io.to(userSocketMap[senderId]).emit("message_seen", {
  //     from: receiverId,
  //     messageIds: updatedMessages.map((msg) => msg._id),
  //   });
  // });

  socket.on("mark_as_seen", async ({ senderId, receiverId }) => {
    try {
      // Update all unseen messages to seen
      const updatedMessages = await Message.updateMany(
        { senderId, receiverId, status: { $ne: "seen" } },
        { $set: { status: "seen" } }
      );

      // ✅ Find the latest message between these two users
      const lastMessage = await Message.findOne({
        senderId,
        receiverId,
      })
        .sort({ createdAt: -1 })
        .populate("senderId", "fullName profilePic")
        .populate("receiverId", "fullName profilePic")
        .lean();

      if (lastMessage) {
        io.to(userSocketMap[senderId]).emit("message_seen", {
          message: lastMessage,
          sender: lastMessage.senderId,
          receiver: lastMessage.receiverId,
        });
      }
    } catch (err) {
      console.error("mark_as_seen error:", err);
    }
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
