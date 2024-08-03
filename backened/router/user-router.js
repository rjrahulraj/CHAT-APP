const express=require('express');
const userRouter=express.Router();
const {registerUser,AuthUserLogin, getAllUsers} =require('../controllers/user-controller');
const UserAuthenication=require('../middlewares/authMiddlware');

userRouter.route('/api/register').post(registerUser);
userRouter.route('/api/login').post(AuthUserLogin);
userRouter.route('/api/users').get(UserAuthenication,getAllUsers);


module.exports=userRouter;