const {usersDb, storeDb} = require('../modules/DB');
const config = require('../helpers/configReader');
const $u = require('./utils');
const _ = require('underscore');

module.exports = {
    games: [],
    async init(){
        let system = await storeDb.findOne({});
        if (!system){
            system = new storeDb({
                totalBank: config.totalBank,
                nextWinLine: config.winLine,
                winner: 'None'
            });
        }
        system.save();
        this.system = system;

        setInterval(() => {
            this.clearOldGames();
        }, 15 * 1000);
    },
    clearOldGames(){
        const t = $u.unix();
        this.games.forEach((g, i) => {
            if (t - g.t > 10 * 1000){
                this.games[i] = null;
            }
        });
        this.games = _.compact(this.games);
    },
    getGameByUserId(userId){
        return this.games.find(g=>g.userId === userId);
    },
    createGame(user){
        const {bet} = config;
        user.deposit -= bet;
        this.system.totalBank += bet;
        this.system.save();
        user.save();
        const game = {
            id: $u.unix(),
            start: $u.unix(),
            userId: user._id,
            t: $u.unix(),
            predScore: 0
        };
        this.games.push(game);
        return game;
    },
    removeGame(userId, isNotChangeWinLine){
        const i = this.games.findIndex(g=> g.userId === userId);
        this.games.splice(i, 1);
        const {system} = this;
        if (!isNotChangeWinLine && config.winLine < system.nextWinLine){
            system.nextWinLine -= config.backLine;
            system.nextWinLine = Math.max(config.winLine, system.nextWinLine);
        }
        system.save();
    }
};

module.exports.init();
