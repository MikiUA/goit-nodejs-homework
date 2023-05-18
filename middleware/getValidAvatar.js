
const multer = require('multer');
const upload = multer({dest:'public/avatars/'})

function getValidAvatar(req,res,next){
    try{
        upload.single('avatar')(req,res,function(){
            console.log(req.file); 
            if (!req.file || !(req.file.mimetype.includes('image'))) throw 400
            next();
        })
    }
    catch (err) {
        if (err===400) res.status(400).send("please provide a valid image with the 'avatar' field")
        else { console.log({err}), res.sendStatus(500)}
        // delete file
    }
}

module.exports=getValidAvatar