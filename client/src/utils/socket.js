import { io } from "socket.io-client";
import { setOnlineUsers } from "../redux/slices/AuthSlice";

let socket = null;

// export const connectSocket = (userId, dispatch) => {
//   console.log(userId)
//   if (!socket) {
//     socket = io("http://localhost:3001", {
//       withCredentials: true,
//       query: {
//         userId,
//       },
//     });

//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket.id);
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Socket disconnected");
//     });
//     socket.on("getOnlineUsers", (userIds) => {
//       dispatch(setOnlineUsers(userIds));
//     });
//   }
// };

// export const getSocket = () => socket;
