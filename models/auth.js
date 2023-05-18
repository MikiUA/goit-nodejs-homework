const { Token } = require("./schemas")
const jwt = require("jsonwebtoken");

function createViewToken(_id){
    return jwt.sign({_id},process.env.TOKEN_SECRET,{expiresIn:process.env.TOKEN_EXPIERY_TIMER})
}

function createUpdateToken(_id){
   const token=jwt.sign({"message for hackers":"hack me or die trying"},process.env.TOKEN_SECRET_UPDATE)
   Token.create({token:token,userID:_id});
   return token
}

function signNewToken(refreshToken){
    return new Promise(async (resolve,reject)=>{//yes it is a promise that resolves to a promise, it is just saving development time by not taking care of additional error boundaries
        jwt.verify(refreshToken,process.env.TOKEN_SECRET_UPDATE,(err,user)=>{
            if (err) reject({status:400,message:"You must provide a valid token to gain access"});
        })
        const {userID} = await Token.findOne({token:refreshToken})

        if (!userID) reject({status:400,message:"You must provide a valid token to gain access"});
        resolve(createViewToken(userID));
    })
}

function generateNewTokens(userID){
    const token=createViewToken(userID);
    const refreshToken=createUpdateToken(userID);//createUpdateToken(newuser._id);
    return {
        token:token,
        refreshToken:refreshToken
    }
}

function deleteToken(token){
    return Token.findOneAndDelete({token:token});
}

module.exports={signNewToken,generateNewTokens,deleteToken}