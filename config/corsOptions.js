const allowedOrigins = require("./allowedOrigins")

const corsOptions={
    origin:true,
    //Any data I send with request accept it
    Credential:true,
    optionSuccessStatus:200,
}

module.exports=corsOptions