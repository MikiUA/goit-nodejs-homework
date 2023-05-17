const nodemailer= require ('nodemailer');
const { User } = require('../schemas');
const getCurrentHost = require('../../helperFunctions/getCurrentHost');

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

  const link=`${getCurrentHost()}/users/verifyEmail?token=${verificationToken}`;
  const email={
    to, // list of receivers
    subject: "Verification Email", // Subject line
    text: `Please use this link to verify your email address: ${link}`, // plain text body
    html: `<a href='${link}'> Please click on this message to verify your email address, or use the following link: ${link}</a>`, // html body
  }
	return sendMail(email);
}

module.exports={sendMail,sendVerificationMail};
