const chats=require('../DB/dummy_data_chat');
const asyncHandler=require('express-async-handler');
const Chat =require('../DB/models/chatModel');
const User = require('../DB/models/userModel');



const accessChat=asyncHandler(async(req,res)=>{
     const {userId}=req.body;

     if(!userId)
     {
          res.status(400).json({message:"UserId is missing !!!"});
          console.log('UserId is missing for getting individual chats');
     }



     let isChat=await Chat.find({
          isGroupChat: false,
          $and: [
            { users: { $elemMatch: { $eq: req.userDetails._id } } },
            { users: { $elemMatch: { $eq: userId } } },
          ],
        }).populate("users", "-password").populate("latestMessage");

     isChat=await User.populate(isChat, {
          path:"latestMessage.sender",
          select:"name pic email"
     })

     if(isChat.length>0)
     {
          res.send(isChat[0]);
     }
     else{
          let chatData = {
               chatName: "sender",
               isGroupChat: false,
               users: [req.userDetails.userId, userId],
             };
             
             try {
               const createdChat = await Chat.create(chatData);
               const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                 "users",
                 "-password"
               );
               res.status(200).json(FullChat);
             } catch (error) {
               res.status(400);
               console.log("error in creating new chat in access chat, ",error);
             }
     }
     
})


const fetchChats=asyncHandler(async(req, res)=>{
     try {
          const chats=await Chat.find({users:{
               $elemMatch:{$eq:req.userDetails.userId}
          }}).populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({updatedAt:-1})

          let result=await User.populate(chats, {
               path:"latestMessage.sender",
               select:"name pic email",
          })

          res.status(200).json(result);
     } catch (error) {
          console.log(`error in fetchsChat in fetchData`, error);
     }
})

const createGroupChat=asyncHandler(async(req,res)=>{
     let {name, users}=req.body;
     if(!name || !users)
     {    
          return res.status(400).json({message:"Please fill all rhe fields"});
     }
      users=JSON.parse(users);

      if(users.length<2)
      {
          return res.status(400).json({message:"More than 2 users are required to form group chat"});
      }

      users.push(req.userDetails.userId);


      try {

          const createGroupChat=await Chat.create({
               chatName:name,
               users:users,
               isGroupChat:true,
               groupAdmin:req.userDetails.userId,

          }) 
          
          const groupChat=await Chat.findOne({
               _id:createGroupChat._id
          }).populate('users','-password').populate('groupAdmin', '-password');

          res.status(200).json(groupChat);

      } catch (error) {
          console.log(`Error in creating group Chat ${error}`.red.bold);
      }
})

const renameGroup=asyncHandler(async(req, res)=>{
     const {chatName, chatId}=req.body;

     if(!chatName || ! chatId)
     {
          res.status(400).json({message:"Provide ChatName and ChatId"});
          return ;
     }

     try {
          
     const UpdateChat=await Chat.findByIdAndUpdate(
          chatId,
          {
               chatName,
          },{
               new:true
          }
     ).populate('users','-password').populate('groupAdmin', '-password');

     res.status(200).json(UpdateChat);
     } catch (error) {
          console.log(`Error in renameGroup  in renaming ${error}`.red.bold);
     }
})

const addToGroup=asyncHandler(async(req,res)=>{
     const {userId, chatId}=req.body;

     
     try {
          
          const added = await Chat.findByIdAndUpdate(
               chatId,
               {
                 $push: { users: userId },
               },
               {
                 new: true,
               }
             )
               .populate("users", "-password")
               .populate("groupAdmin", "-password");

               if (!added) {
                    res.status(404);
                    throw new Error("Chat Not Found");
                  } else {
                    res.json(added);
                  }
     } catch (error) {

          console.log('Error in add users in group i addtoGroup', error);
     }
})
const removeFromGroup=asyncHandler(async(req,res)=>{
     const {userId, chatId}=req.body;
     try {
          let removed=await Chat.findByIdAndUpdate(
          chatId,
          {
               $pull:{users:userId}
          },
          {new:true}
          ).populate('users', '-password').populate("groupAdmin","-password");

          res.status(200).json(removed);
     } catch (error) {
          console.log('Error in remove users inremove group', error);
     }
})


module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addToGroup, removeFromGroup};