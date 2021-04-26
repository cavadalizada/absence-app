const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require(`bcrypt`)

const Student = require("../models/Student");

const Subject = require("../models/Subject");

const Attendance = require("../models/Attendance");
const Lesson = require("../models/Lesson");
const University = require("../models/University");

const Teacher = require("../models/Teacher");
const Administrator = require("../models/Administrator");

const { sendNotification,sendLoginMail } = require("../mail/mail");
 
// POST /university/create

// requires jwt token of verified Administrator who does not have a university     //administrator object stored at req.user
// takes in name / domain
// creates an unverified university
// should return random values to enter to DNS             TO DO

exports.create = async (req, res) => {
  // need to add a case where university exists but is not verified

  try {
    name = req.body.name;
    domain = req.body.domain;

    if (!name || !domain) {
      return res.status(401).json({ msg: "fill all fields" });
    }
    const test = await University.findOne({ name, domain });
    if (test) {
      return res.status(401).json("university exists");
    }
    University.create({ name, domain }, async (error, doc) => {
      if (error) {
        console.log(error);
      }

      req.user.university = doc.id;
      await req.user.save();
    });

    return res.status(200).json({ msg: "success. Verify the domain" }); // ADD  dns verification
  } catch (error) {
    return res.status(401).json("something went wrong");
  }
};

// POST /university/checkAttendance

// requires jwt token of verified administrator or teacher who has a university  //administrator/teacher object stored at req.user //university stored and req.university

// takes in a subject and a date finds the corresponding lesson belonging the the users university
// finds attendances of all the students using the lesson id
// sets check value of all students to 1 using forEach

exports.checkAttendance = async (req, res) => {
  try {
    const subject = req.body.subject;
    const date = req.body.date;

    if ((!subject, !date)) {
      return res.status(401).json("fill all fields");
    }

    const university = req.university;

    const lessonId = await Lesson.findLessonBySubjectAndDate(
      subject,
      date,
      university._id
    );
    if (!lessonId) {
      return res.status(401).json("lesson not found");
    }

    const students = await Attendance.find(
      {
        lesson: lessonId,
      },
      "students"
    );
      console.log(students)
    students.forEach(async (student) => {
      // set student.check to true
      console.log(student.students.toString())

      var test = await Student.findById(student.students.toString());
      console.log(test)
      test.check = true;
      await test.save();

      // reset student.check after 10 secs
      setTimeout(async () => {
        var test = await Student.findById(student.students.toString());
        test.check = false;
        test.save();
      }, 10000);
    });

    return res.status(200).json({ msg: "checking Attendance" });
  } catch {
    return res.status(401).json("something went wrong");
  }
};

// POST university/isPresent

// no middleware but requires jwt token in body

// default behavior
// used by the extension
// takes in jwt token containing student id
// finds the corresponding student's enrolled subjects
// finds the lesson that is taking place right now and belongs to the enrolled subjects
// finds the attendance with the lesson id and student id and sets it to present
// sets the student.check variable to false

// opt 2
// can also take subject name (req.body.subject)
// and find the lesson directly

