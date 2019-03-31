var assert = require('assert');
var mongodb = require('mongodb');
const con = require("./connection"),
    collectionName = "user";

/**
 * @constructor
 * @namespace userModel
 * @version 1.0
 * @property {function} select - Router handler for GET method of /user URL.
 * @property {function} insert - Router handler for POST method of /user URL.
 * @property {function} update - SocketIo event for connections to user room.
 * @property {function} remove - SocketIo event for connections to user room.
 * @class user
 */

var model = {
    /**
     * Query selection for user collection. Returns an array of selected documents
     * @method select
     * @param {object} data - Query filters. 
     * @returns {array} 
     * @memberof userModel
     */
    select: (data = {}) => {
        if (data.id) {
            data._id = new mongodb.ObjectID(data.id)
            delete data.id;
        }
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.find(data).toArray((err, docs) => {
                    assert.equal(err, null);
                    resolve(docs);
                });
            });
        });
    },
    /**
     * Insert query to for a user document. Returns inserted document.
     * @method insert
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.name - user's name.
     * @property {string} data.lastName - user's paternal and maternal last name.
     * @property {Date} data.birthday - user's birth date.
     * @memberof userModel
     */
    insert: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.insertOne(data, (err, result) => {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    assert.equal(1, result.ops.length);
                    resolve(result.ops[0]);
                });
            });
        });
    },
    /**
     * Update query to for a user document. Returns updated document.
     * @method update
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.id - user's ID to update.
     * @property {string} data.name - New user's name to replace.
     * @property {string} data.lastName - New user's paternal and maternal last name to replace.
     * @property {Date} data.birthday - New user's birth date to replace.
     * @memberof userModel
    */
    update: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.findOneAndUpdate({ _id: new mongodb.ObjectID(data.id) }, { $set: data }, function (err, docs) {
                    model.select({ id: data.id }).then((doc) => {
                        resolve(doc[0])
                    })
                });
            });
        });
    },
    /**
     * Remove query to for a user document. Returns document ID to confirm removing.
     * @method remove
     * @param {string} id - user's ID document to remove.
     * @returns {string}
     * @memberof userModel
     */
    remove: (id) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.deleteOne({ _id: new mongodb.ObjectID(id) }, (err, result) => {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    resolve(id);
                });
            });
        });
    }
}

module.exports = model;