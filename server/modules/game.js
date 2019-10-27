const Store = require('../helpers/Store');
const config = require('../helpers/configReader');
const log = require('../helpers/log');
const $u = require('../helpers/utils');

module.exports = {
    async startGame(user) {
        if (Store.getGameByUserId(user._id)) {
            return {success: false, msg: 'Не завершена предыдущая игра!'};
        }
        if (user.deposit < config.bet){
            return {success: false, msg: `Не достаточно средств. Ставка ${config.bet} ${config.coinName}!`};
        }
        const game = await Store.createGame(user);

        return {success: true, t: game.t, id: game.id};
    },
    loseGame(user, data){
        Store.removeGame(user._id);
    },
    async checkGame(user, data){
        try {
            const hack = {success: false, msg: 'Мамкин хацкер детектед!'};
            const game = await Store.getGameByUserId(user._id);
            if (!game){
                log.error('checkGame: checkGameCode 2');
                return {success: false, msg: 'Возможно у Вас проблемы с интернетом!'};
            }

            if (game.t !== data.t){
                log.error('checkGame: T !== T');
                return hack;
            }

            if (game.id !== data.id){
                log.error('checkGame: Id !== Id');
                return hack;
            }

            if (data.status <= game.status){
                log.error('checkGame: STATUS');
                return hack;
            }
            game.status = data.status;
            game.t = $u.unix();
            const prise = this.checkWin(user, game);
            if (!prise){
                return {success: true, t: game.t, id: game.id};
            }
            // WINNER
            Store.removeGame(user._id);
            return {success: true, isWin: true, prise};
        } catch (e){
            log.error('checkStatus: ' + e);
        }
    },
    checkWin(user, game) {
        const {system} = Store;
        if (game.status < system.nextWinLine) {
            return false;
        }
        // WINNER
        const prise = parseInt(system.totalBank / 2);
        system.update({
            totalBank: prise,
            nextWinLine: system.nextWinLine + config.winLine / 5,
            winner: user.login
        }, true);
        user.deposit += prise;
        user.save();
        return prise;
    }
};
