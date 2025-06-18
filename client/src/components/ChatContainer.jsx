import React, { useEffect } from "react";
import ChatTopHeader from "./ChatTopHeader";
import { Box, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import ChatSkeleton from "./ChatSkeleton";
import MessageInput from "./MessageInput";
import { addIncomingMessage, getMessages, getUsers, updateLastMessageInSidebar } from "../redux/slices/ChatSlice";
import { formatTime } from "../utils/formatTime";

export default function ChatContainer() {
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const onlineUsers = useSelector((state) => state.auth.onlineUsers);
  const { isMessagesLoading, messages } = useSelector((state) => state.chat);
  const authUser = useSelector((state) => state.auth.authUser);
  const dispatch = useDispatch();
  const messagesContainerRef = React.useRef(null);
  const socket = useSelector((state) => state.auth.socket);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
      if (socket) {
        socket.on("newMessage", (message) => {
          dispatch(addIncomingMessage(message));
          dispatch(
            updateLastMessageInSidebar({
              ...message,
              authUserId: authUser._id,
            })
          );
        });
      }
      return () => {
        if (socket) {
          socket.off("newMessage");
        }
      };
    }, [socket, dispatch]);

  // useEffect(() => {
  //   if (!socket) {
  //     return;
  //   }

  //   const handleConnect = () => {
  //     socket.on("newMessage", (message) => {
  //       dispatch(addIncomingMessage(message));
  //       dispatch(getUsers())
  //     });
  //   };
  //   // If already connected, set up immediately
  //   if (socket.connected) {
  //     handleConnect();
  //   } else {
  //     socket.on("connect", handleConnect);
  //   }

  //   // Cleanup
  //   return () => {
  //     socket.off("connect", handleConnect);
  //     socket.off("newMessage");
  //   };
  // }, [socket]);

  return (
    <Box
      flex="1"
      display="flex"
      flexDirection="column"
      height="100dvh"
      width="100%"
      borderLeft="1px solid #ccc"
    >
      <ChatTopHeader
        user={{ fullName: selectedUser.fullName, profilePic: "" }}
        isOnline={onlineUsers && onlineUsers.includes(selectedUser._id)}
        onDeleteChat={() => console.log("Chat deleted")}
      />
      {isMessagesLoading && <ChatSkeleton />}
      <Box
        p={4}
        overflowY="auto"
        h="calc(100% - 130px)"
        direction="column-reverse"
        ref={messagesContainerRef}
      >        
        {messages.map((message, index) => (
          <Box
            key={index}
            mb={4}
            display="flex"
            flexDirection="column"
            alignSelf={
              message.senderId === authUser._id ? "flex-start" : "flex-end"
            }
          >
            <Box
              bg={message.senderId === authUser._id ? "blue.100" : "gray.100"}
              p={3}
              borderRadius="md"
              maxWidth="70%"
              alignSelf={
                message.senderId === authUser._id ? "flex-end" : "flex-start"
              }
            >
              <Box
                bg={message.senderId === authUser._id ? "blue.100" : "gray.100"}
                borderRadius="md"
                width={"100%"}
                alignSelf={
                  message.senderId === authUser._id ? "flex-end" : "flex-start"
                }
              >
                {message.text}
              </Box>
              <Text
                alignSelf={
                  message.senderId === authUser._id ? "flex-end" : "flex-start"
                }
                fontSize="xs"
                color="gray.500"
                mt={1}
              >
                {formatTime(message.createdAt)}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
      <MessageInput />
    </Box>
  );
}
