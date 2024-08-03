import { Box } from "@chakra-ui/layout"
import { Avatar, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, position, Tooltip } from "@chakra-ui/react"
import { CiSearch } from "react-icons/ci"
import ProfileModel from "./ProfileModel"
import { FaBell, FaSortDown } from "react-icons/fa"
import { Text } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import { useChatState } from "../../Context/ChatProvider"
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';


function Navbar({onOpen, user}) {


     const {notification,  setNotification, setSelectChat}=useChatState();

     const navigate=useNavigate();
     const logoutHandler=()=>{
          localStorage.removeItem('userInfo');
          navigate('/');
     }

  return (
     <Box 
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 10px 5px 10px"
         >
               <Tooltip label="search user to chat" placement="bottom-end">
                    <Button onClick={onOpen}  > 
                         <CiSearch color="black" ></CiSearch>
                         <Text display={{base:"none", md:"flex"}}  p="10px"> Search User</Text>
                    </Button>
                    
               </Tooltip>
               <Text fontSize="2xl" fontWeight="500">
               
               Snap-Talk
               </Text>
               <div style={{display:"flex"}}>
                    <Menu>
                         <MenuButton fontSize="xl" p="5px">
                         <NotificationBadge style={{top:"-10px", right:"-5px"}} count={notification.length} effect={Effect.SCALE}/>
                              <FaBell></FaBell> </MenuButton>
                         <MenuList> 
                              {!notification.length && " No new message"}
                              {notification.map((notify)=>(
                                   <MenuItem key={notify._id} onClick={()=>{
                                        setSelectChat(notify.chat);
                                        setNotification(notification.filter((n)=>n._id!==notify._id))
                                   }}>
                                        {notify.chat.isGroupChat?
                                         `new message ${notify.chat.chatName}`
                                         :`new message ${notify.sender.name}`}
                                   </MenuItem>
                              ))}
                         </MenuList>
                    </Menu>
                    <Menu>
                         <MenuButton as={Button} rightIcon={<FaSortDown />}>
                              <Avatar name={user.name} src={user.pic} size="sm" cursor="pointer" ></Avatar>
                         </MenuButton>
                         <MenuList>
                              <ProfileModel user={user}>
                                   <MenuItem>My Profile</MenuItem>
                              </ProfileModel>
                              <MenuDivider></MenuDivider>
                              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
                         </MenuList>
                    </Menu>
               </div>
          </Box>
  )
}

export default Navbar
