const clone = require('clone');
const {usersDb, gamesDb, gameTransDb, depositsDb} = require('../../modules/DB');
const drops = require('./drops');
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
    async getNofinishGame(user) {
        return await gamesDb.db.syncFindOne({
            $and: [{
                user_id: user._id
            }, {
                isGame: true
            }]
        });
    },
    prizes(params) { // абсолютный размер множителя
        const {
            countBombs,
            bet,
            stepLastNum
        } = params;
        // const steps = 24 - countBombs;
        // const P = 1 / (25 / countBombs) * 100; // вероятность нарваться
        // const countStepsBE = Math.round(66 / P * countBombs); // шагов безубытка
        // const countStepsBE = Math.round(steps * 0.66); // шагов безубытка
        let countStepsBE = 19;
        if (countBombs === 3) {
            countStepsBE = 6;
        }
        if (countBombs === 5) {
            countStepsBE = 4;
        }
        if (countBombs === 10) {
            countStepsBE = 2;
        }
        if (countBombs === 20) {
            countStepsBE = 1;
        }
        let countMult = 0;
        let i = 0;
        while (countStepsBE >= i) {
            countMult += i * countBombs;
            i++;
        }

        let m = bet / countMult; // один множитель
        if (countBombs === 20) {
            m = bet / countBombs * 1.5;
        }
        let result = 0;
        // считаем текущий и следующий призы
        let next, p = 0,
            collected = 0;
        // let str = '';
        while (stepLastNum > p - 2) {
            collected = result;
            result += countBombs * m * p++;
            next = result;
        }

        params.nextPrize = +next.toFixed(3);
        params.collected = +collected.toFixed(3);
    },
    filterGame(game) {
        if (!game) {
            return game;
        }
        game = clone(game);
        game.cellsBomb = null;
        return game;
    },
    async updateExp(user, exp, needSave) {
        if (!exp){
            console.log('Error apdate exp, ', exp);
            return;
        }
        const nextLvlExp = config.levels[user.lvl + 1];
        if (user.exp + exp >= nextLvlExp) { // апаем левел
            user.lvl++;
            user.leftStatPoints++;
            user.exp = user.exp + exp - nextLvlExp;
            if (user.lvl > 3){
                user.isActive = true;
            }
        } else {
            user.exp += exp;
        }
        user.exp = Math.round(user.exp);
        if (needSave) {
            await user.save();
        }
    },
    /**
     * @description Получение суммарного депозита за игры (ставки + выигрыши)
     * @param {string} user_id
     * @returns {deposit, score}
     */
    async getGamesDepositAndScore(user_id){
        let deposit = 0;
        let score = 0;
        (await gameTransDb.db.syncFind({user_id})).forEach(t => { // по играм в текущем сезоне
            if (t.amount > 0){
                score += t.amount;
            }
            deposit += t.amount;
        });
        return {deposit, score};
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
    async getDropsScores(user_id){
        let score = 0;
        (await gamesDb.db.syncFind({user_id, dropedScores: {$gt: 0}})).forEach(g =>{ // дропы очков
            score += g.dropedScores;
        });
        return score;
    },
    async createUser(params){
        const user = new usersDb({
            _id: params.address,
            address: params.address,
            login: params.login,
            password: sha256(params.password.toString()),
            deposit: config.regDrop,
            score: 0,
            lvl: 1,
            exp: 0,
            leftStatPoints: 0, // очки статистики
            stats: config.defaultStatPers,
            isActive: false
        });
        await user.save();
        depositsDb.db.syncInsert({user_id: user._id, amount: config.regDrop, type: 'regdrop'});
        return user;
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
Object.assign(module.exports, drops);
