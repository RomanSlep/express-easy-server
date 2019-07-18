const config = require('../helpers/configReader');
const request = require('request');
const {depositsDb} = require('./DB');
const $u = require('../helpers/utils');

const txsCash = {};
// ,https://explorer-api.minter.network/api/v1/addresses/Mxfdfc236848d445e754b6660bec98a046ac59b5cd/transactions?page=1
setInterval(() => {
    request('https://explorer-api.minter.network/api/v1/addresses/' + config.gameMinterAddress + '/transactions?page=1', (err, res, body) => {
        try {
            const txs = JSON.parse(body).data;
            txs.forEach(async tx => {
                // проверяем транзу по hash
                const {hash} = tx;
                if (txsCash[hash]){
                    return;
                }
                txsCash[hash] = 1;
                if (tx.data.coin !== 'ARTIFACTS'){
                    return;
                }
                console.log('New TX', tx);
                const isHas = await depositsDb.db.syncFindOne({hash});
                if (isHas){
                    console.log('Has tx in DB', hash);
                    return;
                }
                const user = await $u.getUserFromQ({address: tx.from});
                if (!user){
                    console.log('Cant find user!', hash);
                    return;
                }
                await depositsDb.db.insert({hash, user_id: user._id, type: 'deposit', amount: +tx.data.value});
                await user.updateData();
                console.log('newDeposit', {hash, user_id: user._id, type: 'deposit', amount: +tx.data.value});
            });

        } catch (e) {
            console.log('Error TX parser! ' + e);
        }
    });
}, 10 * 1000);