exports.isPresent = async (req, res) => {
  const token = req.body.jwt;
  const subject = req.body.subject;
  console.log(subject)
  if (!token) {
    return res.status(400).json("fill all fields");
  }
  // if subject not provided

  try {
    const decodedToken = jwt.verify(token, config.get("JWTtoken"));

    const studentId = (await Student.findOne({ _id: decodedToken.id }))
      ._id;
    if (studentId == null) {
      return res.status(400).json("student not found");
    }

    var student = await Student.findById(studentId);

    student.check = false;

    await student.save();
    var lessonId;

    if (!subject) {
      // if subject not provided

      const student = await Student.findById(studentId);
      // MODEL a lot of potential
      // var lessonId = await Lesson.find(
      //   {
      //     $and: [
      //       {
      //         date: {
      //           $gte: Date.now() - 5400000,   // any lesson happening now or between before 90 minutes
      //           $lte: Date.now()
      //         },
      //       },
      //       {
      //         subject: student.subjects,
      //       },
      //     ],
      //   },
      //   "_id"
      // );

      var lessonId = await Lesson.findById(
        {"_id":"6059054faf05e4004aea3853"
        },
        "_id"
      );


    } else {
      // if subject provided
      const subjectId = await Subject.findOne(
        {
          name: subject,
        },
        "id"
      );
      lessonId = await Lesson.findOne(
        {
          date: {
            $gte: Date.now() - 5400000,
            $lte: Date.now(),
          },
          subject: subjectId,
        },
        "_id"
      );
    }
    if (!lessonId) {
      res.status(400).json("no lesson found for student");
    }
    console.log(studentId)
    console.log(lessonId)
    var attendance = await Attendance.findOne({
      $and: [{ lesson: lessonId }, { students: studentId }],
    });
    console.log(attendance)
    attendance.present = true;

    await attendance.save();

    return res.status(200).json("success");
  } catch (error) {
    console.log(error);
    console.log("foo")
    return res.status(401).json("token invalid");
  }
};

// GET university/showAttendance

// requires jwt token of verified administrator or teacher who has a university  //administrator/teacher object stored at req.user //university stored and req.university

// takes in date and subject name
// finds the corresponding lesson id
// finds all attendances and returns first name last name and present

exports.showAttendance = async (req, res) => {
  const date = req.query.date;
  const subject = req.query.subject;
  const student = req.query.student;
  const university = req.university._id;
  
    try {
      if(date && subject){
      const lessonId = await Lesson.findLessonBySubjectAndDate(
        subject,
        date,
        university
      );
      console.log(lessonId)
      const data = await Attendance.find(
        {
          lesson: lessonId,
        },
        { present: 1, students: 1, _id: 0 }
      ).populate("students", ["First_name","Last_name","faculty","admission_year"]);

      return res.status(200).json(data);
      
    }else if(student){

      console.log(student)
      const studentId = await Student.findOne({
        $and: [{ university: university._id }, { email: student }],
      },"_id")
      console.log(studentId)

      const data = await Attendance.find(
        {
          students: studentId,
        },
        ["present","lesson","students","-_id"]
      ).populate("students", ["First_name","Last_name","faculty","admission_year"]).populate("lesson",["subject","date"])
      .lean()
      
      for(i = 0;i<data.length;i++){
        subject_name = await Subject.findById({"_id":data[i].lesson[0].subject},["-_id","name"])
        data[i].lesson[0].subject = subject_name.name
        data[i].lesson[0].date = new Date(data[i].lesson[0].date).toLocaleString()
        delete data[i].lesson[0]._id
        delete data[i].students[0]._id
        delete data[i].date
      }

      console.log(data)
      return res.status(200).json(data);
    

      }

    } catch (error) {
    console.log(error);
    return res.status(400).json("something went wrong");
  }
};

// POST university/addSubject

// requires jwt token of verified administrator or teacher who has a university  //administrator/teacher object stored at req.user //university stored and req.university

//If user is an Administrator
// takes in subject name and teacher username (currently set to teacher email)
// creates a subject with the fields

// If user is teacher
// takes in a subject name
// creates a subject for the teacher

exports.addSubject = async (req, res) => {
  const name = req.body.name;
  const university = req.university;
  var teacher;

  if (!name) {
    return res.status(400).json("Fill all fields");
  }
  if (req.user instanceof Administrator) {
    teacher = req.body.teacher;
    if (!teacher) {
      return res.status(401).json("please specify a teacher");
    }
  }

  const n = await Subject.createCustom(req.user, university, name, teacher);
  if (n == 2) {
    return res.status(401).json("teacher is not added to your university");
  }
  if (n == 1) {
    return res.status(401).json("something went wrong");
  }

  return res.status(200).json("Success");
};

// POST university/addLesson

// requires jwt token of verified administrator or teacher who has a university  //administrator/teacher object stored at req.user //university stored and req.university

// takes in a date and a subject name
// creates a corresponding lesson
// then takes the lesson id and the students enrolled to the subject
// then initializes attendances

