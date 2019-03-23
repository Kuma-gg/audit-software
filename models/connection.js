var express = require('express');
var app = express();
var path = require('path');
var nconf = require('nconf');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
nconf.argv().env().file({file: path.join(__dirname, '..', 'config.json')});
var mongoConfig = nconf.get(app.get('env')).mongoConfig;

/**
 * @constructor
 * @namespace connect
 * @version 1.0
 * @property {promise} resolve - Resolve mongo db connection promise.
 * @property {promise} reject - Reject mongo db connection promise.
 * @class connect
 */
var connect = new Promise((resolve, reject) => {
	MongoClient.connect(mongoConfig.url, {useNewUrlParser: true}, (err, client) => {
		assert.equal(null, err);
		console.log(`Connected successfully to Mlab ${app.get('env')} Database Server`);
		resolve(client.db(mongoConfig.dbName));
		//client.close();
	});
});

module.exports = connect;