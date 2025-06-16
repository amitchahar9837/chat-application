import {Types} from "mongoose";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const searchEverything = async (req, res) => {
  const userId = req.user._id;
  const query = req.query.q?.trim();

  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const allMessages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    const chatUserIds = [
  ...new Set(
    allMessages.map(msg =>
      msg.senderId.toString() === userId.toString()
        ? msg.receiverId.toString()
        : msg.senderId.toString()
    )
  )
];

// 👇 convert all to ObjectId
const excludedUserIds = chatUserIds.map(id => new Types.ObjectId(id));
excludedUserIds.push(new Types.ObjectId(userId));

    // 1️⃣ From Chat Users where name matches
    const chatUsers = await User.find({
      _id: { $in: chatUserIds },
      fullName: { $regex: query, $options: 'i' }
    }).select('_id fullName profilePic');

    // 2️⃣ From all other users (not chatted with yet)
    const otherUsers = await User.find({
      _id: { $nin: excludedUserIds },
      fullName: { $regex: query, $options: 'i' }
    }).select('_id fullName profilePic');

    // 3️⃣ Search Messages containing the query
    const messagesWithMatch = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      text: { $regex: query, $options: 'i' }
    }).populate('senderId receiverId', 'fullName profilePic');

    const messageResults = [];
    const seenUsers = new Set();

    for (const msg of messagesWithMatch) {
      const otherUser =
        msg.senderId._id.toString() === userId.toString()
          ? msg.receiverId
          : msg.senderId;

      const otherUserId = otherUser._id.toString();

      if (!seenUsers.has(otherUserId)) {
        seenUsers.add(otherUserId);
        messageResults.push({
          user: {
            _id: otherUser._id,
            fullName: otherUser.fullName,
            profilePic: otherUser.profilePic
          },
          matchedMessage: msg.text
        });
      }
    }

    res.json({
      chatUsers: chatUsers,
      AllUsers: otherUsers,
      fromMessages: messageResults
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};