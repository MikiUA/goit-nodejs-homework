const { User, Token } = require("./schemas")
const jwt = require("jsonwebtoken");

function createViewToken(_id){
    return jwt.sign({_id},process.env.TOKEN_SECRET,{expiresIn:process.env.TOKEN_EXPIERY_TIMER})
}

function createUpdateToken(_id){
   const token=jwt.sign({_id},process.env.TOKEN_SECRET_UPDATE)
   Token.create({token:token,userID:_id});
   return token
}

function signNewToken(userID){
    return createViewToken(userID)
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