const nodeMailer = require("nodemailer");
const catchAsyncError = require("../middleware/catchAsyncError");



const sendEmail = async({email, subject, mailMessage})=>{


    let transporter = nodeMailer.createTransport({
        service : process.env.SMTP_SERVICE,
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        secure : true,
        auth : {
            user : process.env.SMTP_USER,
            pass : process.env.SMTP_PASS,   
        },
        tls : { rejectUnauthorized : false}
    })

    let info = await transporter.sendMail({
        from : "pawnatest@gmail.com",
        to : email,
        subject : subject,
        text : mailMessage,
    })

}

module.exports = sendEmail;




















