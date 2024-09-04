require('dotenv').config()

const express=require('express')
const app=express();
const cors=require('cors')
const cookieParser=require('cookie-parser')
const PORT=process.env.PORT || 4000
const mongoose=require('mongoose')
const path=require('path')
const connectDatabase=require('./config/dbConnect');
const corsOptions = require('./config/corsOptions');
const verifyJWT=require('./middleware/verifyJWT')

//connect to database
connectDatabase()

//To check which url will be accessd from frontend
app.use(cors(corsOptions));

//To allow to accept cookies when send it in the header of request
app.use(cookieParser())

//To accept json from body 
app.use(express.json())

//routes middleware
app.use('/',require('./Routes/root'))
app.use('/auth',require('./Routes/authRoutes'))
app.use('/users',verifyJWT,require('./Routes/userRoutes'))




//middleware to read static file like css files
//we use path package to access any  files
app.use("/",express.static(path.join(__dirname,"public")))


//middleware to handle not found routes
app.use("*",(req,res)=>{
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,".","views","404.html"))
    }else if(req.accepts('json')){
        res.json({message:"error 404"})
    }else{
        res.type('txt').send("404 not found")
    }
})

//(first time) Once you open a connection to the database do the following'=
mongoose.connection.once('open',()=>{
    console.log(`Connected to database successfully`)
    app.listen(PORT,()=>{
        console.log(`server running on port ${PORT}`)
    }) 
})

//handle if connection failed
mongoose.connection.on('error',(err)=>{
    console.log(err)
})
 
