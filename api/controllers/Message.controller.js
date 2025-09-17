import Message from "../models/message.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io, userSocketMap } from "../lib/socket.js";
import User from "../models/user.model.js";

//HANDLER TO GET USERS FOR SIDEBAR
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // Fetch messages for the sidebar
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic");

    // Identify messages which are received by logged in user and are not yet delivered
    const undeliveredMessages = messages.filter(
      (msg) =>
        msg.receiverId._id.equals(loggedInUserId) &&
        !msg.delivered
    );

    // Update the 'delivered' flag in the database for those messages
    const undeliveredIds = undeliveredMessages.map((msg) => msg._id);
    await Message.updateMany(
      { _id: { $in: undeliveredIds } },
      { $set: { delivered: true } }
    );

    // Emit socket events to the corresponding senders
    undeliveredMessages.forEach((msg) => {
      // Assuming you have a method to get sender's socket id, e.g., getSocketId()
      const senderSocketId = userSocketMap[msg.senderId._id];
      if (senderSocketId) {
        io.to(senderSocketId).emit("message_delivered", {
          messageId: msg._id,
          receiverId: loggedInUserId,
        });
      }
    });

    // Build the sidebar chat list
    const chatMap = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.senderId._id.equals(loggedInUserId)
        ? msg.receiverId
        : msg.senderId;
      if (!chatMap.has(otherUser._id.toString())) {
        chatMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg
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

    const sender =  await User.findById(senderId).select("fullName profilePic");
    const receiver =  await User.findById(receiverId).select("fullName profilePic");

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
      status: "sent", 
    });

    newMessage.save().then((savedMessage) => {
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {message:savedMessage, sender, receiver }); 
      }
      res.status(201).json({message:savedMessage, sender, receiver});
    });
  } catch (error) {
    errorHandler(res, error.statusCode, error.message);
  }
};
