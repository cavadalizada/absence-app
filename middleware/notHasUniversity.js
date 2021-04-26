
const notHasUniversity = async(req,res, next) => {
    

    try {
        
        if(req.user.university === undefined || req.user.university.length == 0){
            return next()
        }
        throw new Error()
    
    } catch (error) {
        res.status(401).send({error: "User already has a university"})
    }

}

module.exports = notHasUniversity