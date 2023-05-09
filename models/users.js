const { User } = require("./schemas")

function findUserByEmail(email){
    return User.findOne({email:email},["email","subscription","_id"])
}


async function checkUser({email,password}){
    if (!email) return false;
    let user=await findUserByEmail(email);
    console.log(user); return false
    if (!user) return false
    if (!password) return true;
    if (user.password===password) return user
    return false
}

async function newUser({email,password}){
    const {email,subscription,_id} = await User.create({email,password});
    return {email,subscription,_id}
}

function findUserByID(_id){
    return User.findOne({_id:_id},["email","subscription","_id"])
}



module.exports={checkUser,newUser,findUserByID}