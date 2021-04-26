const { Schema, model } = require('mongoose')

const bcrypt = require(`bcrypt`)


const {sendVerificationMail} = require('../mail/mail')


const administratorSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  first_name:{
    type: String,
    required: true
  },
  last_name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required : true,
    unique: true,
    trim: true,
    validate(value) {
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if(!emailRegexp.test(value)){
          throw new Error('Email invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  salt: {
    type: String,
    required: true
  },
  tokenList:[{
    token:{
      type: String,
      required: true
    }
  }],
  isVerified:{
    type: Boolean,
    required: true,
    default: false
  },
  verifyCode:{
    type: Number,
  },
  university:[{
    type: Schema.Types.ObjectId,
    ref: 'university'
  }],
  register_date: {
    type: Date,
    default: Date.now
  }
});

// Registers an administrator with given values
administratorSchema.statics.registerAdministrator = async (username, email ,password,firstname,lastname) => {  

  var administrator = new Administrator;

  const salt = bcrypt.genSaltSync(10,'a')    

  const verifyCode = Math.floor(Math.random() *(9999-1000) + 1000)


  administrator.verifyCode = verifyCode

  sendVerificationMail(email,verifyCode,username,"administrator");

  administrator.isVerified = false;
  administrator.username = username
  administrator.email = email
  administrator.password = bcrypt.hashSync(password,salt) 
  administrator.salt = salt
  administrator.last_name = lastname
  administrator.first_name = firstname

  await administrator.save();

  return administrator
}


const Administrator = model('administrator', administratorSchema);


module.exports = Administrator;