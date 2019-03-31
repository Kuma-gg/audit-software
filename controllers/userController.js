var modelUser = require('../models/person');
var pug = require('pug');

var userController = (io) => {
    var pages = {
        /* GET home page. */
        userPage: (req, res, next) => {
            modelUser.select().then((users) => {
                res.render('person/index', {
                    title: req.app.get('app-name'),
                    version: req.app.get('version'),
                    user: req.user,
                    users: users
                });
            });
        }
    };
    io.on('connection', (socket) => {
        socket.on('insert', (data) => {
            modelUser.insert(data).then((user) => {
                var fn = pug.compileFile('./views/person/row.pug');
                io.emit('inserted', {
                    id: user._id,
                    html: fn({ user: user })
                });
            });
        });
        socket.on('update', (data) => {
            modelUser.update(data).then((person) => {
                var fn = pug.compileFile('./views/person/row.pug');
                io.emit('updated', {
                    id: person._id,
                    html: fn({ person: person })
                });
            });
        });
        socket.on('remove', (data) => {
            modelUser.remove(data.id).then((id) => {
                io.emit('removed', {
                    id: id,
                });
            });
        });
    });
    return pages;
};

module.exports = userController;
