var modelUser = require("../models/user");
var modelRole = require("../models/role");
var pug = require("pug");
var passwordValidator = require("password-validator");
var md5 = require("md5");

var userController = (io) => {
    var pages = {
        /* GET home page. */
        userPage: (req, res, next) => {
            modelUser.getEnabledUsers().then((users) => {
                console.log(users);
                modelRole.select().then((roles) => {
                    res.render("user/index", {
                        title: req.app.get("app-name"),
                        version: req.app.get("version"),
                        user: req.user,
                        users: users,
                        roles: roles
                    });
                });
            });
        }
    };
    io.on("connection", (socket) => {
        socket.on("insert", (data) => {
            if (md5(data.password) === md5(data.repeatPassword)) {
                //Validation
                var passwordSchema = new passwordValidator();
                passwordSchema
                    .is().min(8)                                    // Minimum length 8
                    .is().max(100)                                  // Maximum length 100
                    .has().uppercase()                              // Must have uppercase letters
                    .has().lowercase()                              // Must have lowercase letters
                    .has().digits()                                 // Must have digits
                    .has().not().spaces()                           // Should not have spaces
                    .is().not().oneOf(["password", "Password", "123"]); // Blacklist these values
                var failedList = passwordSchema.validate(data.password, { list: true });
                if (failedList.length == 0) {
                    var fn = pug.compileFile("./views/user/row.pug");
                    modelUser.newUser(
                        data.name,
                        data.lastName,
                        data.birthday,
                        data.username,
                        md5(data.password),
                        data.roleId
                    ).then((insertedUser) => {
                        modelUser.getUser(insertedUser._id).then((user) => {
                            io.emit("inserted", {
                                success: true,
                                id: user._id,
                                html: fn({ user: user })
                            });
                        });
                    });
                } else {
                    invalidPassword(failedList);
                }
            } else {
                invalidPassword(["notEqual"]);
            }

            function invalidPassword(failedList) {
                var messages = [];
                failedList.forEach((invalid) => {
                    switch (invalid) {
                        case "notEqual":
                            messages.push("Please make sure you repeated the correct password.");
                            break;
                        case "min":
                            messages.push("The password is too short. You need more than 8 characters.");
                            break;
                        case "max":
                            messages.push("The password is too long. You need less than 100 characters.");
                            break;
                        case "uppercase":
                            messages.push("The password requires uppercase letters.");
                            break;
                        case "lowercase":
                            messages.push("The password requires lowercase letters.");
                            break;
                        case "digits":
                            messages.push("The password requires digits.");
                            break;
                        case "spaces":
                            messages.push("The password cannot have spaces.");
                            break;
                        case "oneOf":
                            messages.push("Weak password.");
                            break;
                    }
                });
                io.emit("inserted", {
                    success: false,
                    failedList: messages,
                });
            }
        });
        socket.on("update", (data) => {
            modelUser.update(data).then((user) => {
                var fn = pug.compileFile("./views/user/row.pug");
                io.emit("updated", {
                    id: user._id,
                    html: fn({ user: user })
                });
            });
        });
        socket.on("remove", (data) => {
            modelUser.remove(data.id).then((id) => {
                io.emit("removed", {
                    id: id,
                });
            });
        });
    });
    return pages;
};

module.exports = userController;