exports.addLesson = async (req, res) => {
  const date = req.body.date;
  const subject = req.body.subject;

  const university = req.university;

  if (!date || !subject) {
    return res.status(400).json("please fill all fields");
  }

  try {
    const subjectId = (
      await Subject.findOne({
        $and: [{ university: university._id }, { name: subject }],
      })
    )._id;

    var lesson = new Lesson();

    lesson.date = date;
    lesson.subject = subjectId;

    const lessonId = lesson._id;

    await lesson.save();

    // create an attendance for the lesson

    var students = await Student.find({ subjects: subjectId }, "_id");

    console.log(subjectId);

    var i = 0;
    while (students[i]) {
      var attendance = new Attendance();

      attendance.lesson = lessonId;

      attendance.students = students[i];

      await attendance.save();
      i++;
    }

    return res.status(200).json("success");
  } catch {
    return res.status(400).json("subject not found");
  }
};

// POST university/addStudent

// requires jwt token of verified administrator or teacher who has a university  //administrator/teacher object stored at req.user //university stored and req.university

// takes in first name, last name, enrolledLessons[] (enrolledSubjects would be a better name)
// finds subjects belonging the the university
// creates a student using the data

exports.addStudent = async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const faculty = req.body.faculty;
  const admission_year = req.body.admission_year;
  const email = req.body.email;
  const enrolledLessons = req.body.enrolledLessons;
  const university = req.university;
  const password = Math.random().toString(36).substr(2);
  const salt = bcrypt.genSaltSync(10,'a')    

  if ((!firstname, !lastname, !enrolledLessons)) {
    return res.status(400).json("Fill all fields");
  }

  var student = new Student();
  student.First_name = firstname;
  student.Last_name = lastname;
  student.faculty = faculty;
  student.admission_year = admission_year
  student.email = email;
  student.password = bcrypt.hashSync(password,salt) 
  student.salt = salt
  student.university = university._id

  const subjects = await Subject.find({
    $and: [{ name: enrolledLessons }, { university: university._id }],
  });
  if (subjects === undefined || subjects.length == 0) {
    return res.status(401).json("subject not found");
  }

  student.subjects = subjects;

  await student.save();

  sendNotification(
    email,
    university.name,
    "student",
    "You were added to a new university !"
  );

  sendLoginMail(email,university.name,"student",password);


  return res.status(200).json("Success");
};

exports.getTimetable = async (req, res) => {
  const day = req.query.day;
  const university = req.university;
  const week = req.query.week;
  
  if(day && !week){
  const data = await Lesson.findLessonsByDay(day, university);
  return res.status(200).json(data);
}
if(!day && week){

  console.log(week)
  var dt = new Date();
  if(week==0){
  while (dt.getDay() != 1) {
    dt.setDate(dt.getDate() - 1);
  }
  }
  if(week>0){
    for(var i=0;i<week;i++){
      dt.setDate(dt.getDate() + 1);
      while (dt.getDay() != 1) {
        dt.setDate(dt.getDate() + 1);
      } 
    }
  }
  if(week<0){
    console.log(week)
    for(var i=0;i<(week*-1)+1;i++){
      dt.setDate(dt.getDate() - 1);

      while (dt.getDay() != 1) {
        dt.setDate(dt.getDate() - 1);
      }
    }
  }
  
  var data = new Object
  
  for(var i=0;i<7;i++){
    test = await Lesson.findLessonsByDay(dt.toLocaleDateString(), university)
    data[i] = {"date":dt.toLocaleDateString(),
    "lessons":test}
    dt.setDate(dt.getDate() + 1);
  }
  
  return res.status(200).json(data);


}
};

exports.getStudents = async (req, res) => {

  const university = req.university._id;

  const data = await Student.getStudents(university)

  return res.status(200).json(data);
};


exports.getTeachers = async (req, res) => {

  const university = req.university._id;

  const data = await Teacher.getTeachers(university)

  return res.status(200).json(data);
};
