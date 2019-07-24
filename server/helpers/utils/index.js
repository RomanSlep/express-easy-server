const clone = require('clone');
const {usersDb, gamesDb, gameTransDb, depositsDb} = require('../../modules/DB');
const config = require('../../helpers/configReader');
const sha256 = require('sha256');

module.exports = {
    async getUserFromQ (q){
        const user = await usersDb.findOne(q);
        return user;
    },
    filterGame(game) {
        if (!game) {
            return game;
        }
        game = clone(game);
        game.cellsBomb = null;
        return game;
    },
    async createUser(params){
        const user = new usersDb({
            _id: params.address,
            address: params.address,
            login: params.login,
            password: sha256(params.password.toString()),
            balance: config.regDrop
        });

        await user.save();
        new depositsDb({user_id: user._id, amount: config.regDrop, type: 'regdrop'}, true);

        return user;
    },
    async createGame(){

    },
    clone,
    clear(obj){
        const newObj = {};
        Object.keys(obj).forEach(key=>{
            if (key === 'db' || key === 's'){
                return;
            }
            newObj[key] = obj[key];
        });
        return newObj;
    },
    round(n) {
        return Number(n.toFixed(0));
    },
    unix(){
        return new Date().getTime();
    },
    playersToArray(players){
        return Object.keys(players).map(login => players[login]);
    },
    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }
};
