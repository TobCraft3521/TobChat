const dataloader = require("./dataloader")
const fs = require("fs")
exports.isMailInUsage = (mail) => {
    let result = false
    dataloader.forEachUser((any) => {
        if (any.mail === mail) {
            result = true
        }
    })
    return result
}

exports.isUsernameInUsage = (username) => {
    let result = false
    dataloader.forEachUser((any) => {
        if (any.name === username) {
            result = true
        }
    })
    return result
}

exports.createAccount = (accdata) => {
    const checkedAccData = {
        name: accdata.name,
        mail: accdata.mail,
        password: accdata.password,
        avatar: accdata.avatar
    }
    fs.writeFileSync("./data/accounts/" + checkedAccData.name + ".json",JSON.stringify(checkedAccData),"utf-8")
}