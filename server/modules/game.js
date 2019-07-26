const {POKER} = require('./poker');
const $u = require('../helpers/utils');
const _ = require('underscore');
const config = require('../helpers/configReader');
const checkUserActionsProto = require('./userActions');

let roomsApi = null;
module.exports = function (room_id, Store) {
    try {
        roomsApi = this.roomsApi = roomsApi || Store;
        this.room = roomsApi.rooms[room_id];
        this.waitUserAction = {};
        this.status = 'wait';
        this.flopped = []; // вышедшие из игры
        this.bblind = 0;
        this.sblind = 0;
        this.gamersData = {};
    } catch (e){
        console.log('Error new Game ', e);
    }
};

module.exports.prototype.start = function(){
    try {
        const {room} = this;
        this.status = 'new';
        this.updateGamers();
        if (!this.room.diler){
            roomsApi.updateDiler(room.id);
        } else {
            room.diler = this.getNextGamer(room.diler);
        }
        this.waitUserAction = {
            login: this.getNextGamer(room.diler),
            action: 'smallBlind',
            text: 'Wait small blind'
        };
        this.sendUserActionAndWait();
    } catch (e){
        console.log('Error Create game ' + e);
    }
};

module.exports.prototype.getBank = function(){
    return this.sblind + this.bblind;
};
module.exports.prototype.getNextGamer = function(login){
    login = login || this.waitUserAction.login;
    try {
        const {gamers} = this;
        const place = $u.getKeyByValue(gamers, login);
        const keysArray = Object.keys(gamers)
            .filter(p=> !this.flopped.includes(gamers[p]));
        const pos = keysArray.findIndex(p=> p === place);
        let nextUserLogin;
        if (pos === keysArray.length - 1){
            nextUserLogin = gamers[Object.keys(gamers)[0]];
        } else {
            nextUserLogin = gamers[keysArray[pos + 1]];
        }
        console.log({place, gamers, pos, nextUserLogin});
        return nextUserLogin;
    } catch (e){
        console.log('Error game.getNextGamer ', e);
    }
},
module.exports.prototype.setCards = function(){
    try {
        const deck = new POKER.Deck();
        deck.shuffle();
        this.gamers.forEach(p=>{
            const cards = new POKER.Hand(deck.deal(2)).cards;
            p.cardsString = POKER.handToString(cards).split(' ');
        });

        this.commonCards = POKER.handToString(new POKER.Hand(deck.deal(5)).cards).split(' ');
        this.oppenedCards = this.commonCards.splice(0, 3);
    } catch (e){
        console.log('Error game.setCards ', e);
    }
};
/**
 * @description получаем самую большую ставку за столом
 */
module.exports.prototype.getCurrentMaximalBet = function () {
    let maxBet = 0;
    let login = '';
    $u.playersToArray(this.gamersData).forEach(g => {
        if (g.bets > maxBet) {
            maxBet = g.totalBet;
            login = g.login;
        }
    });
    return {maxBet, login};
};
module.exports.prototype.setCommonCard = function(){
    this.oppenedCards.push(this.commonCards.splice(0, 1));
};


module.exports.prototype.getWinners = function(){
    try {
        const hands = $u.playersToArray(this.gamers).map(p =>{
            const hand = POKER.handFromString((p.cardsString.join(' ') + ' ' + this.oppenedCards.join(' ')).trim());
            hand.login = p.user.login;
            return hand;
        });
        const winners = POKER.getWinners(hands).map(w=>{
            const details = w.getHandDetails().name;
            const player = this.gamers[w.login];
            return {player, details};
        });
        return winners;
    } catch (e){
        console.log('Error game.getWinners ', e);
    }
};

module.exports.prototype.updateGamers = function () {
    try {
        this.gamers = $u.clone(roomsApi.getCompactPlaces(this.room.id));
        if (_.isEmpty(this.gamersData)){
            $u.playersToArray(this.gamers).forEach(g=>{
                console.log({g});
                this.gamersData[g] = {
                    login: g,
                    totalBet: 0
                };
            });
        }
        console.log('Update gamers', this.room.places, this.gamers);
    } catch (e){
        console.log('Error game.updateGamers ', e);
    }
};
module.exports.prototype.sendUserActionAndWait = function(){
    const handler = ()=>{
        this.waitNextAction(handler);
    };
    this.waitNextAction(handler);
};
module.exports.prototype.waitNextAction = function (cb) {
    console.log('waitNextAction', this.waitUserAction);
    try {
        if (this.waitNextActionTimeOut) {
            clearTimeout(this.waitNextActionTimeOut);
        }
        const {room} = this;
        const room_id = room.id;
        const decorator = () => {
            // if (this._waitCounter){
                this.removeGamer(this.waitUserAction.login);
            // }
            if (Object.keys(this.gamers).length < config.minGamers){
                const msg = 'Time out ' + this.waitUserAction.login + ' ' + this.waitUserAction.text;
                roomsApi.resetGame(room_id, msg);
                console.log('Reset game!!', msg);
                return;
            }
            const nextLogin = this.getNextGamer(this.waitUserAction.login || room.diler);
            this.waitUserAction.login = nextLogin;
            cb();
        };

        this.waitNextActionTimeOut = setTimeout(decorator, (config.waitUserActionSeconds + 2) * 1000);
        roomsApi.emitUpdateRoom({
            room,
            data: {
                event: this.waitUserAction.action,
                msg: this.waitUserAction.text + ' ' + this.waitUserAction.login,
                timer: config.waitUserActionSeconds
            }
        });
    } catch (e){
        console.log('Error game.waitNextAction ', e);
    }
};

module.exports.prototype.removeGamer = function (login) {
    try {
        if (!this.gamers){
            return;
        }
        const place = $u.getKeyByValue(this.gamers, login); // удаляем просравшего очередь
        this.room.places[place] = null;
        if (this.room.diler === login){
            this.room.diler = null;
        }
        this.room.players[login].isPlaced = false;
        this.updateGamers();
    } catch (e){
        console.log('Error game.waitNextAction ', e);
    }
};

Object.assign(module.exports.prototype, checkUserActionsProto);
