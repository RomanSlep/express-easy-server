const {
    gamesDb
} = require('./DB');
const $u = require('../helpers/utils');

module.exports = async (User, params) => {
    const game = await gamesDb.syncFindOne({
        $and: [{
            _id: params.game_id
        }, {
            user_id: User._id
        }]
    });

    let msg = false;

    if (!game) {
        msg = 'Game no found!';
    } else if (!game.isGame) {
        msg = 'Game was finished!';
    } else if (game.steps[params.cell]) {
        msg = 'This step exist!';
    } else { // делаем шаг!
        await step(game, params);
    }

    return {
        res: !msg,
        msg,
        game: $u.filterGame(game)
    };
};


async function step(game, params) {
    const cell = params.cell;
    game.clickedCells.push(cell);

    const step = game.steps[cell] = {};

    if (game.cellsBomb.includes(cell)) {
        step.status = 'b';
        game.isGame = false;
    } else {
        step.status = 'o';
        game.stepLastNum++;
        $u.prizes(game);
    }

    gamesDb.update({
        _id: game._id
    }, game, (err, res) => {
        console.log('SAVED: ', res);
    });

};