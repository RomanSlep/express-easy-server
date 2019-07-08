const {
    usersDb,
    gameTransDb,
    gamesDb,
    depositsDb
} = require('./DB');
const $u = require('../helpers/utils');
const Store = require('../helpers/Store');

module.exports = async () => {
    const users = await usersDb.find({
        score: {$gt: 0}
    });
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const {deposit} = await $u.getGamesDepositAndScore(user._id);
        await depositsDb.db.syncInsert({user_id: user._id, amount: deposit, type: 'season'});
    }
    await Store.updatePrise();
    await Store.updateTotalRating();
    const prizer_1 = Store.totalRatings[0].login;
    const prizer_2 = Store.totalRatings[1].login;
    const prizer_3 = Store.totalRatings[2].login;
    console.log('Store.totalPrize', Store.totalPrize);
    const prize_1 = Math.round(Store.totalPrize / 2);
    const prize_2 = Math.round((Store.totalPrize - prize_1) / 1.5);
    const prize_3 = Math.round((Store.totalPrize - prize_1 - prize_2));
    console.log({prizer_1, prize_1});
    console.log({prizer_2, prize_2});
    console.log({prizer_3, prize_3});
    // gamesDb.remove({});
    // gameTransDb.remove({});
};

module.exports();