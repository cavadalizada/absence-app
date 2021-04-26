const Administrator = require("../models/Administrator")
const jwt = require('jsonwebtoken')
const config = require('config')


const isAdministrator = async(req,res, next) => {
    

    try {
        const token = req.header('Authorization').replace('Bearer ', '') 
        const decodedToken = jwt.verify(token, config.get('JWTtoken'))
        const user = await Administrator.findOne({_id:decodedToken.id, 'tokenList.token': token})
        if(!user){
            throw new Error()
        }

        // if(!user.isVerified){
        //     return res.status(401).json("User not verified")
        // }
        req.token = token
        req.user = user
        req.dasdassfafas = 1

        return next()
    } catch (error) {
        res.status(401).send({error: "Authentication invalid"})
    }

}

module.exports = isAdministrator