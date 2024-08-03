import { Box } from "@chakra-ui/layout"
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Input,  Spinner, useDisclosure, useToast } from "@chakra-ui/react"
import { useChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListitem from "./UserListitem";
import Navbar from "./Navbar";

function SideDrawer() {


     const { isOpen, onOpen, onClose } = useDisclosure()
     const [search, setSearch]=useState();
     const [searchResult, setSearchResult]=useState([]);
     const [loading, setLoading]=useState(false);//this loading is for finding the user 
     const [loadingChat, setLoadingChat]=useState(false);// this loading is of loading individuals chat of loggedUser and user Clicked
     const BASE_URL=import.meta.env.VITE_BASE_URL;
     const toast = useToast();
     const {user , setSelectChat ,chats, setChats}=useChatState();
     

     const accessChat=async(userId)=>{
          try { 
               setLoadingChat(true);
               let config={
                    headers:{
                         "Content-Type":"application/json",
                         Authorization:`Bearer ${user.token}`
                    }
               }

               const {data}=await axios.post(`${BASE_URL}/chat/api`,{userId} ,config)

               if(!chats.find((chat)=>chat._id===data._id))
               {
                    setChats([data,...chats]);
               }

               console.log(data);
               setSelectChat(data);
               setLoadingChat(false);

              
          } catch (error) {
               toast({
                    title: 'error in fetching Chat',
                    status: 'danger',
                    duration: 4000,
                    isClosable: true,
                    position:'top-center'
                  })  
          }
     }

     const handleSearch=async()=>{
          if(!search)
          {
               toast({
                    title: 'Please Enter something in search',
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                    position:'top-left'
                  })
          }
          try {
               setLoading(true);
               let config={
                    headers:{
                         Authorization:`Bearer ${user.token}`
                    }
               }
               const {data}=await axios.get(`${BASE_URL}/user/api/users/?search=${search}`, config)
               setSearchResult(data);
               console.log(searchResult);
               setLoading(false);    
          } catch (error) {
               toast({
                    title: 'error in fetching the User',
                    status: 'danger',
                    duration: 4000,
                    isClosable: true,
                    position:'top-left'
                  })     
          }
     }



  return (
    <div>
          {/* navbar  */}
        <Navbar user={user} onOpen={onOpen}></Navbar>     

          <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search users</DrawerHeader>

          <DrawerBody>
               <Box display="flex" gap="8px">
                    <Input placeholder='Type here...' onChange={(e)=>{setSearch(e.target.value)}} />
                    <Button onClick={handleSearch}>Go</Button>
               </Box>
               
               <Box display="flex" flexDirection="column" >
                     {loading? <ChatLoading></ChatLoading>:
                         searchResult?.map((user, idx)=>(
                              <UserListitem key={idx} user={user} handleFunction={()=>{accessChat(user._id)}}></UserListitem>
                         ))
                     }
                    
               </Box>
                    {loadingChat  && <Spinner />}

          </DrawerBody>

        </DrawerContent>
      </Drawer>

    </div>
  )
}

export default SideDrawer
