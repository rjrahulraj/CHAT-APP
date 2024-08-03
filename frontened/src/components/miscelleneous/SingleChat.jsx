import { useEffect, useState } from "react";
import { useChatState } from "../../Context/ChatProvider";
import { Box, Button, FormControl, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, ChatUserDetails } from '../.././config/ChatLogics';
import ProfileModel from "./ProfileModel";
import { IoEye } from "react-icons/io5";
import { BiSolidRightArrow } from "react-icons/bi";
import UpdateGroupModel from "./UpdateGroupModel";
import axios from "axios";
import '../../styles/style.css';
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';
import animationData from "../../animinations/typing.json";
import Lottie from "react-lottie";

let socket, selectChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectChat, setSelectChat, notification, setNotification } = useChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping]=useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    console.log("Connecting to socket...");
    socket = io(BASE_URL);

    socket.emit('setup', user);
    socket.on('connected', () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, [BASE_URL, user]);

  const sendMessage = async (e) => {
    if ((e._reactName === "onClick" || e.code === "Enter") && newMessage) {
      socket.emit('stop typing', selectChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `${BASE_URL}/message/api`,
          {
            content: newMessage,
            chatId: selectChat._id,
          },
          config
        );

        setNewMessage("");
        socket.emit('new message', data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toast({
          title: "Error sending the message. Please try again later.",
          position: "top",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let latestTypingTime = new Date().getTime();

      if (latestTypingTime - lastTypingTime >= timerLength) {
        setTyping(false);
        socket.emit("stop typing", selectChat._id);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${BASE_URL}/message/api/${selectChat._id}`, config);
      setLoading(false);
      setMessages(data);
      socket.emit('join chat', selectChat._id);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error fetching messages. Please try again later.",
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectChatCompare = selectChat;
  }, [selectChat]);

  useEffect(() => {
    socket.on('message recieved',  (newMessageReceived) => {
      if (!selectChatCompare || selectChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });

   
  });

  return (
    <>
      {selectChat ? (
        <Box w="100%" h="100%">
          <Box w="100%">
            <Text
              fontSize={{ base: "18px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work Sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <Button display={{ base: "flex", md: "none" }} onClick={() => setSelectChat(null)}>
                <ArrowBackIcon />
              </Button>

              {!selectChat.isGroupChat ? (
                <>
                  {getSender(user, selectChat.users)}
                  <ProfileModel user={ChatUserDetails(user, selectChat.users)}>
                    <Button>
                      <IoEye />
                    </Button>
                  </ProfileModel>
                </>
              ) : (
                <>
                  {selectChat.chatName.toUpperCase()}
                  <UpdateGroupModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                </>
              )}
            </Text>
          </Box>
          <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="90%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" margin="auto" alignSelf="center" h={20} w={20} />
            ) : (
              <>
                <div className="message">
                  <ScrollableChat messages={messages} />
                </div>
              </>
            )}
            <FormControl onKeyDown={sendMessage} position="sticky" bottom="0" mt="auto">
              {isTyping && (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              )}
              <InputGroup>
                <Input
                  placeholder="Write a message"
                  bg="#E0E0E3"
                  variant="filled"
                  onChange={typingHandler}
                  value={newMessage}
                />
                <InputRightElement cursor="pointer">
                  <button onClick={sendMessage}>
                    <BiSolidRightArrow size="20px" />
                  </button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
