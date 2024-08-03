const mongoose=require('mongoose')



const connect_DB=()=>{
     try {
          return  mongoose.connect(process.env.MONGODB_URL,{
               useNewUrlParser:true,
               useUnifiedTopology:true,
          });

     } catch (error) {
          console.log(`error in DB connection ${error}`.red.bold) ;
     }
}

module.exports=connect_DB;