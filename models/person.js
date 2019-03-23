var assert = require('assert');
var mongodb = require('mongodb');
const con = require("./connection"),
    collectionName = "person";

/**
 * @constructor
 * @namespace personModel
 * @version 1.0
 * @property {function} select - Router handler for GET method of /person URL.
 * @property {function} insert - Router handler for POST method of /person URL.
 * @property {function} update - SocketIo event for connections to person room.
 * @property {function} remove - SocketIo event for connections to person room.
 * @class person
 * <br>A Person object contains:<br>&nbsp&nbsp
 * 
 * {string} id - Person`s identification key (optional)<br>&nbsp&nbsp
 * 
 * {string} name - Person's name <br>&nbsp&nbsp
 * 
 * {string} lastName - Person's last name <br>&nbsp&nbsp
 * 
 * {Date} birthday - Person's birth date <br>&nbsp&nbsp
 */

var model = {
    /**
     * Query selection for person collection. Returns an array of selected documents
     * @method select
     * @param {object} data - Query filters. 
     * @returns {array} 
     * @memberof personModel
     */
    select: (data={}) => {
        if (data.id){
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
     * Insert query to for a person document. Returns inserted document.
     * @method insert
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.name - Person's name.
     * @property {string} data.lastName - Person's paternal and maternal last name.
     * @property {Date} data.birthday - Person's birth date.
     * @memberof personModel
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
     * Update query to for a person document. Returns updated document.
     * @method update
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.id - Person's ID to update.
     * @property {string} data.name - New Person's name to replace.
     * @property {string} data.lastName - New Person's paternal and maternal last name to replace.
     * @property {Date} data.birthday - New Person's birth date to replace.
     * @memberof personModel
    */
    update: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.findOneAndUpdate({_id: new mongodb.ObjectID(data.id)}, {$set: data}, function(err, docs) {
                    model.select({id: data.id}).then((doc) => {
                        resolve(doc[0])
                    })
                });
            });
        });
    },
    /**
     * Remove query to for a person document. Returns document ID to confirm removing.
     * @method remove
     * @param {string} id - Person's ID document to remove.
     * @returns {string}
     * @memberof personModel
     */
    remove: (id) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.deleteOne({_id: new mongodb.ObjectID(id)}, (err, result) => {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    resolve(id);
                });
            });
        });
    }
}

module.exports = model;