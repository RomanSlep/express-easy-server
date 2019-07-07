const clone = require('clone');
const {gamesDb} = require('../../modules/DB');
const drops = require('./drops');
const config = require('../../helpers/configReader');

module.exports = {
    clone,
    round(n) {
        return Number(n.toFixed(4));
    },
    sound(name, v = 0.2) {
        const s = new Audio('assets/sounds/' + name + '.mp3');
        s.play();
        s.volume = v;
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
        let countStepsBE = 18;
        if (countBombs === 3) {
            countStepsBE = 5;
        }
        if (countBombs === 5) {
            countStepsBE = 3;
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
            m = bet / countBombs * 2;
        }
        let result = 0;
        // считаем текущий и следующий призы
        let next, p = 0,
            collected = 0;
        // let str = '';
        while (stepLastNum > p - 2) {
            collected = result;
            // str += `
            // ` + p + ' ' + collected.toFixed(8);
            result += countBombs * m * p++;
            next = result;
        }
        // console.log(str);

        params.nextPrize = this.round(next);
        params.collected = this.round(collected);
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
        } else {
            user.exp += exp;
        }
        user.exp = Math.round(user.exp);
        if (needSave) {
            await user.save();
        }
    }
};

Object.assign(module.exports, drops);
// console.log(module.exports.prizes({ // абсолютный размер множителя
//     countBombs: 10,
//     bet: 10,
//     stepLastNum: 24
// }));
