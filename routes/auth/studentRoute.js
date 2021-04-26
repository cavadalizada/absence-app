const {Router} = require('express');

const studentController = require('../../controllers/studentController');

const app = Router();


app.post('/login', studentController.loginStudent)

app.get('/me',studentController.getInfo)


app.get('/logout', studentController.logoutStudent)





  module.exports = app;