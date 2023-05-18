const { nanoid } = require("nanoid");
const { sendVerificationMail } = require("../services/email/sendEmail");

const { User } = require("./schemas");
const gravatar = require("gravatar");

function findUserByEmail(email){
    return User.findOne({email:email},["email","subscription","_id"])
}

async function checkUser({email,password}){
    if (!email) return false;
    let user=await findUserByEmail(email);
    // console.log(user); return false
    if (!user) return false
    if (!password) return true;
    if (user.password===password) return user
    return false
}

async function newUser({email,password}){
    try {
        const verificationToken=nanoid();
        const avatarURL = gravatar.url(email);
        console.log(avatarURL)
        const {subscription,_id} = await User.create({email,password,verificationToken,avatarURL});
        // await sendVerificationMail({to:email,verificationToken});
        sendVerificationMail({to:email,verificationToken});
        return {email,subscription,_id} 
    }
    catch (err){
        return {}
    }
}

function findUserByID(_id){
    return User.findOne({_id:_id},["email","subscription","_id"])
}

async function updateUser(_id,body){
    const updatedUser= await User.findByIdAndUpdate({_id},body,{new:true});
    if (!updatedUser) return null
    const {email,subscription} = updatedUser
    return {email,subscription,_id}
}

async function verifyUserEmail(token){
    const verifiedUser=await User.findOneAndUpdate({verificationToken:token},{verified:true,verificationToken:null},{new:true});
    if (!verifiedUser) return null
    const {email,subscription,_id} = verifiedUser;
    return {email,subscription,_id}
}

async function findFullUserByFilter(filter={}){
    return User.findOne(filter,['-password']);
}

module.exports={checkUser,newUser,findUserByID,updateUser,verifyUserEmail,findFullUserByFilter}