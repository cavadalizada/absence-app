const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)
const config = require('config')


const Student = require('../models/Student')


const Request = require('../models/Request')


exports.getInfo = async (req, res) => {

    const data = await Student.findById(req.user._id,["-_id","username","email","first_name","last_name"]) 

    return res.status(200).json(data)


}

// Login controller
exports.loginStudent = async (req,res)=>{
    const { email, password} = req.body
        
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const user = await Student.findOne({email}).exec()
    
            if(user == null){
                return res.status(401).json({msg: `Unable to login`})
            } 
            const salt = user.salt

            if(user.password!=bcrypt.hashSync(password,salt)){
            return res.status(401).json({ msg: 'Unable to login' });

        }

        const token = jwt.sign({"id":user._id},config.get('JWTtoken'),{expiresIn:"1 day"});
        user.tokenList = user.tokenList.concat({ token })
        await user.save()

        return res.json({"token":token})
         
        }catch (error) {
            console.log(error)
        }


}

//Logout
exports.logoutStudent = async (req,res)=>{
    
    req.user.tokenList = req.user.tokenList.filter((token)=>{

        return token.token !== req.token
    })
    req.user.save().then().catch()
    
    return res.status(200).json("success")
}



// BELOW CODE IS DEPRECATED



// exports.verifyEmail = async (req,res)=>{
    
//     var user = await Student.findOne({"username":req.query.username})
//     if(!user){
//         return res.json({msg:"Please try again"})

//     }
//     if(req.query.verifyCode==user.verifyCode){                           
//         user.isVerified = true
//         user.verifyCode = null;
//         await user.save()
//         return res.json("success")
//     }

//     return res.json({msg:"Please try again"})




// }


// Registration
// exports.registerStudent = async (req,res)=>{

//     const {username, email, password} = req.body


//     if (!username || !password || !email) {
//         return res.status(400).json({ msg: 'Please enter all fields' });
//     }
//     try {

//         var test = await Student.findOne({$or: [
//             {username},
//             {email}]}).exec()
//         if(test!=null){
//         return res.status(400).json({ msg: 'Email already taken' });
//         }
    
//       const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
//       if(!emailRegexp.test(email)){
//           return res.status(400).json({msg: 'Email incorrect'})
//       }

    
//       await Student.registerStudent(username, email, password)

//       return res.status(200).json('success')

      
//     }catch (error) {
//         console.log(error)
//     }


// }


// exports.addUniversity = async (req,res) => {

//     const user = req.user
//     const university = req.body.university

//     if(!university){
//         return res.status(401).json("specify a university")
//     }

//     const universityId = await University.findOne({"name":university},"_id")
//     if(!universityId){
//         return res.status(401).json("university not found")
//     }

//     var request = new Request

//     request.type = 1
//     request.Student = user._id
//     request.university = universityId
//     try {
//         await request.save()

//     } catch (error) {
//         return res.status(401).json("Request already made")
//     }

//     return res.status(200).json("request saved. wait for an administrator to approve")


// }
