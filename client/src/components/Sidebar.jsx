import { CloseIcon, SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setSelectedUser } from "../redux/slices/ChatSlice";
import { logout } from "../redux/slices/AuthSlice";
import DynamicAvatar from "./DynamicAvatar";
import { axiosInstance } from "../utils/axiosInstance";

export default function Sidebar() {
  const profileModal = useDisclosure();
  const logoutModal = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const { users, isUsersLoading } = useSelector((state) => state.chat);
  const onlineUsers = useSelector((state) => state.auth.onlineUsers);
  const authUser = useSelector((state) => state.auth.authUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
  };

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const searchEverything = async(searhQuery)=>{
    try {
      const response = await axiosInstance.get(`/search?q=${searhQuery}`);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if (searchQuery.trim().length > 0) {
      const delayDebounceFn = setTimeout(() => {
        searchEverything(searchQuery);
      }, 500); 

      return () => clearTimeout(delayDebounceFn); 
    }
  },[searchQuery])


  return (
    <Box
      height="100vh"
      w={{ base: "100%", md: "50%", lg: "40%", xl: "30%" }}
      borderRight="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      overflowY="auto"
      boxShadow={{ base: "none", md: "md" }}
      px={3}
    >
      {/* TOP BAR */}
      <Flex py={6} justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">
          Chats
        </Text>

        {/* Avatar with Menu */}
        <Menu>
          <MenuButton>
            <DynamicAvatar/>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={profileModal.onOpen}>Profile</MenuItem>
            <MenuItem onClick={logoutModal.onOpen}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Search Bar */}
      <InputGroup
        px={1}
        py={2}
        bg={"gray.100"}
        borderRadius="md"
        overflow={"hidden"}
      >
        <InputLeftElement pointerEvents="none" h="100%">
          <Flex align="center" h="100%">
            <SearchIcon color="gray.500" boxSize={4} />
          </Flex>
        </InputLeftElement>
        <Input
          placeholder="Search"
          border="none"
          outline="none"
          _focus={{
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          px={2}
          ml={2}
          pl="30px"
          variant="unstyled"
        />
        {searchQuery.length >0 && (
          <InputRightElement pointerEvents="pointer" h="100%">
          <Flex onClick={()=>setSearchQuery('')} align="center" h="100%">
            <CloseButton color="gray.500" boxSize={3} />
          </Flex>
        </InputRightElement>
        )}
      </InputGroup>

      {/* User List */}
      <Box mt={4}>
        {isUsersLoading ? (
          <HStack gap="5">
            <SkeletonCircle size="12" />
            <Stack flex="1">
              <Skeleton height="5" />
              <Skeleton height="5" width="80%" />
            </Stack>
          </HStack>
        ) : users.length > 0 ? (
          users.map((data) => (
            <Flex
              key={data.user._id}
              onClick={()=>dispatch(setSelectedUser(data.user))}
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
                {onlineUsers.includes(data.user._id) && (
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
                <Text fontWeight="light" fontSize="sm" color="gray.500">
                  {data.lastMessage}
                </Text>
              </Box>
            </Flex>
          ))
        ) : (
          <Text color="gray.500" textAlign="center" mt={4}>
            No users found please Chat with someone!
          </Text>
        )}
      </Box>

      {/* Profile Modal */}
      <Modal
        isOpen={profileModal.isOpen}
        onClose={profileModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Profile</ModalHeader>
          <ModalBody>
            <Flex direction="column" align="center" gap={4}>
              <Avatar size="xl" name={authUser.fullName} />
              <Text fontWeight="medium">{authUser.fullName}</Text>
              <Text fontSize="sm" color="gray.500">
                {authUser.email}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={profileModal.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModal.isOpen}
        onClose={logoutModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to logout?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={logoutModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
