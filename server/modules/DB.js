const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    useNewUrlParser: true
});
const model = require('../helpers/mongoModel');
const collections = {};
mongoClient.connect((err, client) => {
    if (err) {
        throw (err);
    }
    const db = client.db("pockerdb");
    collections.db = db;
    collections.usersDb = model(db.collection("users"));
    collections.depositsDb = model(db.collection("deposits"));
    console.log('DB success init...');
});

module.exports = collections;
