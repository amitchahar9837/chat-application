import React, { useCallback, useEffect } from "react";
import ChatTopHeader from "./ChatTopHeader";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import ChatSkeleton from "./ChatSkeleton";
import MessageInput from "./MessageInput";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import {
  addIncomingMessage,
  addUploadFile,
  getMessages,
  markAllMessagesAsSeen,
  markMessagesAsSeen,
  updateLastMessageInSidebar,
  updateMessageStatus,
} from "../redux/slices/ChatSlice";
import { formatTime } from "../utils/formatTime";
import FilePreview from "./FilePreview";
import ChatImagePreview from "./ChatImagePreview";
const BASE_URL = "https://res.cloudinary.com/developer-amit-1718/image/upload";

export default function ChatContainer() {
  const [showPreview, setShowPreview] = React.useState(false);
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const onlineUsers = useSelector((state) => state.auth.onlineUsers);
  const { isMessagesLoading, messages, uploadFile } = useSelector(
    (state) => state.chat
  );
  const authUser = useSelector((state) => state.auth.authUser);
  const dispatch = useDispatch();
  const messagesContainerRef = React.useRef(null);
  const socket = useSelector((state) => state.auth.socket);
  const lastMessageRef = React.useRef(null);

  const selectedUserRef = React.useRef(selectedUser);
  const authUserRef = React.useRef(authUser);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);
  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  const normalizeId = (val) => (val && typeof val === "object" ? val._id : val);

  function togglePreview() {
    setShowPreview((prev) => !prev);
  }
  function onFileSelect(files, type) {
    if (type === "photos") {
      dispatch(addUploadFile(files[0]));
      togglePreview();
    }
  }

  const handleNewMessage = useCallback(
    (payload) => {
      const { message, sender, receiver } = payload;
      const senderId = normalizeId(message.senderId);
      const receiverId = normalizeId(message.receiverId);
      const loggedInId = authUserRef.current?._id;
      const openChatId = selectedUserRef.current?._id;

      dispatch(
        updateLastMessageInSidebar({
          message,
          sender:
            sender ||
            (typeof message.senderId === "object" ? message.senderId : null),
          receiver:
            receiver ||
            (typeof message.receiverId === "object"
              ? message.receiverId
              : null),
          loggedInUserId: loggedInId,
        })
      );

      // 2) If current chat is open and message belongs to this chat => add to chat container
      const isRelevantToOpenChat =
        openChatId && (senderId === openChatId || receiverId === openChatId);
      if (isRelevantToOpenChat) {
        dispatch(addIncomingMessage(message));

        // If message is from the open chat user -> mark as seen
        if (senderId === openChatId) {
          // emit seen (server will mark messages seen and notify sender)
          socket.emit("mark_as_seen", {
            senderId: senderId,
            receiverId: loggedInId,
          });

          dispatch(markMessagesAsSeen({ messageIds: [message._id] }));
        } else {
          socket.emit("message_delivered", { messageId: message._id });
        }
      } else {
        socket.emit("message_delivered", { messageId: message._id });
      }
    },
    [dispatch, socket]
  );

  const handleMessageStatusUpdate = useCallback(
    (payload) => {
      const { message, sender, receiver } = payload;
      dispatch(updateMessageStatus(message));
      dispatch(
        updateLastMessageInSidebar({
          message,
          sender,
          receiver,
          loggedInUserId: authUserRef.current?._id,
        })
      );
    },
    [dispatch]
  );

  const handleMessageSeen = useCallback(
    (payload) => {
      const { message, sender, receiver } = payload;
      dispatch(markAllMessagesAsSeen({sender:authUser._id, receiver:receiver._id}))
      dispatch(
        updateLastMessageInSidebar({
          message,
          sender,
          receiver,
          loggedInUserId: authUserRef.current?._id,
        })
      );
    },
    [dispatch]
  );
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", handleNewMessage);
    socket.on("message_status_update", handleMessageStatusUpdate);
    socket.on("message_seen", handleMessageSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("message_status_update", handleMessageStatusUpdate);
      socket.off("message_seen", handleMessageSeen);
    };
  }, [socket]);

  useEffect(() => {
    if (!selectedUser) return;

    // 1️⃣ Fetch messages from backend
    dispatch(getMessages(selectedUser._id))
      .unwrap()
      .then((fetchedMessages) => {
        const unreadMessages = fetchedMessages.filter(
          (msg) => msg.status !== "seen" && msg.senderId === selectedUser._id
        );
        if (unreadMessages.length > 0) {
          socket.emit("mark_as_seen", {
            senderId: selectedUser._id,
            receiverId: authUser._id,
          });

          dispatch(
            markMessagesAsSeen({
              messageIds: unreadMessages.map((msg) => msg._id),
            })
          );
        }
      });
  }, [selectedUser, dispatch, socket, authUser._id]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <Box
      flex="1"
      display="flex"
      position={"relative"}
      flexDirection="column"
      height="100dvh"
      width="100%"
      borderLeft="1px solid #ccc"
      background="linear-gradient(135deg, #ffffff, #fef3c7)"
    >
      <ChatTopHeader
        user={{ fullName: selectedUser.fullName, profilePic: "" }}
        isOnline={onlineUsers && onlineUsers.includes(selectedUser._id)}
        onDeleteChat={() => console.log("Chat deleted")}
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
              key={idx}
              ref={idx === messages.length - 1 ? lastMessageRef : null}
              bg={message.senderId === authUser._id ? "green.100" : "white"}
              p={3}
              borderRadius="md"
              maxWidth="70%"
              alignSelf={
                message.senderId === authUser._id ? "flex-end" : "flex-start"
              }
              shadow={"0 0 5px 0 rgba(0, 0, 0, 0.1)"}
            >
              {message.image ? (
                <ChatImagePreview
                  localFile={message.localFile}
                  imageUrl={
                    message.image?.includes("upload/")
                      ? `${BASE_URL}/${message.image.split("upload/")[1]}`
                      : null
                  }
                  isUploading={message.isUploading}
                />
              ) : (
                <Text fontSize="sm" whiteSpace="pre-wrap" mb={2}>
                  {message.text}
                </Text>
              )}
              <Flex
                justify={
                  message.senderId === authUser._id ? "flex-end" : "flex-start"
                }
                align="center"
                gap={1}
              >
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
      {!isMessagesLoading && messages.length <= 0 && (
        <Flex p={4} overflowY="auto" h="calc(100% - 130px)"></Flex>
      )}
      <MessageInput onFileSelect={onFileSelect} />

      {showPreview && (
        <FilePreview image={uploadFile} togglePreview={togglePreview} />
      )}
    </Box>
  );
}
