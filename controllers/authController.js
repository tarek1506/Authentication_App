const jwt = require("jsonwebtoken")
const User = require("../models/user")
const bcrypt=require('bcrypt')


const register=async(req,res)=>{
 const {first_name,last_name,email,password}=req.body
 if(!first_name ||!last_name||!email||!password){
    return res.status(400).json({message:"All fields are required"})
 }
 const foundUser=await User.findOne({email:email}).exec()
 if(foundUser){
    return res.status(401).json({message:"user already exists login instead"})
 }
 const hashedPassword=await bcrypt.hash(password,10);
 const newUser=new User({
    first_name,
    last_name,
    email,
    password:hashedPassword
 })

 await newUser.save()

 //generate Access Token
 const accessToken=jwt.sign({userInfo:{
    id:newUser._id
 }},process.env.ACCESS_TOKEN_SECRETKEY,{expiresIn:"15m"})

//generate refresh Token
 const refreshToken=jwt.sign({userInfo:{
    id:newUser._id
 }},process.env.REFRESH_TOKEN_SECRETKEY,{expiresIn:"7d"})


res.cookie("jwt",refreshToken,{
    httpOnly:true,//accessible only by web server
    secure:true,//https
    sameSite:"None",//all domains in site will have the cookie
    maxAge:7*24*60*60*1000
})

res.json({accessToken,newUser})

}


const login=async(req,res)=>{
    const {email,password}=req.body
 if(!email||!password){
    return res.status(400).json({message:"All fields are required"})
 }
 const foundUser=await User.findOne({email:email}).exec()
 if(foundUser){
    const matchedPassword=await bcrypt.compare(password,foundUser.password)
    if(matchedPassword){
        
         //generate Access Token
        const accessToken=jwt.sign({userInfo:{
            id:foundUser._id
        }},process.env.ACCESS_TOKEN_SECRETKEY,{expiresIn:"1m"})

        //generate refresh Token
        const refreshToken=jwt.sign({userInfo:{
            id:foundUser._id
        }},process.env.REFRESH_TOKEN_SECRETKEY,{expiresIn:"7d"})


        res.cookie("jwt",refreshToken,{
            httpOnly:true,//accessible only by web server
            secure:true,//https
            sameSite:"None",//all domains in site will have the cookie
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({message:"login successfully",accessToken})
    }else{
        return res.status(400).json({message:"password or email incorrect"})
    }
 }else{
     res.status(400).json({message:"user not found register now"})
 }



}

const refresh=(req,res,next)=>{
   const cookies=req.cookies
   if(!cookies?.jwt){
      res.status(401).json({message:"Unauthorized"})
   }
   jwt.verify(cookies.jwt,process.env.REFRESH_TOKEN_SECRETKEY,async(err,decoded)=>{
      if(err) return res.status(403).json({message:"Forbidden"})
         const foundUser=await User.findById(decoded.userInfo.id).exec()
      if(!foundUser) return res.status(401).json({message:"Unauthorized"})
      const accessToken=jwt.sign({userInfo:{
         id:foundUser._id
     }},process.env.ACCESS_TOKEN_SECRETKEY,{expiresIn:"1m"}) 
    res.json({accessToken})
     //next();//go to next middleware
   })
}

const logout=(req,res)=>{
   const cookies=req.cookies;
   if(!cookies?.jwt) return res.sendStatus(204);//No content
   res.clearCookie('jwt',{
      httpOnly:true,
      sameSite:"None",
      secure:true
   })
   res.status(200).json({message:"logout"})
}


module.exports={register,login,refresh,logout}