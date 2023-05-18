const { generateNewTokens, deleteToken, signNewToken } = require("../models/auth");
const { checkUser, newUser, findUserByID, updateUser, verifyUserEmail, findFullUserByFilter } = require("../models/users");
const { sendVerificationMail } = require("../services/email/sendEmail");

const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

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
    const user = await newUser({email,password});
    if (!user) return res.status(500).send({message:"Server Error"})
    const {token,refreshToken}=generateNewTokens(user._id);
    return  res.status(200).send({token,refreshToken,user})
}
const verifyEmail= async (req,res)=>{
    try{
    const {token}=req.query;
    if (!token) throw 400
    const verifiedUser = await verifyUserEmail(token);
    if (!verifiedUser) throw 404
    return res.status(200).send(`Verification complete! Welcome, ${verifiedUser.email}`);
    }
    catch (err) {
        if (err===400) return res.status(400).send({message:"please send a valid verification token with your request"})//supposably a request using some programmable interface, like a react app or postman, sending a json
        if (err===404) return res.status(404).send("Link is not valid")//supposedly clickable link from email, sending plaintext
        console.log({err})
        res.sendStatus(500);
    }
}
const resendEmail=async (req,res)=>{
    try{
    const {email}=req.body;
    if (!email) throw 400
    const user = await findFullUserByFilter({email})
    if (!user) throw 404;
    const {verified,verificationToken}=user;
    if (verified && !verificationToken) throw 403
    if (!verificationToken) throw `TODO: ADD AN UNCONTROLLED EXCEPTION;`// this never should be happenning but in case of wrong scenarios we need to recreate a new verification token and update user, too much work for too rare of a case
    await sendVerificationMail({to:email,verificationToken});
    return res.status(200).send(`A message to ${email} has been sent. Please check your inbox.`);
    }
    catch (err) {
        if (err===400 || err===404) return res.status(err).send({message:"please send a valid email address"})
        if (err===403) return res.status(403).send({message:"The user is already verified"})
        console.log({err})
        return res.sendStatus(500);
    }
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

// const patchUserAvatar= async (req:Request,res:Response)=>{
const patchUserAvatar= async (req=new Request,res=new Response)=>{
    // req.userID,req.file;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${req.userID}_${originalname}`;
    
    const avatarsDirectory = path.join(__dirname, "../", "public", "avatars");
    const resultUpload = path.join(avatarsDirectory, filename);

    const rawAvatar = await Jimp.read(tempUpload);
    rawAvatar.resize(250, 250);
    await rawAvatar.writeAsync(tempUpload);

    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);

    const user=await updateUser(req.userID,{avatarURL})
    if (user) return res.sendStatus(200)
    return res.sendStatus(500)
}

module.exports={login,register,logout,getCurrentUser,patchUserSubscription,getNewToken,verifyEmail,resendEmail,patchUserAvatar}