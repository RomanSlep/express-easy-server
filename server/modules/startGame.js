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
    const noFinished = await gamesDb.syncFindOne({$and: [{user_id: User._id}, {isGame: true}]});
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
        isGame: true
    };

    $u.prizes(game);
    const newGame = await gamesDb.syncInsert(game);
    return {
        res: newGame,
        game: $u.filterGame(newGame),
        msg: 'Code error 2!'
    };
};

function createBombs(count) {
    const arrBombs = [];
    while (arrBombs.length < count) {
        const pos = +(Math.random() * 24).toFixed(0);
        if (!arrBombs.includes(pos)) {
            arrBombs.push(pos);
        }
    };
    return arrBombs;
}