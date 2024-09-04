const allowedOrigins = require("./allowedOrigins")

const corsOptions={
    origin:(origin,callback)=>{
        if(allowedOrigins.indexOf(origin)!==-1 || !origin){
            callback(null,true)
        }  else{
            callback(new Error("Not Allowed by CORS"))
        } 
    },
    //Any data I send with request accept it
    Credential:true,
    optionSuccessStatus:200,
}

module.exports=corsOptions