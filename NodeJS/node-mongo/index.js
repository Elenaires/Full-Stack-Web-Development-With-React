const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {

    // check that error is not null, otherwise show error
    assert.equal(err, null);

    console.log('connected correctly to server');

    const db = client.db(dbname);
    const collection = db.collection('dishes');

    // insert one document into the collection
    collection.insertOne({"name": "Uthapizza", "discription": "test"}, (err, result) => {
        assert.equal(err, null);

        console.log('After Insert:\n');

        // show how many operations have been carried out
        // successfully
        console.log(result.ops);

        collection.find({}).toArray((err, docs) => {
            assert.equal(err, null);

            console.log('Found:\n');
            // return all docs from this collection that 
            // match the criteria (in this case empty, so all to be returned)
            console.log(docs);

            // just to clean up database for exercise
            db.dropCollection('dishes', (err, result) =>{
                assert.equal(err, null);

                // close connection to database
                client.close();
            });
        });
    });
});