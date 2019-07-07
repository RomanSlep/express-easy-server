const {
    gamesDb,
    transDb
} = require('./DB');
const $u = require('../helpers/utils');
const config = require('../helpers/configReader');

module.exports = async (user, params) => {
    let game = await gamesDb.findOne({
        $and: [{
            _id: params.game_id
        }, {
            user_id: user._id
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
            await step(game, params, user);
        }
        if (params.isPickUpWinnings) {
            await pickUpWinnings(user, game, params);
        }
    }

    return {
        res: !msg,
        msg,
        game: game.isGame ? $u.filterGame(game) : game
    };
};


async function step(game, params, user) {
    const cell = params.cell;
    game.clickedCells.push(cell);
    game.lastCell = cell;

    const step = game.steps[cell] = {};
    if (game.cellsBomb.includes(cell)) {
        step.status = 'b';
        game.isGame = false;
        game.isWin = false;
    } else {
        step.status = 'o';
        game.stepLastNum++;
        $u.prizes(game);
        // ДРОПЫ
        const isDrop = mathDrops(user, game, cell, step);
        if (isDrop) {
            await user.updateData();
            console.log('isDrop!User saved');
        }
    }
    await game.save();
};

async function pickUpWinnings(user, game) {
    game.isGame = false;
    game.isWin = Boolean(game.collected);
    await updateLvl(user, game);
    await game.save();

    if (game.isWin) {
        transDb.insert({
            user_id: user._id,
            amount: game.collected || 0,
            game_id: game._id,
            isTest: true
        }, () => {
            user.updateData();
        });
    }
}

async function updateLvl(user, game) {
    const exp = Math.round(game.collected / game.bet * 100);
    await $u.updateExp(user, exp, true);
}

function mathDrops(user, game, cell, step) {
    game.needUpdateUser = true;
    const expDrop = $u.dropExp(user, game);
    if (expDrop) {
        step.status = 'exp';
        game.drops[cell] = {
            type: 'exp',
            value: expDrop
        };
        return true;
    }

    const scrDrop = $u.dropScore(user, game);
    if (scrDrop) {
        step.status = 'scr';
        game.drops[cell] = {
            type: 'scr',
            value: scrDrop
        };
        return true;
    }
    game.needUpdateUser = false;
    return false;
}
