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
export const getUsers = createAsyncThunk("chat/getUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/message/users");
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return rejectWithValue(error.response.data.message);
  }
});

export const getMessages = createAsyncThunk("chat/getMessages", async (userId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/messages/${userId}`);
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return rejectWithValue(error.response.data.message);
  }
});

export const sendMessage = createAsyncThunk("chat/sendMessage", async (messageData, { getState, rejectWithValue }) => {
  try {
    const selectedUser = getState().chat.selectedUser;
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return rejectWithValue(error.response.data.message);
  }
});

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
      const isFromSelectedUser = newMessage.senderId === state.selectedUser?._id;
      if (isFromSelectedUser) {
        state.messages.push(newMessage);
      }
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
        state.messages.push(action.payload);
      });
  },
});

export const { setSelectedUser, addIncomingMessage, resetChatState } = chatSlice.actions;
export default chatSlice.reducer;
