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
                    passwordConfiguration: passwordConfiguration
                });
            });
        }
    };
    io.on("connection", (socket) => {
        socket.on("update", (data) => {
            modelUser.update(data).then((user) => {
                io.emit("updated", {
                    id: user._id,
                });
            });
        });
    });
    return pages;
};

module.exports = userController;
