import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IoEye, IoCloseSharp } from "react-icons/io5";
import { useChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListitem from './UserListitem';

function UpdateGroupModal({ fetchAgain, setFetchAgain,fetchMessages }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectChat, setSelectChat, user } = useChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: 'Provide Group Name',
        position: 'top',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.put(`${BASE_URL}/chat/api/rename`, {
        chatId: selectChat._id,
        chatName: groupChatName,
      }, config);

      setRenameLoading(false);
      setSelectChat(data);
      setFetchAgain(!fetchAgain);
      setGroupChatName("");
      onClose();

    } catch (error) {
      setRenameLoading(false);
      toast({
        title: 'Error in renaming the group',
        position: 'top',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setGroupChatName("");
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`${BASE_URL}/user/api/users/?search=${query}`, config);
      setSearchResult(data);
      console.log(data);
      console.log(searchResult)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error in fetching the user',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-center'
      });
    }
  };

  const handleGroupUser = async (userToAdd) => {
    if (selectChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: 'User already added in the group',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top-center'
      });
      return;
    }

    if (selectChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admin can add members in group',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top-center'
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`${BASE_URL}/chat/api/groupAdd`, {
        userId: userToAdd._id,
        chatId: selectChat._id,
      }, config);
      setSelectChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: 'Error in adding the user',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-center'
      });
    }
  };

  const handleRemove = async (removedUser) => {
    if (selectChat.groupAdmin._id !== user._id && user._id !== removedUser._id) {
      toast({
        title: 'Only admin can remove members from group',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top-center'
      });
      return;
    }

    if(user._id === removedUser._id)
    {
      setSelectChat(null);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`${BASE_URL}/chat/api/groupRemove`, {
        userId: removedUser._id,
        chatId: selectChat._id,
      }, config);
      removedUser._id === user._id ? setSelectChat(null) : setSelectChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      
      
    } catch (error) {
      toast({
        title: 'Error in removing the user',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-center'
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen}><IoEye /></Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{selectChat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexWrap='wrap'>
            {selectChat?.users?.map((u, idx) => (
              <Box key={idx} display="flex" alignItems="center" borderRadius="lg" cursor="pointer" m="4px" p="5px" bg="purple" color="white">
                {u.name}
                <IoCloseSharp onClick={() => handleRemove(u)} />
              </Box>
            ))}

            <FormControl display="flex" alignItems="center">
              <Input
                placeholder="Chat name"
                value={groupChatName}
                mb={3}
                m={2}
                onChange={(e) => setGroupChatName(e.target.value)}
                ml={1}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <Input
                placeholder="Add Users"
                mb={3}
                m={2}
                onChange={(e) => handleSearch(e.target.value)}
                ml={1}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((ur1) => (
                <UserListitem
                  key={ur1._id}
                  user={ur1}
                  handleFunction={() => handleGroupUser(ur1)}
                />
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupModal;
