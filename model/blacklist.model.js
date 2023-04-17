const mongoose = require("mongoose")

const blacklistSchema = mongoose.Schema({
    token:String,
   
})

const BlacklistModel = mongoose.model("balcklist",blacklistSchema)

module.exports ={
    BlacklistModel
}