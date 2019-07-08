const {syncNedb, modelDb} = require('../helpers/syncNedb');
const Datastore = require('nedb');

module.exports = {
    usersDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/users',
        autoload: true
    }), 63)),
   
    gamesDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/games',
        autoload: true
    }), 24)),

    gameTransDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/gameTrans',
        autoload: true
    }))),

    depositsDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/deposits',
        autoload: true
    }))),
};