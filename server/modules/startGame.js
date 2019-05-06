const {
    transDb,
    gamesDb
} = require('./DB');
const $u = require('../helpers/utils');

module.exports = async (User, params) => {
    params.countBombs = Number(params.countBombs);
    // Проверки:
    let msg = false;
    if (User.deposit < params.bet) {
        msg = 'No deposit!';
    }

    if (params.countBombs < 1 || params.countBombs > 24) {
        msg = 'No valid count cells!';
    }
    //TODO: Проверить что есть незаконченный матч
    const noFinished = await gamesDb.syncFindOne({
        $and: [{
            user_id: User._id
        }, {
            isGame: true
        }]
    });
    if (noFinished) {
        msg = 'You have no finished game!';
    }
    if (msg) {
        return {
            res: false,
            msg
        };
    }

    transDb.insert({
        user_id: User._id,
        amount: -params.bet,
        isTest: true
    }, () => {
        User.updateDeposit();
    });
    // создаем матч
    const game = {
        bet: params.bet,
        countBombs: params.countBombs,
        user_id: User._id,
        cellsBomb: createBombs(params.countBombs),
        clickedCells: [],
        collected: 0, // сколько выиграно в матче 
        waitNumberCell: null,
        steps: {},
        stepLastNum: 0, // номер последнего шага по очередности нажатия
        lastCell: 0, // номер последнего шага по очередности нажатия
        isGame: true,
        unixStart: new Date().getTime()
    };

    $u.prizes(game);
    const newGame = await gamesDb.syncInsert(game);
    return {
        res: newGame,
        game: $u.filterGame(newGame),
        msg: 'Code error 2!'
    };
};

function createBombs(countBombs) {
    let count = countBombs;
    let isCurrent = true;
    if (countBombs > 14) {
        isCurrent = false;
        count = 25 - countBombs;
    }
    let arrBombs = [];
    const rndArr = getRndArray(25);
    while (arrBombs.length < count) {
        let posLow = rndArr.shift();
        let posTop = posLow;
        const length = arrBombs.length;
        while (arrBombs.length === length) {
            if (!arrBombs.includes(posTop)) {
                arrBombs.push(posTop);
                continue;
            }
            if (!arrBombs.includes(posLow)) {
                arrBombs.push(posLow);
            }
            posTop++;
            posLow--;
        }
    }

    if (!isCurrent) { // обернуть массив
        const invertArray = [];
        for (let c = 0; c < 25; c++) {
            if (!arrBombs.includes(c)) {
                invertArray.push(c);
            }
        }
        arrBombs = invertArray;
    }
    // while (arrBombs.length < count) {
    //     const pos = +(Math.random() * 24).toFixed(0);
    //     if (!arrBombs.includes(pos)) {
    //         arrBombs.push(pos);
    //     }
    // };
    return arrBombs;
}

function getRndArray(max) {
    const rnd = Math.round(Math.random() * 100).toFixed(0); // Пришедшее из рандомайзера от 0 до 100
    const randoms = String(rnd / new Date().getTime() * 10000000000000000).replace('.', '');
    let i = 0;
    const arr = [];
    while (randoms[i + 1]) {
        const rnd = Math.round((randoms[i] + randoms[i + 1]) / (100 / max));
        arr.push(rnd);
        i++;
    }
    return arr;
}
