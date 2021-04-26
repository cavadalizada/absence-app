const jwt = require('jsonwebtoken')
const config = require('config')
const Administrator = require('../models/Administrator')
const isAdministrator = require('./isAdministrator')
const isTeacher = require('./isTeacher')


const decide = async(req,res, next) => {
    

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, config.get('JWTtoken'))
        const user = await Administrator.findOne({_id:decodedToken.id, 'tokenList.token': token})
        if(!user){
            return isTeacher(req,res,next)
        }
            return isAdministrator(req,res,next)

    } catch (error) {
        res.status(401).send({error: "Authentication invalid"})
    }

}

module.exports = decide