import { Avatar, Box, Flex, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function SidebarUser({
  data,
  onlineUsers,
  dispatch,
  setSelectedUser,
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  return (
    <Flex
      onClick={() => {
        dispatch(setSelectedUser(data.user));
        if (isMobile) {
          navigate(`/chat/${data.user._id}`);
        }
      }}
      align="center"
      gap={3}
      _hover={{ bg: "gray.100", cursor: "pointer" }}
    >
      <Box position="relative">
        <Avatar
          size="sm"
          ml={1}
          name={data.user.fullName}
          src=""
          cursor="pointer"
        />
        {onlineUsers && onlineUsers.includes(data.user._id) && (
          <Box
            position="absolute"
            bottom={0}
            right={0}
            boxSize="10px"
            bg="green.400"
            borderRadius="full"
            border="2px solid white"
          />
        )}
      </Box>
      <Box
        borderTop={"1px solid"}
        borderBottom={"1px solid"}
        w={"100%"}
        py={2}
        display={"flex"}
        flexDir={"column"}
        borderColor={useColorModeValue("gray.100", "gray.700")}
      >
        <Text fontWeight="medium">{data.user.fullName}</Text>
        {data.lastMessage && (
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.600", "gray.400")}
            noOfLines={1}
          >
            {data.lastMessage}
          </Text>
        )}
        {!data.lastMessage && (
          <Text fontWeight="normal" fontSize="sm" color="gray.500">
            {data.user.bio}
          </Text>
        )}
      </Box>
    </Flex>
  );
}
