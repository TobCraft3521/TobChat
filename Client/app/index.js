let bartype = "groups"
const accavatar = $("#avatar")

function addChatorGroup() {
    alert("test")
}

const switchBarTypeBtn = $("#switchbar")
function switchBarType() {
    if (bartype === "groups") {
        switchBarTypeBtn.html("Switch to groups")
        bartype = "chats"
    } else {
        switchBarTypeBtn.html("Switch to chats")
        bartype = "groups"
    }
}

//check if user is logged in

const username = readCookie("username")
const mail = readCookie("mail")
const password = readCookie("password")
if (username && mail && password) {
    console.log("valid cookies")
} else {
    window.location.href = "/register"
}

//load selfuser
let self
const userReq = fetch("/api?qtype=user&username=" + username).then((res, err) => {
    return res.json()
}).then((data) => {
    self = data
    //load avatar
    accavatar.attr("src", self.avatar)
})





