const mongoose = require("mongoose")
require('dotenv').config();
const connection = mongoose.connect(process.env.MONGO_URL)

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enu:["user","moderator"],default:"user"
    }
})

const UserModel = mongoose.model("user",userSchema)

module.exports ={
    connection,
    UserModel
}