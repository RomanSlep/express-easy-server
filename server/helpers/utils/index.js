const clone = require('clone');
const {usersDb, depositsDb} = require('../../modules/DB');
const config = require('../../helpers/configReader');
const sha256 = require('sha256');
const log = require('../log');
const Store = require('../Store');

module.exports = {
    clone,
    round(n) {
        return Number(n.toFixed(0));
    },
    unix(){
        return new Date().getTime();
    },
    async getUserFromQ (q) {
        const user = await usersDb.findOne(q);
        return user;
    },

    async createUser(params){
        const user = new usersDb({
            _id: params.address,
            address: params.address,
            login: params.login,
            password: sha256(params.password.toString()),
            deposit: config.regDrop
        });
        await user.save();
        depositsDb.db.syncInsert({user_id: user._id, amount: config.regDrop, type: 'regdrop'});
        return user;
    }
};
