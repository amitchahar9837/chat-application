import React from "react";
import ChatTopHeader from "./ChatTopHeader";
import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ChatSkeleton from "./ChatSkeleton";
import MessageInput from "./MessageInput";

export default function ChatContainer() {
    const user = useSelector(state => state.chat.selectedUser);
    const onlineUsers = useSelector(state => state.auth.onlineUsers);
    const [loadingChat, setLoadingChat] = React.useState(true);
  return (
    <Box
        flex="1"
        display="flex"
        flexDirection="column"
        height="100vh"
        width="100%"
        borderLeft="1px solid #ccc"
    >
      <ChatTopHeader
        user={{ fullName: user.fullName, profilePic: "" }}
        isOnline={onlineUsers.includes(user._id)}
        onDeleteChat={() => console.log("Chat deleted")}
      />
      {loadingChat && (
        <ChatSkeleton/>
      )}
      <MessageInput/>
    </Box>
  );
}
