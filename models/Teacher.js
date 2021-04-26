const { Schema, model } = require('mongoose')

const bcrypt = require(`bcrypt`)


const {sendLoginMail} = require('../mail/mail')

//    IDEALLY CREATE TWO MODELS ONE TEACHER MODEL ONE TEACHER USER
const teacherSchema = new Schema({
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
  department:{
    type: String,
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

// Registers an Teacher with given values
teacherSchema.statics.registerTeacher = async (username, email ,password,university,firstname,lastname,department) => {  

  var teacher = new Teacher;

  const salt = bcrypt.genSaltSync(10,'a')    

  //const verifyCode = Math.floor(Math.random() *(9999-1000) + 1000)


  //teacher.verifyCode = verifyCode

  sendLoginMail(email,university.name,"teacher",password);


  teacher.isVerified = true;
  teacher.username = username
  teacher.email = email
  teacher.password = bcrypt.hashSync(password,salt) 
  teacher.salt = salt
  teacher.university = teacher.university.concat( university._id )
  teacher.first_name = firstname
  teacher.last_name = lastname
  teacher.department = department

  await teacher.save();

  return 1
}

teacherSchema.statics.getTeachers = async (universityId) => {

  try{
  
    // find subjectId
    var data = await Teacher.find(
            {'university':universityId},["-_id","first_name","last_name","email","department"]
      )
             
  
  
      return data
  
  
    }catch(error){
  
      return 1
  
    }
    
  }


const Teacher = model('teacher', teacherSchema);


module.exports = Teacher;