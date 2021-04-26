const { Schema, model } = require('mongoose')

const Administrator = require('./Administrator')

const Teacher = require('./Teacher')

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'teacher'
  },
  university: {
    type: Schema.Types.ObjectId,
    ref: 'university'
  }
});

subjectSchema.statics.createCustom = async (user,university,name,teacher) => {

try{
  // if the requesting user is an Administrator
  if (user instanceof Administrator) {
    teacher = await Teacher.findOne(
      { $and: [{ username: teacher }, { university: university._id }] },
      "_id"
    );
    if (!teacher) {
      return 2;
    }
    
  Subject.create({name,university:university._id,teacher},(error,doc) => {

  })
  }
  //if the requesting user is a teahcer
  if (user instanceof Teacher) {
  
    Subject.create({name,university:university._id,teacher:req.user.id},() => {

    })
  
  }

  return 0
}
catch{
  return 1
}

}


const Subject = model('subject', subjectSchema);


module.exports = Subject;