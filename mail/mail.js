const config = require('config')
const nodemailer = require('nodemailer');



const sendVerificationMail = async (target,verifyCode,username,type) =>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uscvotingplatform@gmail.com',
      pass: config.get("GOOGLE_API_KEY")
    }
  });
  URL = "http://www.foo.com:3005/auth/"+ type +"/verify/?username="+username+"&verifyCode="+verifyCode

  const mailOptions = {
    from: 'uscvotingplatform@gmail.com',
    to: target,
    subject: 'Please confirm account',
    html: ` Click the following link to confirm your account:</p><p>${URL}</p>`,
    text: ` Please confirm your account by clicking the following link: ${URL}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}



const sendLoginMail = async (target,universityName,type,password) =>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uscvotingplatform@gmail.com',
      pass: config.get("GOOGLE_API_KEY")
    }
  });
  URL = "http://www.foo.com:3005/auth/"+ type +"/login?email="+target    // encrypt this email

  const mailOptions = {
    from: 'uscvotingplatform@gmail.com',
    to: target,
    subject: `${universityName} - Login to Qayib-App`,
    html: ` Click the following link to login :</p><p>${URL}</p> <b>Here is your password : <i>${password}</i< <b>`,
    text: ` Click the following link to login: ${URL}.   `
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}


const sendNotification = async (target,universityName, type,msg) =>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uscvotingplatform@gmail.com',
      pass: config.get("GOOGLE_API_KEY")
    }
  });
  
  URL = "http://www.foo.com:3005/auth/"+ type +"/login?email="+target    // encrypt this email
  



  const mailOptions = {
    from: 'uscvotingplatform@gmail.com',
    to: target,
    subject: `${universityName} - ${msg} - Qayib-App`,
    html: ` Hello !</p> ${msg} </p> Click the following link to login :</p><p>${URL}`,
    text: ` ${msg}. `
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}


module.exports = {sendVerificationMail, sendLoginMail,sendNotification}