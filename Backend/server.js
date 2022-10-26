exports.start = () => {
    //host server
    // ->
    const port = 80
    const express = require('express')
    const http = require('http')
    const app = express()
    const server = http.createServer(app)
    const path = require('path')
    var sha256 = require('js-sha256');
    const { Server, Socket } = require("socket.io")
    const registrationServer = new Server(server)
    const accmanager = require("./accmanager")
    const dataloader = require("./dataloader")

    //###
    const mailer = require("./mailer.js")

    //wss
    registrationServer.on('connection', (socket) => {
        var socketMode
        var userData
        var mailcode

        socket.on('setMode', (mode) => {
            socketMode = mode
            if (socketMode === "register") {
                socket.on('register', (data) => {
                    console.log(data)
                    const usedMail = accmanager.isMailInUsage(data.mail);
                    const usedUsername = accmanager.isUsernameInUsage(data.username);
                    if (usedMail && !usedUsername) {
                        //reply with an error
                        console.log("invalidmail")
                        socket.emit("mailandusernamevalidity", "invalidmail")
                    } else if (!usedMail && usedUsername) {
                        //reply with an error
                        console.log("invalidusername")
                        socket.emit("mailandusernamevalidity", "invalidusername")
                    } else if (usedMail && usedUsername) {
                        //reply with an error
                        console.log("invalidmailandusername")
                        socket.emit("mailandusernamevalidity", "invalidmailandusername")
                    } else {
                        if (mailcode == null) {
                            mailcode = Math.floor(Math.random() * 10000000) + 1
                            console.log(mailcode)
                            mailer.sendMail(data.mail, "Auth Code >> Tobchat", "<h3 style='padding: 20px background-color: #5865f2 margin: none color: white'>Hi " + data.username + ", <br>here is your auth-Code:</h3> <h1 style='padding: 20px; background-color: black;margin: none; color: white'>" + mailcode + "</h1>")
                            userData = JSON.parse(data)
                            console.log(userData)
                            socket.emit("mailandusernamevalidity", "valid")
                        }
                    }
                })

                socket.on('mailCode', (data) => {
                    console.log(data)
                    if (data == mailcode.toString()) {
                        socket.emit("mailAuthFinished", true)
                        //create account
                        accmanager.createAccount(userData)

                    } else {
                        socket.emit("mailAuthFinished", false)
                        //wrong code
                    }
                })
            }
        })


    })

    //express
    app.get('/register', (req, res) => {
        res.sendFile("C:/Users/tobia_hxgc4hh/TobChat/Client/registration.html")
    })

    app.get('/cookies.js', (req, res) => {
        res.sendFile("C:/Users/tobia_hxgc4hh/TobChat/Client/cookies.js")
    })

    app.get('/css/index.css', (req, res) => {
        res.sendFile("C:/Users/tobia_hxgc4hh/TobChat/Client/css/index.css")
    })

    app.get('/', (req, res) => {
        res.sendFile("C:/Users/tobia_hxgc4hh/TobChat/Client/index.html")
    })

    app.get('/app', (req, res) => {
        res.sendFile("C:/Users/tobia_hxgc4hh/TobChat/Client/app/index.html")
    })



    app.get('/index.js', (req, res) => {
        res.sendFile("C:/Users/tobia_hxgc4hh/TobChat/Client/app/index.js")
    })

    // ##########################################################
    // API

    app.get("/api", (req, res) => {
        const q = req.query
        const qtype = q.qtype
        if (qtype === "user") {
            if (q.username) {
                try {
                    const user = dataloader.requireUser(q.username)
                    delete user.password
                    res.type("application/json").end(JSON.stringify(user))
                } catch (e) {
                    res.status(500).end()
                    console.log(e)
                }
            } else {
                res.status(500).end()
            }
        } else {
            res.status(500).end()
        }
    })

    //###########################################################

    server.listen(port, () => {
        console.log("server running on port " + port)
    })

    // ##########################################################

}