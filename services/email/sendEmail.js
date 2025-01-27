const nodemailer= require ('nodemailer');
const { User } = require('../../models/schemas');
const getCurrentHost = require('../../helperFunctions/getCurrentHost');
const { verificationMail } = require('./emailVariants');

async function sendMail({to,subject,text,html}){
    try {
        const email={
          from: `"Contactbook application" <${process.env.META_USERNAME}>`, // sender address
          to, // list of receivers
          subject, // Subject line
          text, // plain text body
          html
        }

        var transport = nodemailer.createTransport({
            host: "smtp.meta.ua",
            port: 25,//465,
            // secure:true,
            auth: {
              user: process.env.META_USERNAME,
              pass: process.env.META_PASSWORD,
            }
          });

        transport.sendMail(email).then(
          response=> {
            console.log({response});
            return response
          }
        ).catch(
          err=> {
            console.log(err);
            return null
          }
        )
    }
    catch (err)
    {
      console.log({err})
      return err
    }
}

async function sendVerificationMail({to,verificationToken}){

	return sendMail(verificationMail({to,verificationToken}));
}

module.exports={sendMail,sendVerificationMail};
