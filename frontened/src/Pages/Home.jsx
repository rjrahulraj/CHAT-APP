import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import SignUp from '../components/Authentication/SignUp';
import Login from '../components/Authentication/Login';
import {useNavigate} from 'react-router-dom';
import { useEffect } from 'react';




const Home = () => {

  const navigate=useNavigate();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('userInfo'));
    if(user)
    {
      navigate('/chat')
    }
  }, [navigate])

  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p='3'
        bg='white'
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth="2px"
      >
        <Text fontSize='3xl' fontFamily="Works Sans" textAlign="center" color="black">Snap-Talk</Text>
      </Box>

      <Box
        d='flex'
        justifyContent='center'
        p='3'
        bg='white'
        w='100%'
      
        borderRadius='lg'
        borderWidth="2px"
      >
        <Tabs variant='soft-rounded' colorScheme='teal'>
          <TabList>
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login></Login>
            </TabPanel>
            <TabPanel>
            <SignUp></SignUp>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home;
