const verificationMail=({to,verificationToken})=>{

    const link=`${getCurrentHost()}/users/verifyEmail?token=${verificationToken}`;
    const email={
      to, // list of receivers
      subject: "Verification Email", // Subject line
      text: `Please use this link to verify your email address: ${link}`, // plain text body
      html: `<a href='${link}'> Please click on this message to verify your email address, or use the following link: ${link}</a>`, // html body
    }
      return email;
  }

  module.exports={verificationMail}