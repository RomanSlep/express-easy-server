const clone = require('clone');
const {usersDb, gamesDb, gameTransDb, depositsDb} = require('../../modules/DB');
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
        if (user){
            user.updateData = updateData;
            user.rating = Store.getRatingFromLogin(user.login);
        }
        return user;
    },
    filterGame(game) {
        if (!game) {
            return game;
        }
        game = clone(game);
        game.cellsBomb = null;
        return game;
    },
    /**
     * @description Получение суммы транзакций бч и отчетов по сезонам
     * @param {string} user_id
     */
    async getUserDeposits(user_id){
        let deposit = 0;
        (await depositsDb.db.syncFind({user_id})).forEach(d => {// депозит вводы/выводы за все время
            deposit += d.amount;
        });
        return deposit;
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
    },
    async createGame(){

    }
};

async function updateData(cb) {
    const user = this;
    const id = user._id;
    const $u = module.exports;
    try {
        let {deposit, score} = await $u.getGamesDepositAndScore(id);
        deposit += await $u.getUserDeposits(id);
        score += await $u.getDropsScores(id);
        score *= config.scoreMult;
        deposit = Number(deposit.toFixed(0)) || 0;
        score = Number(score.toFixed(0)) || 0;
        if (deposit === NaN || score === NaN) {
            cb && cb();
            return;
        }
        await user.update({deposit, score}, true);
        cb && cb();
    } catch (e) {
        log.error('updateData ' + e);
    }
};
