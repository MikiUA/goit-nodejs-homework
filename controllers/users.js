const { generateNewTokens, deleteToken, signNewToken } = require("../models/auth");
const { checkUser, newUser, findUserByID, updateUser } = require("../models/users");

const login=async (req,res)=>{
    const {email,password} = req.body;
    if (!email || !password) return res.status(400).send({message:"missing required email or password fields"})
    const user=await checkUser({email,password});
    if (!user) return res.status(401).send({message:"incorrect email or password"});
    const {token,refreshToken}=generateNewTokens(user._id);
    return  res.status(200).send({token,refreshToken,user})
}

const register=async (req,res)=>{
    const {email,password} = req.body;
    if (!email || !password) return res.status(400).send({message:"missing required email or password fields"})
    const user_exists=await checkUser({email});
    if (user_exists) return res.status(409).send({message:"Email is already used"})
    const user = await newUser();
    const {token,refreshToken}=generateNewTokens(user._id);
    return  res.status(200).send({token,refreshToken,user})
}

const logout=async (req,res)=>{
    const authHeader=req.headers['authorization'];
    const authtoken=authHeader && authHeader.split(' ')[1];
    if (!authtoken||authtoken===undefined) {
        return res.status(400).send({message:"no logout refreshtoken provided"});
    }
    try {    
        const result=await deleteToken(authtoken)
        if (!result) throw {status:404, message:"no user found"}
        return res.status(204).send({message:"logout success"})
    }
    catch (err) {
        return res.status(err.status||500).send({message:err.message || "server error"})
    }
}

const getCurrentUser=(req,res)=>{
    findUserByID(req.userID).then(
        user=>res.status(200).send({user})
    ).catch(err=>res.status(500).send({message:err.message||"server error"}))
}

const patchUserSubscription=async (req,res)=>{
    const {subscription}=req.body;
    const subscriptionOptions=["starter","pro","business"];
    if (!subscription || !subscriptionOptions.includes(subscription)) return res.status(400).send({message:"invalid"});
    const updatedUser=await updateUser(req.userID,{subscription});
    if (!updatedUser) res.status(500).send("internal error");
    return res.status(200).send(updatedUser);
}

const getNewToken=async (req,res)=>{
    const authHeader=req.headers['authorization'];
    const authtoken=authHeader && authHeader.split(' ')[1];
    if (!authtoken||authtoken===undefined) {
        return res.status(401).send({message:"You must provide a valid token to gain access"})
    }
    try {
        const newToken=await signNewToken(authtoken);
        return res.status(200).send({token:newToken});
    }
    catch (err) {
        return res.status(err.status || 500).send({message:err.message||"server error"})
    }
    
}

module.exports={login,register,logout,getCurrentUser,patchUserSubscription,getNewToken}