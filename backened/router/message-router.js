const express =require('express');
const {messageSend, allMessages}=require('../controllers/messageController')
const messageRouter =express.Router();
const UserAuthenication=require('../middlewares/authMiddlware');

messageRouter.route('/api').post(UserAuthenication,messageSend)
messageRouter.route('/api/:chatId').get(UserAuthenication,allMessages)

module.exports=messageRouter;