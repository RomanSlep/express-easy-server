const clone = require('clone');
const config = require('../config');

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
        let countStepsBE = 20;
        if (countBombs === 3) {
            countStepsBE = 8;
        }
        if (countBombs === 5) {
            countStepsBE = 6;
        }
        if (countBombs === 10) {
            countStepsBE = 4;
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
        params.nextPrize = this.round(next * (config.martin || 1));
        params.collected = this.round(collected);
    },
    filterGame(game) {
        if (!game) {
            return game;
        }
        game = clone(game);
        game.cellsBomb = null;
        return game;
    }
};


// console.log(module.exports.prizes({ // абсолютный размер множителя
//     countBombs: 10,
//     bet: 10,
//     stepLastNum: 24
// }));