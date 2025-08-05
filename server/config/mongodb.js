const mongoose = require("mongoose")

const connectDB = async () =>{

    mongoose.connection.on("connected" , ()=>{
        console.log("Database Connected")
    })

    mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`)
}

module.exports = connectDB