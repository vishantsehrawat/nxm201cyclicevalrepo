
const rbacAuth = (givenParameters) => {

    return (req, res, next) => {
        const role = req.role;
        console.log("🚀 ~ file: rbacAuth.middleware.js:6 ~ return ~ role:", role)
        if (givenParameters.includes(role)) {
            next();
        }
        else{
            res.status(401).send({msg:"unauthorized"})
        }
    }
}

module.exports = {
    rbacAuth
}