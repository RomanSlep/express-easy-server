const {usersDb, depositsDb} = require('../../modules/DB');
const config = require('../../helpers/configReader');
const sha256 = require('sha256');
const log = require('../log');

module.exports = {
    clone: require('clone'),
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
        const {regDrop} = config;
        const user = new usersDb({
            _id: params.address,
            address: params.address,
            login: params.login,
            password: sha256(params.password.toString()),
            deposit: regDrop || 0
        });
        await user.save();
        if (regDrop){
            depositsDb.db.syncInsert({user_id: user._id, amount: regDrop, type: 'regdrop'});
        }
        return user;
    }
};
