
import { useChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/layout';
import SideDrawer from '../components/miscelleneous/SideDrawer';
import MyChats from '../components/miscelleneous/MyChats';
import ChatBox from '../components/miscelleneous/ChatBox';
import { useState } from 'react';
const ChatPage = () => {

const {user}=useChatState();

  const [fetchAgain,setFetchAgain]=useState(false);

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer></SideDrawer>}
      <Box display="flex"  w="100%" h="91.5vh" p="10px">
      {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></MyChats>}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></ChatBox>} 
      </Box>
    </div>
  )
}
export default ChatPage
