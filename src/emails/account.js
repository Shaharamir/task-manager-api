const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: 'shahramir4@gmail.com',
        to: email,
        subject: 'Thanks for joining in Task App',
        text: `Hey ${name},\nWeclome to the Task App, thanks for joining in.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        from: 'shahramir4@gmail.com',
        to: email,
        subject: 'Account deleted (Task App)',
        text: `Hey ${name},\nYour account deleted succesfully.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}