const asyncHandler=require('express-async-handler');
const Message=require('../DB/models/messageModel');
const User=require('../DB/models/userModel');
const Chat=require('../DB/models/chatModel');
const mongoose=require('mongoose');


const messageSend=asyncHandler(async(req, res)=>{
     const {content,chatId}=req.body;
     
     if(!content || !chatId)
     {
          res.status(400).send("Please fill all the credentials");
          return;
     }
     let newMessage={
          sender:req.userDetails.userId,
          content,
          chat:chatId
     }

     try {
          let message=await Message.create(newMessage);
          message=await message.populate("sender", "name pic");
          message=await message.populate("chat");
          message=await User.populate(message,{
               path:"chat.users",
               select:"name pic email"
          })
          await Chat.findByIdAndUpdate(req.body.chatId, {
               latestMessage: message,
          })
          res.json(message);
     } catch (error) {
          res.status(400).json({message:" Error in Sending the message"})
          console.log('Error in message at MessageControllers',error);
     }
}
)

const allMessages = asyncHandler(async (req, res) => {
     
     const {chatId}=req.params;

     
   
     try {
       const messages = await Message.find({ chat: chatId})
         .populate("sender", "name pic email")
         .populate("chat");
         
       res.json(messages);
     } catch (error) {
       res.status(500);
       throw new Error("Error fetching messages");
     }
   });
module.exports={
     messageSend,
     allMessages
}