const {usersDb, gamesDb} = require('../modules/DB');
let $u = {};
const config = require('../helpers/configReader');
const Store = module.exports = {
    totalRatings: [],
    totalPrize: 0,
    leftMatchTime: 0,
    async updateTotalRating() {
        const Users = await usersDb.db.syncFind();
        if (Users) {
            this.totalRatings = Users
                .filter(u => u.score)
                .map(u => {
                    return {
                        _id: u._id,
                        score: u.score,
                        login: u.login,
                        lvl: u.lvl
                    };
                });
            this.totalRatings.sort((b, a) => a.score - b.score);
        };
    },
    getRatingFromLogin(login) {
        return this.totalRatings.findIndex(u => u.login === login) + 1;
    },
    async updatePrise(){
        let prize = 0;
        (await gamesDb.db.syncFind({
            isActive: true,
            bet: {$gt: 0}
        })).forEach(g => {
            prize += g.bet;
            if (g.isWin){
                prize -= g.collected;
            }
        });

        this.totalPrize = $u.round(prize * config.percent_prize / 100);
        console.log('Total prize', this.totalPrize);
    }
};

setTimeout(()=>{
    $u = require('./utils');
    Store.updateTotalRating();
    Store.updatePrise();
}, 1000);

setInterval(() => {
    Store.updatePrise();
    Store.updateTotalRating();
}, 60 * 1000);
