import {
  Box,
  Flex,
  IconButton,
  Input,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function MessageInput() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box bg="#F0F2F5" p={3}>
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
              w={"150px"}
              zIndex={10}
            >
              {["Document", "Camera", "Photos & Videos"].map((item) => (
                <Text key={item} _hover={{ color: "blue.500", cursor: "pointer" }}>
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
        />

        {/* Right: Send icon */}
        <IconButton
          icon={<FaPaperPlane />}
          aria-label="Send"
          color="green.500"
          bg="white"
          _hover={{ bg: "gray.100" }}
          borderRadius="full"
          size="sm"
        />
      </Flex>
    </Box>
  );
}
