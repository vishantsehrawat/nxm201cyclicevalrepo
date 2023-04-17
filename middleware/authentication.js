var jwt = require('jsonwebtoken');
const { UserModel } = require('../model/user.model');
const { BlacklistModel } = require('../model/blacklist.model');
require('dotenv').config();

const authMiddleware = async(req, res, next) => {
    const token = req.headers.authorization;
    // console.log("🚀 ~ file: au   thentication.js:8 ~ authMiddleware ~ token:", token)
    try {
        // checking if the token is present in blacklist or not
        const blackToken = await BlacklistModel.find({token:token});
        // console.log("🚀 ~ file: authentication.js:12 ~ authMiddleware ~ blackToken:", blackToken)
        if (blackToken.length>=1) {
            res.status(401).send({ msg: "User blacklisted " })
        }
        else {
            // decode the token 
            var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            // console.log("🚀 ~ file: authentication.js:18 ~ authMiddleware ~ decoded:", decoded)
            if (decoded) {
                req.body.userId = decoded.userId;
                const user = await UserModel.findOne({_id:decoded.userId})
                console.log("🚀 ~ file: authentication.js:23 ~ authMiddleware ~ user:", user)
                req.role = user.role;
                next();
            }
            else{
                res.status(401).send({msg:"authorization error"})
            }
        }

    } catch (error) {
        console.log(error)
        res.send(error.message);
    }
}

module.exports = {
    authMiddleware
}