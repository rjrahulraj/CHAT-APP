import { Box } from "@chakra-ui/layout"
import { Avatar,  Text } from "@chakra-ui/react"

function UserListitem({handleFunction, user}) {
  return (
    <Box onClick={handleFunction} display="flex" m="10px" alignItems="center" cursor="pointer" bg="#E8E8E8" _hover={{background:"#38B2AC", color:"white"} } borderRadius="lg" p="2" >

     <Avatar name={user.name} src={user.pic} size="sm" cursor="pointer" ></Avatar>
     <Box>
          <Text>{user.name}</Text>
          <Text fontSize="sm"> email: {user.email}</Text>
     </Box>

    </Box>
  )
}

export default UserListitem
