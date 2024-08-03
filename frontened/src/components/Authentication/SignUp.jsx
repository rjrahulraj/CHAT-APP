import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { VStack } from "@chakra-ui/layout"
import { Button ,useToast} from "@chakra-ui/react";
import { useState } from "react"
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useChatState } from "../../Context/ChatProvider";

function SignUp() {
     const [show, setShow]=useState(false);
     const [name, setName]=useState("");
     const [email, setEmail]=useState("");
     const [password, setPassword]=useState("");
     const [pic, setPic] = useState();
     const [loading, setLoading]=useState(false);
     const navigate=useNavigate();
     const {setUser}=useChatState();
     
     const BASE_URL=import.meta.env.VITE_BASE_URL;
     const toast=useToast();

     const postDetails=(pics)=>{
          if(pics===undefined)
          {
               toast({
                    title: 'Select a image',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position:"top",
                  })
          }
          setLoading(true);
          if(pics.type==='image/jpeg' || pics.type==='image/png')
          {
               const data=new FormData();
               data.append("file", pics);
               data.append("upload_preset", "chat-App");
               data.append('cloud_name', 'dhvjp68yp'); 

               fetch('https://api.cloudinary.com/v1_1/dhvjp68yp/image/upload',{
                    method:"POST",
                    body:data,
               })
               .then((res) => res.json())
               .then((data)=>{
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
               })
               .catch((err) => {
                    console.log(err);
                    setLoading(false);
               });
          }
          else {
               toast({
                 title: "Please Select an Image!",
                 status: "warning",
                 duration: 5000,
                 isClosable: true,
                 position: "bottom",
               });
               setLoading(false);
               return;
             }
     }
     const submitHandler=async()=>{
          setLoading(true);

          if(!name || !email || !password)
          {
               toast({
                    title: 'Fill all credentials',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position:"top",
                  })
               setLoading(false);
               return;
          }
          try {
               

               let {data}=await axios.post(`${BASE_URL}/user/api/register`, {name, email, password, pic}, {
                    headers:{'Content-Type':'application/json'}
               });
               console.log(data);
               if(data)
               {
                    toast({
                         title: 'Successfull Registration',
                         status: 'success',
                         duration: 3000,
                         isClosable: true,
                         position:"top",
                       })
     
                    setUser(data);
                    localStorage.setItem('userInfo',JSON.stringify(data)); 
                    navigate('/chat');    
               }
               setLoading(false);
               console.log(data);

          } catch (error) {
              console.log(`Error at posting signing data at submitHandler in signip${error}`); 
          }

     }
     

  return (
    <VStack spacing="5px">
     <FormControl>
          <FormLabel>Name</FormLabel>
          <InputGroup>
               <Input placeholder="Enter your Name"  onChange={(e)=>setName(e.target.value)}></Input>
          </InputGroup>
     </FormControl>
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

     <FormControl>
          <FormLabel>Upload your picture</FormLabel>
          <Input type="file" accept="image/*" p="1.5" onChange={(e)=>postDetails(e.target.files[0])}/>

     </FormControl>

     <Button colorScheme="blue" width="100%" mt="15" onClick={submitHandler} isLoading={loading}>
          Sign up
     </Button>
      
    </VStack>
  )
}

export default SignUp;
