const University = require("../models/University")

const hasUniversity = async(req,res, next) => {
    

    try {
        
        if(req.user.university != []){
            req.university = await University.findById(req.user.university)
            if(!req.university.isVerified){
                return res.status(401).send({error: "University is not verified"})
            }
            return next()
        }
        throw new Error()
        
    } catch (error) {
        res.status(401).send({error: "No university found"})
    }

}

module.exports = hasUniversity