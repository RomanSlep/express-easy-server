const {
    gamesDb,
    transDb
} = require('./DB');
const $u = require('../helpers/utils');

module.exports = async (User, params) => {
    let game = await gamesDb.findOne({
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
        if (params.isStep) {
            await step(game, params, User);
        }
        if (params.isPickUpWinnings) {
            await pickUpWinnings(User, game, params);
        }
    }

    return {
        res: !msg,
        msg,
        game: game.isGame ? $u.filterGame(game) : game
    };
};


async function step(game, params, User) {
    const cell = params.cell;
    game.clickedCells.push(cell);
    game.lastCell = cell;

    const step = game.steps[cell] = {};
    if (game.cellsBomb.includes(cell)) {
        step.status = 'b';
        game.isGame = false;
        game.isWin = false;
        User.updateScore(-game.bet);
        await User.save();
    } else {
        step.status = 'o';
        game.stepLastNum++;
        $u.prizes(game);
    }
    game.save();
};

async function pickUpWinnings(User, game) {
    game.isGame = false;
    game.isWin = game.collected && true;
    User.updateScore(game.collected >= game.bet ? game.collected : 0);
    game.save();
    if (game.isWin){
        transDb.insert({
            user_id: User._id,
            amount: game.collected || 0,
            game_id: game._id,
            isTest: true
        }, () => {
            User.updateDeposit();
        });
    }
}
