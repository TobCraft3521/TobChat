//load data
// ->
const fs = require("fs")
const loadedAccounts = {}

exports.requireUser = (username) => {
    if (loadedAccounts[username]) {
        //console.log("loading user from ram")
        return loadedAccounts[username]
    } else {
        //console.log("loading user from file")
        try {
            loadedAccounts[username] = JSON.parse(fs.readFileSync("data/accounts/" + username + ".json", "utf-8"))
        } catch (err) {
            //no user was found
            //console.log("err: " + err)
        }
        return loadedAccounts[username]
    }
}

exports.forEachUser = (method) => {
    const accounts = fs.readdirSync("data/accounts/")
    accounts.forEach((any) => {
        const account = this.requireUser(any.replace(".json",""))
        delete account.password
        method(account)
    })
}


