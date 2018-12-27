const assert = require('assert');

// export insert function
exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);

    // supported by mongodb driver
    // imagine function insert(document, callback) { ... callback(err, result) ... } where callback includes
    // assert, console.log and callback(result)
    coll.insert(document, (err, result) => {
        assert.equal(err, null);
        console.log("Inserted " + result.result.n +
        " documents into the collection " + collection);
        callback(result);
    });
};

// search collection and return documents
exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection);
    coll.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        callback(docs);
    });
};

// delete operation
exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.deleteOne(document, (err, result) => {
        assert.equal(err, null);
        console.log("removed the document " + document);
        callback(result);
    });
};

// update
exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    // pass in field to be updated $set
    coll.updateOne(document, { $set: update}, null, (err, result) => {
        assert.equal(err, null);
        console.log("updated the document ", update);
        callback(result);
    });
};