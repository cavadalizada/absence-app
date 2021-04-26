const Teacher = require("../models/Teacher")
const jwt = require('jsonwebtoken')
const config = require('config')


const isTeacher = async(req,res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, config.get('JWTtoken'))
        
        const user = await Teacher.findOne({_id:decodedToken.id, 'tokenList.token': token})

        if(!user){
            throw new Error()
        }

        // if(!user.isVerified){
        //     return res.status(401).json("User not verified")
        // }
        req.token = token
        req.user = user


        return next()
    } catch (error) {
        res.status(401).send({error: "Authentication invalid"})
    }

}

module.exports = isTeacher