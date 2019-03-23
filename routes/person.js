var express = require('express');
var router = express.Router();
var modelPerson = require('../models/person');
var pug = require('pug');

/**
 * @constructor
 * @param {SocketIO} io - Socket IO room for person router.
 * @version 1.0
 * @namespace
 * @property {express.Router} get - Router handler for GET method of /person URL.
 * @property {express.Router} post - Router handler for POST method of /person URL.
 * @property {SocketIO} io - SocketIo event for connections to person room.
 * @class personRouter
 */
var personRouter = function (io) {
	/**
     * GET method handler for person router.
     * @function get
     * @param {object} req - Represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, etc.
     * @param {object} res - Represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {object} next - Indicates the next middleware function.
	 * @memberof personRouter
     */
	router.get('/', (req, res, next) => {
		modelPerson.select().then((people) => {
			res.render('person/index', {
				title: 'Audit Software',
				user: 'Oso',
				version: req.app.get('version'),
				people: people
			});
		});
	});

	/**
     * Socket io listener for insert/update/delete functions.
     * @function io
     * @param {SocketIO} io - Socket IO room for person router.
	 * @property {SocketIO} io.onInsert - SocketIo event for person record inserts.
	 * @property {SocketIO} io.onUpdate - SocketIo event for person record updates.
	 * @property {SocketIO} io.onRemove - SocketIo event for person record removes.
     * @memberof personRouter
     */
	io.on('connection', (socket) => {
		/**
		 * Socket listener for insert events.
		 * @function socket-onInsert
		 * @param {object} data - Data recieved for person insertion.
		 * @property {string} data.name - Person's name.
		 * @property {string} data.lastName - Person's paternal and maternal last name.
		 * @property {Date} data.birthday - Person's birth date.
		 * @memberof personRouter
		 */
		socket.on('insert', (data) => {
			modelPerson.insert(data).then((person) => {
				var fn = pug.compileFile('./views/person/row.pug');
				io.emit('inserted', {
					id: person._id,
					html: fn({ person: person })
				});
			});
		});
		/**
		 * Socket listener for update events.
		 * @function socket-onUpdate
		 * @param {object} data - Data recieved for person to update.
		 * @property {string} data.id - Person's ID to update.
		 * @property {string} data.name - New Person's name to replace.
		 * @property {string} data.lastName - New Person's paternal and maternal last name to replace.
		 * @property {Date} data.birthday - New Person's birth date to replace.
		 * @memberof personRouter
		 */
		socket.on('update', (data) => {
			modelPerson.update(data).then((person) => {
				var fn = pug.compileFile('./views/person/row.pug');
				io.emit('updated', {
					id: person._id,
					html: fn({ person: person })
				});
			});
		});
		/**
		 * Socket listener for update events.
		 * @function socket-onRemove
		 * @param {object} data - Data received for person to remove.
		 * @property {string} data.id - Person's ID to remove.
		 * @memberof personRouter
		 */
		socket.on('remove', (data) => {
			modelPerson.remove(data.id).then((id) => {
				io.emit('removed', {
					id: id,
				});
			});
		});
	});
	return router;
};

module.exports = personRouter;
