const mongoose=require('mongoose')

const connectDatabase=()=>mongoose.connect(process.env.DATABASE_URL).then(()=>{
}).catch((err)=>{
    console.log(err.message)
})


module.exports=connectDatabase