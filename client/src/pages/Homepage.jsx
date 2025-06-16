import { Flex, Box, Text } from "@chakra-ui/react";
import { Sidebar, NoChatSelected } from "../components";
import { useSelector } from "react-redux";

export default function Homepage() {
  const { selectedUser } = useSelector((state) => state.chat);
  return (
    <Box height="100vh" w={"100%"} px={3}>
      <Flex w={"100%"}>
        <Sidebar />
        <Flex w={"100%"} display={{base:"none", md:"flex"}} >
          {selectedUser ? <Text>Chat</Text> : <NoChatSelected />}
        </Flex>
      </Flex>
    </Box>
  );
}
