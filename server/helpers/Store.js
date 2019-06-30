const {
    usersDb,
    transDb,
    gamesDb
} = require('../modules/DB');
const $u = require('./utils');

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
                        score: u.score,
                        login: u.login
                    };
                });
            this.totalRatings.sort((b, a) => a.score - b.score);
        };
    },
    getRatingFromLogin(login) {
        return this.totalRatings.findIndex(u => u.login === login) + 1;
    },
    async updatePrise(){
        const prize = (await gamesDb.db.syncFind({
            isWin: false
        })).reduce((sum, g) => {
            return sum + g.bet;
        }, 0);

        this.totalPrize = $u.round(prize);
    }
};

Store.updateTotalRating();
Store.updatePrise();
setInterval(() => {
    Store.updateTotalRating();
}, 60 * 1000);