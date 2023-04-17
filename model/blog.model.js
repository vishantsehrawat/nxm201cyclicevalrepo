const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    heading:String,
    content:String,
    userId:String, // will be added when a particular user creates the blog
   
})

const BlogModel = mongoose.model("blog",blogSchema)

module.exports ={
    BlogModel
}