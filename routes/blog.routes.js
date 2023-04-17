const express = require("express");
const { BlogModel } = require("../model/blog.model");
const {rbacAuth} = require("../middleware/rbacAuth.middleware")
const blogRouter = express();
blogRouter.use(express.json());

// add new blog 
blogRouter.post("/add",async(req,res)=>{
    const blog = req.body
    console.log(blog);
    try {
        
        const newBlog = BlogModel.insertMany(blog)
        await newBlog.save;
        res.status(200).send({msg:"new Blog added"})
    } catch (error) {
        console.log(error)
        res.status(400).send({msg:"error in adding blog"})
    }
})

// get all blogs  for the particular user only 
blogRouter.get("/allblogs",async(req,res)=>{
    const {userId} = req.body;
    // console.log("🚀 ~ file: blog.routes.js:25 ~ blogRouter.get ~ userId:", userId)
    
    try {
        
        const data = await BlogModel.find({userId:userId})
        res.status(200).send({msg:"all Blogs", data})
    } catch (error) {
        console.log(error)
        res.status(400).send({msg:"error in getting blogs"})
    }
})

// update a blog

blogRouter.patch("/update/:id",async(req,res)=>{
    const id = req.params.id
    const data = req.body;
    console.log(id);
    try {
        const myblog = await BlogModel.findByIdAndUpdate(id,data)
        res.status(200).send({msg:"blog updated"})
    } catch (error) {
        console.log(error)
        res.status(400).send({msg:"not able to update blog "})
    }
})

// delete a blog // for the user
// we can use any of the below routes to delete a user as both user and moderator have right to delete a blog 

blogRouter.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id);
    try {
        const myblog = await BlogModel.findByIdAndDelete(id)
        res.status(200).send({msg:"blog deleted"})
    } catch (error) {
        console.log(error)
        res.status(400).send({msg:"not able to delete blog "})
    }
})

// delete a blog route for the moderator
blogRouter.delete("/delete/:id",rbacAuth(["moderator"]),async(req,res)=>{
    const id = req.params.id
    console.log(id);
    try {
        const myblog = await BlogModel.findByIdAndDelete(id)
        res.status(200).send({msg:"blog deleted"})
    } catch (error) {
        console.log(error)
        res.status(400).send({msg:"not able to delete blog "})
    }
})

module.exports = {blogRouter}