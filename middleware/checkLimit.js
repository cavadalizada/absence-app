const Teacher = require("../models/Teacher")
const University = require("../models/University")
const { sendNotification } = require("../mail/mail")

const checkLimit = async (req,res, next) => {
    

    try {
        const count = await Teacher.countDocuments({university:req.university._id})
        const teacherLimit = (await University.findById(req.university._id,{"package":1,"_id":0}).populate(`package`,{'teacherLimit':1,'_id':0})).package.teacherLimit
        console.log(count)
        if(count<teacherLimit){

            return next()
        }
        throw new Error()
        
    } catch (error) {
        sendNotification(req.user.email,req.university.name,'administrator',"Teacher limit exceeded ! Please consider upgrading.")
        
        return res.status(401).send({error: "Teacher limit exceeded"})
        
    }

}

module.exports = checkLimit