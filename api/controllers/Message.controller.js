import Message from "../models/message.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

//HANDLER TO GET USERS FOR SIDEBAR
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic");

    const chatMap = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.senderId._id.equals(loggedInUserId)
        ? msg.receiverId
        : msg.senderId;
      if (!chatMap.has(otherUser._id.toString())) {
        chatMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg.text || "📷 Image",
          updatedAt: msg.updatedAt,
        });
      }
    });
    const chatList = Array.from(chatMap.values()).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    res.status(200).json(chatList);
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};

//HANDLER TO GET MESSAGES BETWEEN TWO USERS
export const getMessages = async (req, res) => {
  try {
    const { id: userIdToChat } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userIdToChat },
        { senderId: userIdToChat, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};

//HANDLER TO SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    newMessage.save().then((savedMessage) => {
      const receiverSocketId = getReceiverSocketId(receiverId);
      console.log("🧠 Receiver Socket ID:", receiverSocketId);
      console.log("📤 Emitting message:", savedMessage);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", savedMessage); // ✅ Emit to receiver
      }
      res.status(201).json(savedMessage);
    });
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};
