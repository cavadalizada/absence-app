const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const config = require("config");

const Administrator = require("../models/Administrator");

const Teacher = require("../models/Teacher");

const { sendNotification } = require("../mail/mail");

exports.getInfo = async (req, res) => {

    const data = await Administrator.findById(req.user._id,["-_id","username","email","first_name","last_name"]) 

    return res.status(200).json(data)


}



// Login controller
exports.loginAdministrator = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    const user = await Administrator.findOne({ email }).exec();

    if (user == null) {
      return res.status(400).json({ msg: `Unable to login` });
    }
    if (!user.isVerified) {
      return res.status(400).json("Verify account first");
    }
    const salt = user.salt;

    if (user.password != bcrypt.hashSync(password, salt)) {
      return res.status(400).json({ msg: "Unable to login" });
    }

    const token = jwt.sign({ id: user._id }, config.get("JWTtoken"), {
      expiresIn: "1 day",
    });
    user.tokenList = user.tokenList.concat({ token });
    await user.save();
    console.log(user);
    return res.json({ token: token });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyEmail = async (req, res) => {
  var user = await Administrator.findOne({ username: req.query.username });
  if (!user) {
    return res.json({ msg: "Please try again" });
  }
  if (req.query.verifyCode == user.verifyCode) {
    user.isVerified = true;
    user.verifyCode = null;
    await user.save();
    return res.json("success");
  }

  return res.json({ msg: "Please try again" });
};

//Logout
exports.logoutAdministrator = async (req, res) => {
  req.user.tokenList = req.user.tokenList.filter((token) => {
    return token.token !== req.token;
  });
  req.user.save().then().catch();

  return res.status(200).json("success");
};

// Registration
exports.registerAdministrator = async (req, res) => {
  const { username, email, password, firstname, lastname } = req.body;

  if (!username || !password || !email || !firstname || !lastname) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    var test = await Administrator.findOne({
      $or: [{ username }, { email }],
    }).exec();
    if (test != null) {
      return res.status(400).json({ msg: "Email already taken" });
    }

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(email)) {
      return res.status(400).json({ msg: "Email incorrect" });
    }

    await Administrator.registerAdministrator(
      username,
      email,
      password,
      firstname,
      lastname
    );

    return res.status(200).json("success");
  } catch (error) {
    console.log(error);
  }
};

// POST auth/administrator/createTeachers

// requires valid jwt token of verified administrator who has a university

// takes in emails

// if teacher not registered
// initializes Teacher object for each email
// creates a random password
// adds them to the administrators university

// if teacher registered
// find the teacher
// concat the university

exports.createTeachers = async (req, res) => {
  const email = req.body.email  //const emails = req.body.emails;
  const university = req.university;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const department = req.body.department
  
  var data = " ";
  if (!emails) {
    return res.status(401).json("enter all fields");
  }
 // emails.forEach(async (email) => {
    try {
      const password = Math.random().toString(36).substr(2);

      var test = await Teacher.findOne({ email });
      // fix this to be faster remove some awaits maybe
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegexp.test(email)) {
        return res.status(400).json({ msg: "Email " + email + " incorrect" });
      }

      if (test != null) {
        // teacher is already registered with another university
        if (test.university.includes(university._id)) {
          console.log("add here respone to client");
        } else {
          test.university = test.university.concat(university._id);
          console.log(test.university);
          await test.save();
          sendNotification(
            email,
            university.name,
            "teacher",
            "You were added to a new university !"
          );
        }
      } else {
        // if not registered
        await Teacher.registerTeacher(email, email, password, university,firstname,lastname,department);
      }
    } catch (error) {
      console.log(error);
    }
//}  
  ;

  return res.status(200).json("success" + data);
};

//  BELOW CODE IS DEPRECATED
// exports.showRequests = async (req,res) =>{

//     if(!req.university){
//         return res.status(401).json("something went wrong")
//     }
//     const data = await Request.find({"university": req.university._id}, {'_id':0,'username':1}).populate('teacher',{'_id':0,'username':1})

//     return res.status(200).json(data)

// }

// //DEPRECATED
// exports.approveRequest = async (req,res) =>{

//     if(!req.university){
//         return res.status(401).json("something went wrong")
//     }
//     if(!req.body.teacher){
//         return res.status(401).json("please fill all fields")
//     }
//     const teacher = req.body.teacher

//     var teacherObj = await Teacher.findOne({"username":teacher});

//     const request = await Request.findOne(
//         {"$and": [
//             {"university": req.university._id},
//             {"teacher":teacherObj._id}
//     ]})
//     if(!request){
//         return res.status(401).json("teacher name invalid")
//     }
//     teacherObj.university = teacherObj.university.concat( req.university._id )
//     await teacherObj.save()

//     await Request.deleteOne({"_id":request._id})

//     return res.status(200).json("teacher added")

// }
