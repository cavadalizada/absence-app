const {Router} = require('express');

const teacherController = require('../../controllers/teacherController');
const isTeacher = require("../../middleware/isTeacher")

const app = Router();


app.post('/login', teacherController.loginTeacher)

app.get('/me',isTeacher,teacherController.getInfo)


app.get('/logout', isTeacher, teacherController.logoutTeacher)


// deprecated routes

// app.post('/register', teacherController.registerTeacher)

//app.get('/verify', teacherController.verifyEmail)

//app.post('/addUniversity',isTeacher, teacherController.addUniversity)



  module.exports = app;