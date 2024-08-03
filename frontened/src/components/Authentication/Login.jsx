import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { Button ,useToast } from "@chakra-ui/react";
import { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useChatState } from "../../Context/ChatProvider";


function Login() {

     const [show, setShow]=useState(false);
     const [email, setEmail]=useState("");
     const [password, setPassword]=useState("");
     const [loading, setLoading]=useState(false);
     const toast=useToast();
     const navigate=useNavigate();
     const {setUser}=useChatState();

     const BASE_URL=import.meta.env.VITE_BASE_URL;

     async function submitHandler(){
          if(!email || !password)
          {
               toast({
                    title: 'Fill all credentials',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position:"top",
                  })
                  return;
          }
          setLoading(true);
          try {

               let {data}=await axios.post(`${BASE_URL}/user/api/login`,{email, password},{headers:{
                    "Content-Type":"application/json",
               }})
               setLoading(false);
               console.log(data);
               setUser(data);
               data=JSON.stringify(data);
               localStorage.setItem('userInfo',data);
               navigate('/chat');
          } catch (error) {
               console.log(`Error at posting logging data at submitHandler in Login ${error}`);
               setLoading(false);
               toast({
                    title: 'Error in server !!! try after sometime',
                    status: 'danger',
                    duration: 3000,
                    isClosable: true,
                    position:"top",
                  })
                  return;
          }
     }

  return (
    <div>
      <FormControl>
          <FormLabel>Email</FormLabel>
          <InputGroup>
               <Input placeholder="Enter your Email"  onChange={(e)=>setEmail(e.target.value)}></Input>
          </InputGroup>
     </FormControl>
     <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
               <Input type={show ===true ? "text": "password"} placeholder="Enter your Password"  onChange={(e)=>setPassword(e.target.value)}></Input>
               <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="lg" onClick={()=>setShow(!show)}> {show===true?<BiSolidHide/>: <BiSolidShow/> } </Button>
               </InputRightElement>
          </InputGroup>
     </FormControl>

     <Button w="100%" mt="15px" colorScheme="blue" isLoading={loading} onClick={submitHandler}>Login</Button>
     <Button w="100%" mt="15px" colorScheme="red">Get request User Credentails</Button>

      
    </div>
  )
}

export default Login
