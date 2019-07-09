const {
    usersDb,
    gameTransDb,
    gamesDb,
    depositsDb,
    seasonsDb
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
    const prizer_1 = Store.totalRatings[0]._id;
    const prizer_2 = Store.totalRatings[1]._id;
    const prizer_3 = Store.totalRatings[2]._id;
    console.log('Store.totalPrize', Store.totalPrize);
    const prize_1 = Math.round(Store.totalPrize / 2);
    const prize_2 = Math.round((Store.totalPrize - prize_1) / 1.5);
    const prize_3 = Math.round((Store.totalPrize - prize_1 - prize_2));
    const data = $u.unix() - 600 * 1000;
    seasonsDb.db.insert({prizer_1, prize_1, prizer_2, prize_2, prizer_3, prize_3, data});
    await depositsDb.db.syncInsert({user_id: prizer_1, amount: prize_1, type: 'winner_1', data});
    await depositsDb.db.syncInsert({user_id: prizer_2, amount: prize_2, type: 'winner_2', data});
    await depositsDb.db.syncInsert({user_id: prizer_3, amount: prize_3, type: 'winner_3', data});
    gamesDb.db.remove({});
    gameTransDb.db.remove({});
};

// module.exports();
// TODO: cron