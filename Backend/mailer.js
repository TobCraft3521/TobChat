const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const config = require("./config.js")
const { stringify } = require('querystring')
const OAuth2 = google.auth.OAuth2
const OAuth_client = new OAuth2(config.clientid, config.secret)
OAuth_client.setCredentials({ refresh_token: config.refreshtoken })

exports.sendMail = (empfaenger, title, text) => {
    //send an email
    const accessToken = OAuth_client.accessToken
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: config.user,
            clientId: config.clientid,
            clientSecret: config.secret,
            refreshToken: config.refreshtoken,
            accessToken: accessToken
        }
    })

    var mailOptions = {
        from: 'Tobchat Account Service <' + config.user + '>',
        to: empfaenger,
        subject: title,
        html: text
    }
    try {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                //socket.emit("errorRegister", true)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
    } catch (e) {

    }

}