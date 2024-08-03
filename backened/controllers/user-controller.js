const User = require("../DB/models/userModel");
const asyncHandler = require('express-async-handler');


// sign up functionalites
const registerUser = asyncHandler(async (req, res) => {
     try {
          let { name, email, password, pic } = req.body;
          if (!name || !email || !password) {
               res.status(400).json({ message: "Please Provide all the field" });
               return;
          }

          const userExists = await User.findOne({ email: email });

          if (userExists) {
               res.status(403).json({ message: "User already exists" });
               return;
          }
          // password=PasswordEncrypt(password);

          const userCreated = await User.create({ name, email, password, pic });
          if (userCreated) {
               res.status(201).json({
                    _id: userCreated._id,
                    name: userCreated.name,
                    email: userCreated.email,
                    pic: userCreated.pic,
                    token: await userCreated.generateToken()
               });
          }
          else {
               res.status(500).json({ message: "Failed to create User" });
          }



     } catch (error) {
          console.log(`Error in user-controller in register ${error}`.red.bold);

     }
});

// login functionalaties
const AuthUserLogin = asyncHandler(async (req, res) => {
     try {
          let { email, password } = req.body;

          let userExist = await User.findOne({ email });

          if (!userExist) {
               res.status(404).json({ message: "User doesn't Exist" });
               return;
          }

          let result = await userExist.comparePassword(password);

          if (!result) {
               res.status(403).json({ message: "Wrong Password ! Try Once Again" });
          }
          else {
               res.status(202).json({
                    _id: userExist._id,
                    name: userExist.name,
                    email: userExist.email,
                    pic: userExist.pic,
                    token: await userExist.generateToken()
               })
          }

     } catch (error) {
          console.log(`Error in user-controller in login ${error}`.red.bold);
     }
})


// get All users
// :id ->params
// ?search -> query



const getAllUsers = asyncHandler(async (req, res) => {
     try {
          const keyword = req.query.search
               ? {
                    $or: [
                         { name: { $regex: req.query.search, $options: "i" } },
                         { email: { $regex: req.query.search, $options: "i" } },
                    ],
               }
               : {};

          const users = await User.find(keyword).find({ _id: { $ne: req.userDetails._id } });
          res.send(users);
     } catch (error) {
          console.log(`Error in user-controller in getting all users ${error}`.red.bold);
     }
})

module.exports = { registerUser, AuthUserLogin, getAllUsers };
