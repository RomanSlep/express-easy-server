const {syncNedb, modelDb} = require('../helpers/syncNedb');
const Datastore = require('nedb');

module.exports = {
    usersDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/users',
        autoload: true
    }), 10)),

    depositsDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/deposits',
        autoload: true
    }))),

    storeDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/store',
        autoload: true
    }), 10)),

    sellDepth: modelDb(syncNedb(new Datastore({
        filename: 'db_/sellDepth',
        autoload: true
    }), 10)),

    buyDepth: modelDb(syncNedb(new Datastore({
        filename: 'db_/buyDepth',
        autoload: true
    }), 10))
};
