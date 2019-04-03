var modelPassword = require("../models/password");
var pug = require("pug");

var userController = (io) => {
    var pages = {
        /* GET home page. */
        passwordPage: (req, res, next) => {
            modelPassword.select().then((passwordConfiguration) => {
                res.render("password/index", {
                    title: req.app.get("app-name"),
                    version: req.app.get("version"),
                    loggedUser: req.user,
                    passwordConfiguration: passwordConfiguration[0]
                });
            });
        }
    };
    io.on("connection", (socket) => {
        socket.on("update", (data) => {
            modelPassword.update(data).then((passwordConfiguration) => {
                io.emit("updated", {
                    passwordConfiguration: passwordConfiguration,
                    success: true,
                });
            });
        });
    });
    return pages;
};

module.exports = userController;
