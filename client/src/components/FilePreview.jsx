import { AnimatePresence } from "framer-motion";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, IconButton, Image, Text } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import { sendMessage } from "../redux/slices/ChatSlice";
import { useDispatch } from "react-redux";
import { convertToBase64 } from "../utils/Base64Image";
import toast from "react-hot-toast";

export default function FilePreview({ image, togglePreview }) {
  const dispatch = useDispatch();
  let messageData;

  const handleSendMessage = async () => {
    if (image.size > 1 * 1024 * 1024) {
      toast.error("File size must not exceed 1MB");
      return;
    }
    const base64Image = await convertToBase64(image);
    messageData = { image: base64Image, localFile: image || null, };
    dispatch(sendMessage(messageData));
    togglePreview();
  };
  return (
    <AnimatePresence>
      {image && (
        <Box
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          position="absolute"
          bottom="0"
          left="0"
          width="100%"
          bg="white"
          boxShadow="lg"
          height="calc(100dvh - 80px)"
          overflowY={"auto"}
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={5}
          zIndex={20}
        >
          {/* Close Button */}
          <IconButton
            onClick={togglePreview}
            aria-label="Close Preview"
            icon={<CloseIcon />}
            size="md"
            alignSelf="flex-start"
            variant="ghost"
            flexShrink={0}
            mb={10}
            _hover={{ bg: "gray.100" }}
          />
          <Text fontSize="2xl" fontWeight={"700"} color="">
            Image Preview
          </Text>
          {/* Image Preview */}
          <Box
            w="sm"
            h="sm"
            background={"#f7f7f7"}
            p={8}
            shadow={"0 0 10px 0 rgba(0, 0, 0, 0.2)"}
          >
            <Image
              src={URL.createObjectURL(image)}
              alt="Preview"
              fit={"contain"}
              w="100%"
              h="100%"
            />
          </Box>
          <Text mt={2} fontSize="md" color="gray.800">
            {image?.name}
          </Text>
          <IconButton
            icon={<FaPaperPlane />}
            aria-label="Send"
            color={`white`}
            bg="green.500"
            _hover={{ bg: "green.500" }}
            mt={8}
            flexShrink={0}
            borderRadius="full"
            size="lg"
            onClick={handleSendMessage}
            alignSelf={"flex-end"}
          />
        </Box>
      )}
    </AnimatePresence>
  );
}
