const axios = require('axios')
const sgMail = require('@sendgrid/mail')
const FACTOR_SECRET_KEY = process.env.FACTOR_SECRET_KEY

module.exports = {
    sendSMS: async function(req){
        return new Promise(async function(resolve, reject){
            try{
                const {type} = req
                if (type === "SEND_OTP"){
                    const {number, templateId, message} = req
                    if (FACTOR_SECRET_KEY && number && templateId && message){
                        const { data } = await axios({
                            method:"Get",
                            url:`https://2factor.in/API/V1/${FACTOR_SECRET_KEY}/SMS/${number}/${message}/${templateId}`
                        })
                        console.log("data", data)
                        return resolve({success: true, response: data, statusCode: 200})
                    }
                    else{
                        return resolve({success: false, response: {message:"Fields are missing"}, statusCode: 400})
                    }
                }
            }
            catch(error){
                return reject({success: false, response: {message:error.message}, statusCode: 500})
            }
        })
    },
    sendMail: async function(req){
        return new Promise( async function(resolve, reject){
            try{
                const API_KEY = process.env.API_KEY
                const SENDER_MAIL = process.env.SENDER_MAIL
                sgMail.setApiKey(API_KEY)
                const message = {
                    to: req.recieverMail,
                    from: SENDER_MAIL,
                    subject: req.subject,
                    html: req.html
                }
                await sgMail.send(message)
                resolve('Mail has been sent successfully')
            }
            catch(err){
                reject(err)
            }
        })
    }
}