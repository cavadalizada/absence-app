const {Router} = require('express');

const universityController = require('../controllers/universityController')

const isAdministrator = require("../middleware/isAdministrator")

// Is pro teahcer // is regular teacher
const hasUniversity = require("../middleware/hasUniversity")

const notHasUniversity = require ("../middleware/notHasUniversity");
const isAdministratorOrTeacher = require('../middleware/isAdministratorOrTeacher');


const app = Router();

app.post('/create',isAdministrator,notHasUniversity, universityController.create)

//random
app.post('/checkAttendance',isAdministratorOrTeacher,hasUniversity, universityController.checkAttendance)


app.post('/isPresent', universityController.isPresent)
app.get('/showAttendance',isAdministratorOrTeacher,hasUniversity, universityController.showAttendance)
app.post('/addSubject',isAdministratorOrTeacher,hasUniversity, universityController.addSubject)
app.post('/addLesson',isAdministratorOrTeacher,hasUniversity, universityController.addLesson)

app.post('/addStudent',isAdministratorOrTeacher,hasUniversity, universityController.addStudent)


app.get('/getStudents',isAdministratorOrTeacher,hasUniversity, universityController.getStudents)
app.get('/getTeachers',isAdministratorOrTeacher,hasUniversity, universityController.getTeachers)


app.get('/getTimetable',isAdministratorOrTeacher,hasUniversity, universityController.getTimetable)


module.exports = app;