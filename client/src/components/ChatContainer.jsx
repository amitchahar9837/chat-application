import React, { useCallback, useEffect } from "react";
import ChatTopHeader from "./ChatTopHeader";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import ChatSkeleton from "./ChatSkeleton";
import MessageInput from "./MessageInput";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import {
  addIncomingMessage,
  getMessages,
  markMessagesAsSeen,
  updateLastMessageInSidebar,
  updateMessageStatus,
} from "../redux/slices/ChatSlice";
import { formatTime } from "../utils/formatTime";

export default function ChatContainer() {
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const onlineUsers = useSelector((state) => state.auth.onlineUsers);
  const { isMessagesLoading, messages } = useSelector((state) => state.chat);
  const authUser = useSelector((state) => state.auth.authUser);
  const dispatch = useDispatch();
  const messagesContainerRef = React.useRef(null);
  const socket = useSelector((state) => state.auth.socket);
  const [isTyping, setIsTyping] = React.useState(false);
  const [seenEmitted, setSeenEmitted] = React.useState(false);
  const lastMessageRef = React.useRef(null);

  useEffect(() => {
    if (selectedUser) {
      setSeenEmitted(false);
      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser && socket) {
      socket.emit("mark_as_seen", {
        senderId: selectedUser._id,
        receiverId: authUser._id,
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      dispatch(addIncomingMessage(message));
      dispatch(
        updateLastMessageInSidebar({ ...message, authUserId: authUser._id })
      );
      if (message.receiverId === authUser._id) {
        socket.emit("message_delivered", {
          messageId: message._id,
          senderId: message.senderId,
          receiverId: message.receiverId,
        });
      }
    };
    const handleStatusUpdate = (updatedMessage) => {
      dispatch(updateMessageStatus(updatedMessage));
    };
    const handleSeenUpdate = (from, messageIds) => {
      dispatch(markMessagesAsSeen({ from, messageIds }));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("message_seen", handleSeenUpdate);
    socket.on("message_status_update", handleStatusUpdate);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("message_seen", handleSeenUpdate);
      socket.off("message_status_update", handleStatusUpdate);
    };
  }, [socket, authUser._id]);

  useEffect(() => {
    socket?.on("typing", ({ senderId }) => {
      if (senderId === selectedUser?._id) {
        setIsTyping(true);
      }
    });

    socket?.on("stop_typing", ({ senderId }) => {
      if (senderId === selectedUser?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("typing");
      socket?.off("stop_typing");
    };
  }, [selectedUser]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          messages.length > 0 &&
          messages[messages.length - 1].senderId === selectedUser._id &&
          !seenEmitted
        ) {
          socket.emit("mark_as_seen", {
            senderId: selectedUser._id,
            receiverId: authUser._id,
          });
          setSeenEmitted(true);
        }
      },
      { threshold: 1.0 }
    );

    if (lastMessageRef.current) {
      observer.observe(lastMessageRef.current);
    }

    return () => {
      if (lastMessageRef.current) {
        observer.unobserve(lastMessageRef.current);
      }
    };
  }, [messages, selectedUser]);

  return (
    <Box
      flex="1"
      display="flex"
      flexDirection="column"
      height="100dvh"
      width="100%"
      borderLeft="1px solid #ccc"
      background={
        'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("https://images.unsplash.com/photo-1623150502742-6a849aa94be4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
      }
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <ChatTopHeader
        user={{ fullName: selectedUser.fullName, profilePic: "" }}
        isOnline={onlineUsers && onlineUsers.includes(selectedUser._id)}
        onDeleteChat={() => console.log("Chat deleted")}
        isTyping={isTyping}
      />
      {isMessagesLoading && (
        <Box w={"100%"} h={"calc(100% - 130px)"} overflowY={"auto"}>
          <ChatSkeleton />
        </Box>
      )}
      {!isMessagesLoading && messages.length > 0 && (
        <Flex
          p={4}
          overflowY="auto"
          h="calc(100% - 130px)"
          direction="column"
          gap={3}
          ref={messagesContainerRef}
        >
          {messages.map((message, idx) => (
            <Box
              key={message._id}
              ref={idx === messages.length - 1 ? lastMessageRef : null}
              bg={message.senderId === authUser._id ? "green.100" : "white"}
              p={3}
              borderRadius="md"
              maxWidth="70%"
              alignSelf={
                message.senderId === authUser._id ? "flex-end" : "flex-start"
              }
            >
              {/* Message Text */}
              <Text fontSize="sm" whiteSpace="pre-wrap">
                {message.text}
              </Text>

              {/* Time + Tick Status */}
              <Flex mt={1} justify="flex-end" align="center" gap={1}>
                <Text fontSize="xs" color="gray.500">
                  {formatTime(message.createdAt)}
                </Text>
                {message.senderId === authUser._id && (
                  <>
                    {message.status === "sent" && (
                      <BiCheck size={16} color="gray" />
                    )}
                    {message.status === "delivered" && (
                      <BiCheckDouble size={16} color="gray" />
                    )}
                    {message.status === "seen" && (
                      <BiCheckDouble size={16} color="blue" />
                    )}
                  </>
                )}
              </Flex>
            </Box>
          ))}
        </Flex>
      )}
      <MessageInput />
    </Box>
  );
}
