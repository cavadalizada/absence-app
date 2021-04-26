const {Router} = require('express');

const extensionController = require('../controllers/extensionController')




const app = Router();


app.get('/checkForQayib', extensionController.checkForQayib)
app.get('/getToken', extensionController.getToken)



module.exports = app;