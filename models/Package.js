const { Schema, model } = require('mongoose')


const packageSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type:String,
    required:true
  },
  price: {
    type:Number,
    required:true
  },
  teacherLimit: {
      type:Number,
      required:true
  }
});




const Package = model('package', packageSchema);


module.exports = Package;