import {
  Avatar,
  Box,
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowBackIcon, Search2Icon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { resetMessages, setSelectedUser } from "../redux/slices/ChatSlice";
import { useNavigate } from "react-router-dom";

export default function ChatTopHeader({ user, isOnline, onDeleteChat }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Flex
      bg="#F0F2F5"
      p={3}
      align="center"
      justify="space-between"
      borderBottom="1px solid #eee"
      boxShadow={{ base: "none", md: "sm" }}
    >
      {/* Left section: Avatar, name, online */}
      <Flex align="center" gap={3}>
        <Icon
        display={{ base: "block", md: "none" }}
          as={ArrowBackIcon}
          color="black"
          boxSize={5}
          cursor="pointer"
          onClick={() => navigate("/")}
        />
        <Avatar size="sm" name={user.fullName} src={user.profilePic || ""} />
        <Box>
          <Text fontWeight="bold">{user.fullName}</Text>
          {isOnline && (
            <Text fontSize="sm" color="green.500">
              Online
            </Text>
          )}
        </Box>
      </Flex>

      {/* Right section: Search & Menu */}
      <Flex align="center" gap={2}>
        <IconButton
          icon={<Search2Icon />}
          variant="ghost"
          aria-label="Search"
        />
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<BsThreeDotsVertical />}
            variant="ghost"
            aria-label="Options"
          />
          <MenuList>
            <MenuItem>Contact Info</MenuItem>
            <MenuItem onClick={() => {
              dispatch(resetMessages());
              dispatch(setSelectedUser(null));
              isMobile && navigate('/')
            }}>
              Close Chat
            </MenuItem>
            <MenuItem onClick={onOpen} color="red.500">
              Delete Chat
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Confirm Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this chat? This action cannot be
            undone.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                onDeleteChat();
                onClose();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
