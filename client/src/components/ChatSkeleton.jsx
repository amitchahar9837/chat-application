import { Box, Flex, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

export default function ChatSkeleton() {
  return (
    <VStack
      w={"100%"}
      h={'calc(100dvh - 130px)'}
      spacing={4}
      align="stretch"
      px={4}
      py={6}
      flex="1"
    >
      {/* Message skeletons */}
      {[...Array(10)].map((_, i) => (
        <Flex key={i} justify={i % 2 === 0 ? "flex-start" : "flex-end"}>
          <Box
            maxW="40%"
            w="100%"
            bg={i % 2 === 0 ? "gray.100" : "blue.100"}
            p={3}
            borderRadius="md"
          >
            <SkeletonText noOfLines={2} spacing="2" skeletonHeight="3" />
          </Box>
        </Flex>
      ))}
    </VStack>
  );
}
