const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SG_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'admin@heiseymedia.com',
        subject: 'Welcome to the HMG Task Manager',
        text: `Welcome ${name} to HMG Task Manager! We hope you enjoy your exprience.`
    })
}

const sendWFarwellEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'admin@heiseymedia.com',
        subject: 'Sorry To see You Go',
        text: `We Are Sorry to see you leave.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendWFarwellEmail
}