// THIS MODEL IS DEPRECATED

// const { Schema, model } = require('mongoose')



// const requestSchema = new Schema({
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   type:{                    // used to categorize request e.g type 1 teacher -> administrator type 2 student -> administrator
//       type: Number,         
//       required: true
//   },
//   teacher:{
//     type: Schema.Types.ObjectId,
//     ref: 'teacher'
// },
//     university:{
//         type: Schema.Types.ObjectId,
//         ref: 'university'
//     }
// });

// requestSchema.index({ teacher: 1, university: 1}, { unique: true });

// const Request = model('request', requestSchema);


// module.exports = Request;