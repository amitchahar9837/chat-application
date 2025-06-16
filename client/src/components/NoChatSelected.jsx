import { Box, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { LuMessageSquare } from "react-icons/lu";

export default function NoChatSelected() {
  return (
    <Flex
      w="full"
      flex="1"
      direction="column"
      align="center"
      justify="center"
      p={16}
      bg="gray.50"
    >
      <VStack maxW="md" textAlign="center" spacing={6}>
        {/* Icon Display */}
        <Flex className="animate-bounce" justify="center" gap={4} mb={4}>
          <Box position="relative">
            <Flex
              w={16}
              h={16}
              borderRadius="2xl"
              bg="primary.100"
              color="primary.500"
              align="center"
              justify="center"
              animation="bounce 1s infinite"
            >
              <Icon as={LuMessageSquare } boxSize={100} />
            </Flex>
          </Box>
        </Flex>

        {/* Welcome Text */}
        <Heading size="md" fontWeight="bold">
          Welcome to Chat!
        </Heading>
        <Text color="gray.500">
          Select a conversation from the sidebar to start chatting
        </Text>
      </VStack>
    </Flex>
  );
}
