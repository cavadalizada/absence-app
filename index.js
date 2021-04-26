// var cluster = require('cluster');

// if (cluster.isMaster) {
//   cluster.fork();
//   cluster.fork();
//   //cluster.fork();

// } else {


const express = require('express') 
const bodyParser = require('body-parser');


const cors = require('cors')

const {connectDB} = require("./config/index")

const universityRoute = require('./routes/universityRoute')

const extensionRoute = require('./routes/extensionRoute')

const administratorRoute = require('./routes/auth/administratorRoute')

const teacherRoute = require('./routes/auth/teacherRoute')

const studentRoute = require('./routes/auth/studentRoute')


const port = process.env.PORT || 3005


var app = express()

connectDB()

app.use(cors({
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/university', universityRoute);

app.use('/extension', extensionRoute);

app.use('/auth/administrator', administratorRoute);

app.use('/auth/teacher', teacherRoute);

app.use('/auth/student',studentRoute);

app.use('/*',(req,res)=>{

  return res.status(404).send("doesn't exist")
})


  app.listen(port,()=>{

    console.log("Listening on " + port)
})

//}