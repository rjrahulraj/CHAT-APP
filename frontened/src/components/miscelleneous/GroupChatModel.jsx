import {
     Modal,
     ModalOverlay,
     ModalContent,
     ModalHeader,
     ModalFooter,
     ModalBody,
     ModalCloseButton,
     Button,
     Input,
     useToast,
     FormControl,
     Spinner,
     Box,
} from '@chakra-ui/react'
import axios from 'axios';
import { useState } from 'react'
import { useChatState } from '../../Context/ChatProvider';
import UserListitem from './UserListitem';
import { IoCloseOutline } from "react-icons/io5";

function GroupChatModel({ children, isOpen, onClose }) {

     const {user,chats, setChats}=useChatState();
     const [groupChatName, setGroupChatName] = useState();
     
     const [selectedUsers, setSelectedUsers] = useState([]);
     const [search, setSearch] = useState("");
     const [searchResult, setSearchResult] = useState([]);
     const [loading, setLoading] = useState(false);
     const toast = useToast();

     const BASE_URL=import.meta.env.VITE_BASE_URL;

     const handleSearch=async(query)=>{
          setSearch(query);
          if(!query)
          {
               return;
          }

          try {
               setLoading(true);
               let config={
                    headers:{
                         Authorization:`Bearer ${user.token}`
                    }
               }
               const {data}=await axios.get(`${BASE_URL}/user/api/users/?search=${query}`, config)
               setSearchResult(data);
               console.log(searchResult);
               setLoading(false);    
          } catch (error) {
               toast({
                    title: 'error in fetching the User',
                    status: 'danger',
                    duration: 4000,
                    isClosable: true,
                    position:'top-center'
                  })     
          }

     }

     const handleSubmit=async()=>{
          if(!groupChatName || !selectedUsers)
          {
               toast({
                    title: 'fill all the credentials',
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                    position:'top-center'
                  })
                  return;
          }
          if(selectedUsers.length < 2)
          {
               toast({
                    title: 'Group Chat Can be Created with alleast 3 Users',
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                    position:'top-center'
                  })
                  return;
          }
          try {

               let config={
                    headers:{
                         Authorization:`Bearer ${user.token}`
                    }
               }

               const {data}=await axios.post(`${BASE_URL}/chat/api/group`,{
                    name:groupChatName, 
                    users:JSON.stringify(selectedUsers?.map((u)=>u._id))
               }, config);
               console.log(data);
               setChats([data,...chats ])
               onClose();

               if(data)
               {
                    toast({
                         title: 'Group Chat Created',
                         status: 'success',
                         duration: 4000,
                         isClosable: true,
                         position:'top-center'
                       })
               }
               
          } catch (error) {
               toast({
                    title: 'error in creating the group Chat',
                    status: 'danger',
                    duration: 4000,
                    isClosable: true,
                    position:'top-center'
                  })
               
          }

     }

     const handleGroup=(userToAdd)=>{
          if(selectedUsers.includes(userToAdd))
          {
               toast({
                    title: 'User Already Added',
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                  })

                  return;
          }

          setSelectedUsers([...selectedUsers, userToAdd]);
          
     }

     const handleDelete=(u)=>{
          
          let newSelectedUsers= selectedUsers.filter((user)=>{return user._id!==u._id});
          setSelectedUsers(newSelectedUsers);
     }

     return (

          <>
               {children}
               <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                         <ModalHeader textAlign="center">Create Group Chat</ModalHeader>
                         <ModalCloseButton />
                         <ModalBody>
                              <FormControl>
                                   <Input m="1" onChange={(e) => setGroupChatName(e.target.value)} placeholder='Chat Name' ></Input>
                              </FormControl>
                              <FormControl>
                                   <Input m="1" onChange={(e) => handleSearch(e.target.value)} placeholder='Add Users'></Input>
                              </FormControl>

                              <Box display="flex" flexWrap="wrap" w="100%">
                              {selectedUsers?.map((u,idx)=>(
                                   <Box onClick={()=>{handleDelete(u)}}  key={idx} display="flex"  alignItems="center"  borderRadius="lg" cursor="pointer" variant="solid"  m="4px" p="5px" bg="purple" 
                                   color="white">
                                        {/* <Badge variant='solid' colorScheme='green'> */}
                                             {u.name}
                                        {/* </Badge> */}
                                        <IoCloseOutline />
                                   </Box>
                              ))}
                              </Box>

                              {loading ? <Spinner/> :(searchResult?.slice(0,4).map((user, idx)=>(
                                   <UserListitem user={user} handleFunction={()=>{handleGroup(user)}} key={idx}></UserListitem>
                              )))}

                         </ModalBody>

                         <ModalFooter>
                              <Button colorScheme='blue' mr={3}  onClick={handleSubmit}>
                                   Create Chat
                              </Button>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </>
     )
}

export default GroupChatModel
