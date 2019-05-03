const syncNedb = require('../helpers/syncNedb');
const Datastore = require('nedb');

module.exports = {
    usersDb: syncNedb(new Datastore({
        filename: 'db_/users',
        autoload: true
    }), 60),
};