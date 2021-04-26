const { Schema, model } = require('mongoose')


const AttendanceSchema = new Schema({
    lesson:[{
        type: Schema.Types.ObjectId,
        ref: 'lesson'
      }],
    students:[{
        type: Schema.Types.ObjectId,
        ref: 'student'
      }],
    present:{
        type: Boolean,
        default:false
    }
});

AttendanceSchema.methods.toJSON = function () {

  const Attendance = this
  const attendanceObject = Attendance.toObject()

  attendanceObject.students.forEach(function(student){ delete student._id})
  return attendanceObject

}

const Attendance = model('Attendance', AttendanceSchema);


module.exports = Attendance;