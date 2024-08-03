
const jwt = require('jsonwebtoken');
const User=require('../DB/models/userModel');


// authorization
const UserAuthenication=async(req, res, next)=>{
     try {
          let token ;
          if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
     {
          try {
               token =req.headers.authorization.split(" ")[1];
               const userDetails=jwt.verify(token, process.env.JWT_SIGN_KEY);
               req.userDetails=userDetails;
               // console.log(userDetails);
               next();
          } catch (error) {
               res.status(401).json({message:"Unauthorized !! Access Denied"});
               console.log(`Error in auth-middleware in authorizating the user ${error}`.red.bold);
          }
     }
     else
     {
          res.status(400).json("Please login first");
     }
          
     } catch (error) {
          console.log(`Error in auth-middleware ${error}`.red.bold);    
     } 
}

module.exports=UserAuthenication;
