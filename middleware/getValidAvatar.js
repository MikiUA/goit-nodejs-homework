
const multer = require('multer');
const upload = multer({dest:'public/avatars/'})

function getValidAvatar(req,res,next){
    try{
        upload.single('avatar')(req,res,function(){
            if (!req.file || !(req.file.mimetype.includes('image'))) throw 400
            next();
        })
    }
    catch (err) {
        if (err===400) res.status(400).send("please provide a valid image with the 'avatar' field")
        else {res.sendStatus(500)}
        //TODO delete file
    }
}

module.exports=getValidAvatar