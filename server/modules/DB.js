const {syncNedb, modelDb} = require('../helpers/syncNedb');
const Datastore = require('nedb');

module.exports = {
    usersDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/users',
        autoload: true
    }), 10)),
   
    gamesDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/games',
        autoload: true
    }), 10)),

    gameTransDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/gameTrans',
        autoload: true
    }))),

    depositsDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/deposits',
        autoload: true
    }))),

    seasonsDb: modelDb(syncNedb(new Datastore({
        filename: 'db_/seasons',
        autoload: true
    }))),
};