import { Box } from "@chakra-ui/layout";
import { useChatState } from "../../Context/ChatProvider";
import SingleChat from "./SingleChat";

function ChatBox({fetchAgain, setFetchAgain}) {

  const {selectChat, setSelectChat}=  useChatState();

  return (

    <Box
      display={{base:selectChat ? "flex": "none",md:"flex"}}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="white"
      w={{base:"100%", md:"65%"}}
      borderRadius="lg"
      borderWidth="1px"
      mx="10px"
    >
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></SingleChat>
    </Box>
  )
}

export default ChatBox;
