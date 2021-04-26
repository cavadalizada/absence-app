const {Router} = require('express');

const administratorController = require('../../controllers/administratorController');

const paymentController = require('../../controllers/paymentController');


const isAdministrator = require('../../middleware/isAdministrator');

const hasUniversity = require('../../middleware/hasUniversity');
const checkLimit = require('../../middleware/checkLimit');


const app = Router();


app.post('/register', administratorController.registerAdministrator)

app.get('/me',isAdministrator,administratorController.getInfo)

app.post('/login', administratorController.loginAdministrator)

app.get('/logout',isAdministrator, administratorController.logoutAdministrator)

app.get('/verify', administratorController.verifyEmail)

app.post('/createTeachers',isAdministrator, hasUniversity, administratorController.createTeachers)

app.get('/packages',isAdministrator, hasUniversity, paymentController.showPackages)

app.post('/payment/charge',isAdministrator, hasUniversity, paymentController.charge)

// development tools
app.post('/populatePackages',paymentController.populatePackages)

// deprecated routes

//app.get('/showRequests',isAdministrator, hasUniversity, administratorController.showRequests)

//app.post('/approveRequest',isAdministrator, hasUniversity, administratorController.approveRequest)






module.exports = app;