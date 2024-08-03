
import ScrollableFeed from 'react-scrollable-feed';
import { useChatState } from '../../Context/ChatProvider';
import { isSameSender, isLastMessage, isSameSenderMargin } from '../../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';


function ScrollableChat({messages}) {

     const {user}=useChatState();

  return (
    <ScrollableFeed>
          {messages && messages.map((msg,idx)=>(
                    <div key={idx} style={{display:"flex"}}>
                              {(isSameSender(messages, msg, idx,user._id)
                              || isLastMessage(messages,idx,user._id) )&& 
                                   <Tooltip
                                        label={msg.sender.name}
                                        placement='bottom-start'
                                        hasArrow
                                   >
                                        <Avatar
                                             mt="7px"
                                             mr="1"
                                             size="sm"
                                             cursor="pointer"
                                             name={msg.sender.name}
                                             src={msg.sender.pic}
                                        ></Avatar>

                                   </Tooltip>
                              }

                              <span style={{
                              backgroundColor:`${msg.sender._id===user._id ? '#BEE3F8' :'#B9F5D0'}`,
                              borderRadius:"20px",
                              padding: "5px  15px",
                              maxWidth:"75%",
                              marginLeft:isSameSenderMargin(messages, msg, idx, user._id),
                              marginTop:isSameSender(messages, msg, idx, user._id)? 2:5
                              }}>

                              {msg.content}

                              </span>

                              

                    </div>

          ))}

    </ScrollableFeed>
  )

}

export default ScrollableChat