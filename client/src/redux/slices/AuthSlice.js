import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { resetChatState } from "./ChatSlice";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3001" : "/";

let socket = null;

const initialState = {
  authUser: null,
  socket: null,
  onlineUsers: [],
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,
};

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/check");
      dispatch(connectSocket(res.data._id));
      return res.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Check auth failed");
      return rejectWithValue(
        err.response?.data?.message || "Check auth failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, {dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("Logged in successfully");
      const userId = res.data.data.user._id;
      dispatch(connectSocket(userId));
      return res.data.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully");
      dispatch(connectSocket(res.data.data.user._id));
      return res.data.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(disconnectSocket());
      dispatch(resetChatState());
      toast.success("Logged out successfully");
      return null;
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      toast.success("Profile updated successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const connectSocket = (userId) => (dispatch) => {
  if (!userId || socket) return;

  socket = io(BASE_URL, {
    query: { userId },
  });

  socket.connect();
  dispatch(setSocket(socket));

  socket.on("connect", () => {
    socket.emit("user_connected", { userId });
  });

  socket.on("getOnlineUsers", (userIds) => {
    dispatch(setOnlineUsers(userIds));
  });
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    disconnectSocket: (state) => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      state.socket = null;
      state.onlineUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isSigningUp = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })

      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isUpdatingProfile = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      });
  },
});

export const { setSocket, setOnlineUsers, disconnectSocket } =
  authSlice.actions;
export default authSlice.reducer;
