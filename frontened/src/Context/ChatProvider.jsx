import {createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
// import {useHistory} from 'react-router-dom';

const ChatContext=createContext();


function ChatProvider({children}) {
     const [user, setUser]=useState(null);
     const [selectChat, setSelectChat]=useState(null);
     const [chats, setChats]=useState(null);
     const [notification, setNotification]=useState([]);
     
     
     const navigate = useNavigate();

     useEffect(()=>{
     const userInfo=JSON.parse(localStorage.getItem('userInfo'));
       setUser(userInfo);

       if(!userInfo)
       {
          navigate('/');
       }
     },[])


  return (
    <ChatContext.Provider value={{user, setUser,selectChat, setSelectChat, chats, setChats,   notification,  setNotification}}>
          {children}
    </ChatContext.Provider>
  )
}

export const useChatState=()=>{
     return useContext(ChatContext);
}

export default ChatProvider;
