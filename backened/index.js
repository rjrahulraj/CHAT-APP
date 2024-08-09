require('dotenv').config();
const express=require('express');
const port=process.env.SERVER_PORT;
const chatRouter=require('./router/chat-router');
const userRouter=require('./router/user-router');
const connect_DB=require('./DB/db')
const cors=require('cors');
const colors=require('colors');
const messageRouter = require('./router/message-router');

const app=express();
app.use(express.json());
const corseOption={
     // origin:"http://localhost:5173",
     origin:"https://snap-chat.onrender.com",
     methods:"GET, POST, PUT, DELETE, HEAD,PATCH",
     credential:true
}

// tackling the cors policy
app.use(cors(corseOption));

app.use(express.json());




app.use('/chat',chatRouter);
app.use('/user',userRouter);
app.use('/message',messageRouter);

connect_DB().then(()=>{
     console.log('DB connected successfully'.rainbow);  
})
const server=app.listen(port,()=>{
     console.log(`Server start at :: ${port}`.rainbow.bold);
})


const io=require('socket.io')(server, {
     pingTimeout:60000,
     cors:{
          origin:"http://localhost:5173",
     },
})

io.on('connection', (socket)=>{
     // console.log('Users Connected', socket.id);
     
     
     socket.on('setup', (userData)=>{
          socket.join(userData._id);
          // console.log(userData._id, userData.name);
          socket.emit('connected');
     })

     // joining the particular chat room
     socket.on('join chat', (room)=>{
          socket.join(room);
          // console.log("User Joined Room ::  ", room);
     })

     socket.on('typing', (room)=>{
          socket.in(room).emit('typing')
     })
     socket.on('stop typing', (room)=>{
          socket.in(room).emit('stop typing')
     })

     socket.on('new message', (newMessageRecieved)=>{
          let chat=newMessageRecieved.chat;
           
          if(!chat.users) return console.log(`chat.users not defined`);

          chat.users.forEach(user=>{
               if(user._id==newMessageRecieved.sender._id) return;
               socket.in(user._id).emit('message recieved', newMessageRecieved);
          })          
     }) 
})
