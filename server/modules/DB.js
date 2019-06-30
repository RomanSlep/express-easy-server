const {syncNedb, modelDb} = require('../helpers/syncNedb');
const Datastore = require('nedb');

module.exports = {
    usersDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/users',
        autoload: true
    }), 60)),
   
    gamesDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/games',
        autoload: true
    }), 60)),

    transDb: syncNedb(new Datastore({
        filename: 'db_/transactions',
        autoload: true
    })),
};