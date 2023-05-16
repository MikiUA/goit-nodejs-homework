const jwt = require("jsonwebtoken");

function _401(res){
    return res.status(401).send({message:"You must provide a valid token to access"})
}

function authentificateUser(req,res,next){
    const authHeader=req.headers['authorization'];
    const authtoken=authHeader && authHeader.split(' ')[1];
    if (!authtoken||authtoken===undefined) {
        return _401(res);
    }

    jwt.verify(authtoken,ACCESS_TOKEN_VIEW,(err,authorisedUser)=>{
        if (err) return _401(res)
        req.userID=authorisedUser._id;
        next()
    })
}

module.exports={authentificateUser}