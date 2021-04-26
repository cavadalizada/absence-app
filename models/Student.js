const { Schema, model } = require('mongoose')



const StudentSchema = new Schema({
  First_name: {
    type: String,
    required: true,
    trim: true
  },
  Last_name: {
    type: String,
    required: true,
    trim: true
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
  faculty:{
    type: String,
    required: true
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
  admission_year:{
    type: Number,
    required: true
  },
  subjects:[{
      type: Schema.Types.ObjectId,
      ref: 'subject'
    }],  
    university:[{
      type: Schema.Types.ObjectId,
      ref: 'university'
    }],
  check:{           //used for the extension
    type: Boolean,
    default: false
  }
});


StudentSchema.statics.getStudents = async (universityId) => {

  try{
  
    // find subjectId
    const data = await Student.find(
            {'university':universityId},["-_id","First_name","Last_name","email","admission_year","faculty"]
      )
                
  
  
      return data
  
  
    }catch(error){
  
      return 1
  
    }
    
  }
  
  
  
const Student = model('student', StudentSchema);


module.exports = Student;