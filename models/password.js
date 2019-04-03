var assert = require("assert");
var mongodb = require("mongodb");
const con = require("./connection"),
    collectionName = "password";

/**
 * @constructor
 * @namespace passwordModel
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
     * @memberof passwordModel
     */
    getConfiguration: (data = {}) => {
        if (data.id) {
            data._id = new mongodb.ObjectID(data.id);
            delete data.id;
        }
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.find(data).toArray((err, docs) => {
                    assert.equal(err, null);
                    resolve(docs[0]);
                });
            });
        });
    },
    update: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.findOneAndUpdate({ _id: new mongodb.ObjectID(data.id) }, { $set: data }, function (err, docs) {
                    model.select({ id: data.id }).then((doc) => {
                        resolve(doc[0]);
                    });
                });
            });
        });
    },
};

module.exports = model;