var assert = require("assert");
var mongodb = require("mongodb");
const con = require("./connection"),
    collectionName = "role";

/**
 * @constructor
 * @namespace roleModel
 * @version 1.0
 * @property {function} select - Router handler for GET method of /role URL.
 * @property {function} insert - Router handler for POST method of /role URL.
 * @property {function} update - SocketIo event for connections to role room.
 * @property {function} remove - SocketIo event for connections to role room.
 * @class role
 */

var model = {
    /**
     * Query selection for role collection. Returns an array of selected documents
     * @method select
     * @param {object} data - Query filters. 
     * @returns {array} 
     * @memberof roleModel
     */
    select: (data = {}) => {
        if (data.id) {
            data._id = new mongodb.ObjectID(data.id);
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
     * Insert query to for a role document. Returns inserted document.
     * @method insert
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.name - role's name.
     * @property {string} data.lastName - role's paternal and maternal last name.
     * @property {Date} data.birthday - role's birth date.
     * @memberof roleModel
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
     * Update query to for a role document. Returns updated document.
     * @method update
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.id - role's ID to update.
     * @property {string} data.name - New role's name to replace.
     * @property {string} data.lastName - New role's paternal and maternal last name to replace.
     * @property {Date} data.birthday - New role's birth date to replace.
     * @memberof roleModel
    */
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
    /**
     * Remove query to for a role document. Returns document ID to confirm removing.
     * @method remove
     * @param {string} id - role's ID document to remove.
     * @returns {string}
     * @memberof roleModel
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
};

module.exports = model;