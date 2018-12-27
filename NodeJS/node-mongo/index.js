const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations.js');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {

    // check that error is not null, otherwise show error
    assert.equal(err, null);

    console.log('connected correctly to server');

    const db = client.db(dbname);

    dboper.insertDocument(db, { name: "Vadonut", description: "Donut"}, 'dishes', (result) => {
        console.log('Insert Document:\n', result.ops);

        dboper.findDocuments(db, 'dishes', (docs) => {
            console.log('Found Documents:\n', docs);

            dboper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated Donut'}, 'dishes', (result) => {
                console.log('Updated Document:\n' + result.result);
                
                dboper.findDocuments(db, 'dishes', (docs) => {
                    console.log('Found Documents:\n', docs);

                    db.dropCollection('dishes', (result) => {
                        console.log('Dropped Collection: ', result);

                        client.close();
                    });
                });
            });
        });
    });
});