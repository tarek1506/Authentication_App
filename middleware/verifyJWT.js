const jwt=require("jsonwebtoken")
const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers['Authorization']||req.headers['authorization']
   // console.log(authHeader)
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message:"unauthorized"})
    }
    const token=authHeader.split(' ')[1]
     jwt.verify(token,process.env.ACCESS_TOKEN_SECRETKEY,(err,decoded)=>{
        if(err) return res.status(403).json({message:"Forbidden"})
        req.user=decoded.userInfo.id//to access any user from id 
        next();//go to next middleware
    })
}

module.exports=verifyJWT