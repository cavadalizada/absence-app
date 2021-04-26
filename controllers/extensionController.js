const jwt = require('jsonwebtoken')

const Student = require("../models/Student")

const bcrypt = require('bcrypt')

const config = require('config')



exports.checkForQayib = async (req,res)=> {

    const token = req.query.jwt
    console.log(req.query.jwt)
    if(!token){
      return res.status(404)
    }

    try {
      const decodedToken = jwt.verify(token, config.get('JWTtoken'))
  

  
    const check = (await Student.findOne({ _id:decodedToken.id})).check      // temporary implementation
    
    if(check === undefined){
        return res.status(401).json("token invalid")
    }
    return  res.json(check)


  } catch (error) {
    return res.status(401).json("token invalid")
  }
 
 }
 
 exports.getToken = async (req,res)=>{
 
    const email = req.query.email
    
    const password = req.query.password
    console.log(email)
    console.log(password)
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

        return res.status(200).send(token)
         
        }catch (error) {
            console.log(error)
        }


 }