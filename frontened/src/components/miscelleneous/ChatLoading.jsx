import { Stack } from "@chakra-ui/layout"
import { Skeleton } from "@chakra-ui/react"

function ChatLoading() {
  return (
     <Stack>
     <Skeleton height='20px' />
     <br />
     <Skeleton height='20px' />
     <br />
     <Skeleton height='20px' />
     <br />
     <Skeleton height='20px' />
     <br />
     <Skeleton height='20px' />
     <br />
     <Skeleton height='20px' />
     <br />
     <Skeleton height='20px' />
     <br />
     <Skeleton height='20px' />
     <br />
     <Skeleton height='20px' />
   </Stack>
  )
}

export default ChatLoading
