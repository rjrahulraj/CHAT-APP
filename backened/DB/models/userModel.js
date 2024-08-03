const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken');


const UserSchema=mongoose.Schema({
     name:{
          type:String, 
          required:true
     },
     email:{
          type:String,
          required:true,
          unique:true,
     },
     password:{
          type:String,
          required:true,
     },
     pic:{
          type:String,
          default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
     }
},{
     timestamps:true 
});

// this pre methods run before new data is going to save. 
// note :-writing async function is important and  arrow function will not work. 

UserSchema.pre('save', async function (next){
     
     if(!this.isModified)
     {
          next();
     }
        try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
       
        } catch (error) {
          console.log('err at modifing the password in user-models', error);
          // next(error);
     }
})

// note :-writing async function is important and  arrow function will not work.  
//note :- these will run on query return from model 
UserSchema.methods.generateToken=async function(){
     try{

          return jwt.sign(
               {
                    userId:this._id.toString(),
                    email: this.email,
                    
               },
               process.env.JWT_SIGN_KEY,
               {
                    expiresIn:'30d',
                    
               }
          );
     }
     catch(e)
     {
          console.error("Err at generateToken in userModels",e);
     }
}

UserSchema.methods.comparePassword=async function(password)
{
    try {
     return await bcrypt.compare(password,this.password);
    } catch (error) {
     console.log((`Error in compare bcryptjs password in usermodel ${error}`.red.bold));
    }
}



const User=mongoose.model('User', UserSchema);

module.exports=User;