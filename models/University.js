const { Schema, model } = require('mongoose')



const universitySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }, 
  isVerified: {
      type: Boolean,
      required: true,
      default: false
  },package:{
    type: Schema.Types.ObjectId,
    ref: 'package'
  }
});



const University = model('university', universitySchema);






module.exports = University;