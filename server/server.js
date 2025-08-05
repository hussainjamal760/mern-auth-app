const express = require('express')
const app = express()
const cors = require("cors")
require("dotenv/config")
const cookieParser = require("cookie-parser")
const connectDB = require('./config/mongodb')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')

const port = process.env.PORT || 4000
connectDB()

const allowedOrigins = ['http://localhost:5174']

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({origin :allowedOrigins , credentials : true}))

app.get('/' , (req , res)=>{
    res.send("Api Working")
}) 

app.use('/api/auth' ,authRouter )
app.use('/api/user' ,userRouter )

app.listen(port , ()=>{
    console.log(`Server started at port ${port}`)
})