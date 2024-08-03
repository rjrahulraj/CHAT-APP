import { Box, useToast, Text, Stack, Button, useDisclosure } from "@chakra-ui/react";
import { useChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import { IoMdAdd } from "react-icons/io";
import GroupChatModel from "./GroupChatModel";
import {getSender} from '../.././config/ChatLogics';
function MyChats({fetchAgain}) {
  const { user, selectChat, setSelectChat, chats, setChats } = useChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loggedUser, setLoggedUser] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const toast = useToast();
  

  

  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${BASE_URL}/chat/api`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error in fetching chat",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchChat();
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [fetchAgain]);

  const handleChatChange = (chat) => {
    setSelectChat(chat);
    console.log(chat);
  };

  return (
    <Box
      display={{ base: selectChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "35%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My Chats</Text>

        <GroupChatModel isOpen={isOpen} onClose={onClose}>
          <Button onClick={onOpen} display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }} rightIcon={<IoMdAdd />}>
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat, idx) => (
              <Box
                onClick={() => handleChatChange(chat)}
                key={idx}
                cursor="pointer"
                bg={selectChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
