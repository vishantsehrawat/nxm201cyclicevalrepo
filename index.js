const express = require("express");
const { connection } = require("./model/user.model");
const {userRouter} = require("./routes/user.routes");
const { blogRouter } = require("./routes/blog.routes");
const { authMiddleware } = require("./middleware/authentication");
const app = express();
app.use(express.json());

app.get("/",()=>{
    res.send({msg:"homeroute"})
})

app.use("/user",userRouter)
app.use(authMiddleware);
app.use("/blog",blogRouter)

app.listen(8080,async()=>{
     
    try {
        await connection;
        console.log("Port started at 8080")
        console.log("connected to db")
        
    } catch (error) {
        console.log(error)
    }
})