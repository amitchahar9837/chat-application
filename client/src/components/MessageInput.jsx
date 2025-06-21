import {
  Box,
  Flex,
  IconButton,
  Input,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  updateLastMessageInSidebar,
} from "../redux/slices/ChatSlice";

const MotionBox = motion.create(Box);

export default function MessageInput() {
  const { isOpen, onToggle } = useDisclosure();
  const { authUser } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.chat);
  const [messageData, setMessageData] = useState({
    text: "",
    image: null,
  });
  const socket = useSelector((state) => state.auth.socket);
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef(null);

  const handleSendMessage = () => {
    if (!messageData.text.trim()) return;

    try {
      dispatch(sendMessage(messageData));
      dispatch(
        updateLastMessageInSidebar({
          text: messageData.text,
          createdAt: new Date().toISOString(),
          authUserId: authUser._id,
          senderId: authUser._id,
          receiverId: selectedUser._id,
          sender: authUser,
          receiver: selectedUser,
        })
      );
      setMessageData({ text: "", image: null });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = () => {
    if (!socket || !selectedUser) return;

    // Emit typing event immediately
    socket.emit("typing", {
      receiverId: selectedUser._id,
      senderId: authUser._id,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new 3-second timer to emit stop_typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        receiverId: selectedUser._id,
        senderId: authUser._id,
      });
    }, 3000);
  };

  return (
    <Box bg="#F0F2F5" p={3}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <Flex align="center" gap={3}>
          {/* Left: Plus Icon with Modal */}
          <Box position="relative">
            <IconButton
              icon={
                <MotionBox
                  animate={{ rotate: isOpen ? 135 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <AddIcon boxSize={4} />
                </MotionBox>
              }
              onClick={onToggle}
              borderRadius="full"
              size="sm"
              bg="white"
              _hover={{ bg: "gray.100" }}
              type="button"
            />

            {/* Modal on top */}
            {isOpen && (
              <VStack
                position="absolute"
                bottom="130%"
                left="0"
                spacing={2}
                bg="white"
                p={2}
                borderRadius="md"
                boxShadow="md"
                align="start"
                w="150px"
                zIndex={10}
              >
                {["Document", "Camera", "Photos & Videos"].map((item) => (
                  <Text
                    key={item}
                    _hover={{ color: "blue.500", cursor: "pointer" }}
                  >
                    {item}
                  </Text>
                ))}
              </VStack>
            )}
          </Box>

          {/* Input field */}
          <Input
            bg="white"
            placeholder="Type a message"
            borderRadius="full"
            flex="1"
            value={messageData.text}
            onChange={(e) => {
              setMessageData((prev) => ({ ...prev, text: e.target.value }));
              handleTyping();
            }}
          />

          <IconButton
            icon={<FaPaperPlane />}
            aria-label="Send"
            color={`${messageData.text.trim() ? "blue.500" : "gray.400"}`}
            bg="white"
            _hover={{ bg: "gray.100" }}
            borderRadius="full"
            size="sm"
            type="submit"
            disabled={!messageData.text.trim()}
          />
        </Flex>
      </form>
    </Box>
  );
}
