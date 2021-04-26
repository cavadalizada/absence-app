const { Schema, model } = require('mongoose')


const Subject = require("../models/Subject")



const lessonSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  subject:{
    type: Schema.Types.ObjectId,
    ref: 'subject'
}
});



// takes in date and university id
//  returns all the lessons during this date
lessonSchema.statics.findLessonsByDay = async (day,university) => {

  try{
  
    // find subjectId
    const subjects = await Subject.find(
        {'university':university._id}
      ,"_id")
    startDate = day + " 00:00"
    endDate = day + " 23:59"
      //get all lessons
      const lessons = await Lesson.find({
         date: {$gte: startDate, 
          $lt: endDate},
        },["-_id","date","subject"]).lean(); 
      // create an array with subject ids
        for(i=0;i<subjects.length;i++){
        subjects[i]=JSON.stringify((subjects[i]._id))
      }
      
      
      
      // remove lessons with subjects not in list
      for(i=0;i<lessons.length;i++){
      
        if(!subjects.includes(JSON.stringify(lessons[i].subject))){
      
        lessons.splice(i,1)
        }
      
      }


      for(i = 0;i<lessons.length;i++){
        subject_name = await Subject.findById({"_id":lessons[i].subject},["-_id","name"])
        lessons[i].subject = subject_name.name
        lessons[i].university = university.name
        lessons[i].date = new Date(lessons[i].date).toLocaleTimeString('az-AZ',{ hour12: false, timeStyle: 'short'})
      }
      return lessons
  
  
    }catch(error){
  
      return 1
  
    }
    
  }

// takes in subject name and date and universityId
//  returns the lessonId
lessonSchema.statics.findLessonBySubjectAndDate = async (subject,date,universityId) => {

try{

  // find subjectId
  const subjectId = (await Subject.findOne(
      {'$and': [
      {'university':universityId},
      {'name':subject}
      ]}
    ))._id
    console.log(subjectId)
  // find lessonId
    const lessonId = await Lesson.findOne({
      '$and': [{
      date: date
      },{
      subject: subjectId
      }
  ]
    },"_id")                                 
    console.log(lessonId)
    console.log(date)

    return lessonId


  }catch(error){

    return 1

  }
  
}





const Lesson = model('lesson', lessonSchema);


module.exports = Lesson;