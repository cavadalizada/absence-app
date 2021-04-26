
const config = require('config')
const stripe = require('stripe')(config.get("STRIPE_PRIVATE_KEY"))

const Package = require('../models/Package')

const { sendNotification } = require('../mail/mail')


exports.populatePackages = async (req,res) => {


    Package.create({id:'1',name:'Standard',price:500})

    Package.create({id:'2',name:'Professional',price:1000})

    Package.create({id:'3',name:'Premium',price:2000})


    return res.status(200).json('success')


}


exports.showPackages = async (req,res) =>{

    const packages = await Package.find({},{"_id":0,"id":1,"name":1,"price":1})



    return res.status(200).json(packages)


}


exports.charge = async (res, req) => {

            // below code needs testing

    const packageId = req.body.packageId
    const email = req.body.stripeEmail
    const source = req.body.stripeToken
    const university = req.university

    const amount = await Package.findOne({id:packageId},"price")

    stripe.customers.create({
        email,
        source
    }).then(customer => stripe.charges.create({
        amount,
        description: 'Qayib App',
        currency: 'usd',
        customer: customer.id
    })).then(async (charge) => {
        req.university.package = await Package.findById(packageId,"_id")   // an incorrect packageId gonna break the system
        await req.university.save()                 // this is probably very careless
        
        sendNotification(email, university.name, 'administrator', "Receipt of payment")


        return res.status(200).json('success')

    })




}