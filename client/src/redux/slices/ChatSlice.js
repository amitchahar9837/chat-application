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
  async (messageData, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const selectedUser = state.chat.selectedUser;
      const authUser = state.auth.authUser;

      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );

      dispatch(
        updateLastMessageInSidebar({
          ...res.data,
          loggedInUserId: authUser._id,
        })
      );

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message);
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
      const { message, sender, receiver, loggedInUserId } = action.payload;

      const senderId =
        typeof message.senderId === "object"
          ? message.senderId._id
          : message.senderId;
      const receiverId =
        typeof message.receiverId === "object"
          ? message.receiverId._id
          : message.receiverId;
      const fullLastMessage = {
        _id: message._id,
        senderId: {
          _id: sender._id,
          fullName: sender.fullName,
          profilePic: sender.profilePic,
        },
        receiverId: {
          _id: receiver ? receiver._id : receiverId,
          fullName: receiver ? receiver.fullName : "",
          profilePic: receiver ? receiver.profilePic : "",
        },
        text: message.text,
        status: message.status,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };

      const conversationUserId =
        senderId === loggedInUserId ? receiverId : senderId;

      const userIndex = state.users.findIndex(
        (u) => u.user._id === conversationUserId
      );

      if (userIndex !== -1) {
        state.users[userIndex].lastMessage = fullLastMessage;
        const updatedUser = state.users.splice(userIndex, 1)[0];
        state.users.unshift(updatedUser);
      } else {
        const userToAdd = senderId === loggedInUserId ? receiver : sender;

        state.users.unshift({
          user: {
            _id: userToAdd._id,
            fullName: userToAdd.fullName,
            profilePic: userToAdd.profilePic,
          },
          lastMessage: fullLastMessage,
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
        const { message } = action.payload;
        const isRelevant =
          message.senderId === state.selectedUser?._id ||
          message.receiverId === state.selectedUser?._id;

        if (isRelevant) {
          state.messages.push(message);
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
