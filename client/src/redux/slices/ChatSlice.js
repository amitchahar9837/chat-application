import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";

// Initial State
const initialState = {
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
};

// Thunks
export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/message/users");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { getState, rejectWithValue }) => {
    console.log("messageData", messageData);
    try {
      const selectedUser = getState().chat.selectedUser;
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    addIncomingMessage: (state, action) => {
      const newMessage = action.payload;
      const isRelevant =
        newMessage.senderId === state.selectedUser?._id ||
        newMessage.receiverId === state.selectedUser?._id;

      if (isRelevant) {
        state.messages.push(newMessage);
      }
    },
    updateLastMessageInSidebar: (state, action) => {
      const {
        senderId,
        receiverId,
        text,
        createdAt,
        authUserId,
        sender,
        receiver,
      } = action.payload;

      const targetId = senderId === authUserId ? receiverId : senderId;
      const targetUser = senderId === authUserId ? receiver : sender;

      const userIndex = state.users.findIndex((u) => u.user._id === targetId);
      if (userIndex !== -1) {
        state.users[userIndex].lastMessage = text;
        state.users[userIndex].updatedAt = createdAt;
      } else {
        state.users.unshift({
          user: {
            _id: targetUser._id,
            fullName: targetUser.fullName,
            profilePic: targetUser.profilePic,
          },
          lastMessage: text,
          updatedAt: createdAt,
        });
      }
    },
    markMessagesAsSeen: (state, action) => {
      const { messageIds } = action.payload;

      state.messages = state.messages.map((msg) =>
        messageIds.includes(msg._id) ? { ...msg, status: "seen" } : msg
      );
    },
    updateMessageStatus: (state, action) => {
      const updatedMsg = action.payload;

      state.messages = state.messages.map((msg) =>
        msg._id === updatedMsg._id ? { ...msg, status: updatedMsg.status } : msg
      );
    },
    resetMessages: (state) => {
      state.messages = [];
    },
    resetChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // getUsers
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isUsersLoading = false;
      })

      // getMessages
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })

      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        const newMessage = action.payload;
        const isRelevant =
          newMessage.senderId === state.selectedUser?._id ||
          newMessage.receiverId === state.selectedUser?._id;

        if (isRelevant) {
          state.messages.push(newMessage);
        }
      });
  },
});

export const {
  setSelectedUser,
  addIncomingMessage,
  resetChatState,
  updateLastMessageInSidebar,
  resetMessages,
  markMessagesAsSeen,
  updateMessageStatus,
} = chatSlice.actions;
export default chatSlice.reducer;
