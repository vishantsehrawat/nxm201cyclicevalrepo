const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const { BlacklistModel } = require("../model/blacklist.model");

const userRouter = express();
userRouter.use(express.json());

// register route 


userRouter.post("/register", async (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 4);
    user.password = hash;
    console.log(user)
    try {
        const newUser = UserModel.insertMany(user)
        await newUser.save;
        res.status(200).send({ msg: "new user registered" })
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
})

userRouter.post("/login", async (req, res) => {
    const user = req.body;
    console.log(user);
    try {
        const myUser = await UserModel.findOne({ email: user.email })
        console.log("🚀 ~ file: user.routes.js:34 ~ userRouter.post ~ myUser:", myUser)
        try {

            if (myUser) {
                bcrypt.compare(user.password, myUser.password, function (err, result) {
                    // temporarily using expire time *60 for usability. Ignore it if I forgot to remove the extra 60
                var token = jwt.sign({ userId: myUser._id }, process.env.TOKEN_SECRET, { expiresIn: "60s"});
                    var refreshToken = jwt.sign({ userId: myUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "180s" });
                    res.status(200).send({ msg: "User logged in", token, refreshToken })
                });
            }
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message)
        }
    } catch (error) {
        console.log(error)
    }
})


// logout route 
// here we will add the token into blacklist collection
userRouter.post("/logout", async (req, res) => {
    const token = req.headers.authorization;
    try {
        const newblacktoken = BlacklistModel.insertMany({ token: token })
        await newblacktoken.save;
        res.status(200).send({ msg: "logout successfull" })

    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "No able to logout" })
    }
})


// route to get new token using refresh token 
// we will hit this route from the frontend 
userRouter.get("/newtoken", (req, res) => {
    const refreshToken = req.headers.authorization;
    console.log("🚀 ~ file: user.routes.js:74 ~ userRouter.get ~ refreshToken:", refreshToken)
    
    try {
        var decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if(decoded){
            var token = jwt.sign({ userId: decoded.userId }, process.env.TOKEN_SECRET, { expiresIn: 60 });
            res.send({msg:"New token generated ",token})
        }
        
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})
module.exports = { userRouter }