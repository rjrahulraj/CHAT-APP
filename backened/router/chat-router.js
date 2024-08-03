const express=require('express');
const {accessChat, fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}=require('../controllers/chatController');
const chatRouter=express.Router();
const UserAuthenication=require('../middlewares/authMiddlware');


chatRouter.route('/api').post(UserAuthenication, accessChat);

chatRouter.route('/api').get(UserAuthenication,fetchChats);
chatRouter.route('/api/group').post(UserAuthenication, createGroupChat);
chatRouter.route('/api/rename').put(UserAuthenication, renameGroup);
chatRouter.route('/api/groupAdd').put(UserAuthenication, addToGroup);
chatRouter.route('/api/groupRemove').put(UserAuthenication, removeFromGroup);







module.exports=chatRouter;