var modelUser = require("../models/user");
var modelRole = require("../models/role");
var modelPassword = require("../models/password");
var pug = require("pug");
var passwordValidator = require("password-validator");
var md5 = require("md5");

var userController = (io) => {
    var pages = {
        /* GET home page. */
        userPage: (req, res, next) => {
            modelUser.getEnabledUsers().then((users) => {
                modelRole.select().then((roles) => {
                    res.render("user/index", {
                        title: req.app.get("app-name"),
                        version: req.app.get("version"),
                        loggedUser: req.user,
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
                modelPassword.getConfiguration().then((passwordConfiguration) => {
                    var passwordSchema = new passwordValidator();
                    passwordSchema
                        .is().min(passwordConfiguration.minimumCharacters)
                        .is().max(passwordConfiguration.maximumCharacters)
                        .is().not().oneOf(["password", "Password", "123"]); // Blacklist these values
                    if (passwordConfiguration.hasUppercase) passwordSchema.has().uppercase();
                    if (passwordConfiguration.hasLowercase) passwordSchema.has().lowercase();
                    if (passwordConfiguration.hasNumber) passwordSchema.has().digits();
                    if (passwordConfiguration.hasSpace) passwordSchema.has().spaces();
                    var failedList = passwordSchema.validate(data.password, { list: true });
                    if (failedList.length == 0) {
                        var fn = pug.compileFile("./views/user/row.pug");
                        modelUser.newUser(
                            data.name,
                            data.lastName,
                            data.birthday,
                            data.username,
                            md5(data.password),
                            data.email,
                            data.roleId,
                            passwordConfiguration.resetPasswordOnFirstLogin,
                            passwordConfiguration.passwordExpiration,
                            passwordConfiguration.attempts
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
                });
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
