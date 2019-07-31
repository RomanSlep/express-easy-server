const {POKER} = require('./poker');
const $u = require('../helpers/utils');
const _ = require('underscore');
const config = require('../helpers/configReader');
const checkUserActionsProto = require('./userActions');
const Ranker = require('handranker');
let roomsApi = null;

module.exports = function (room_id, Store) {
    try {
        roomsApi = this.roomsApi = roomsApi || Store;
        Object.assign(this, {
            room: roomsApi.rooms[room_id],
            waitUserAction: {},
            status: 'wait',
            bblind: 0,
            sblind: 0,
            round: 0,
            gamers: {},
            gamersCards: {},
            gamersData: {}
        });
    } catch (e){
        console.log('Error new Game ', e);
    }
};

/**
 * @description завершить текущую и начать следующую игру в комнате;
 */

module.exports.prototype.nextGame = function(){
    const string = this.winners.reduce((s, w)=>{
        return `${s} ${w.login} (${w.details})`;
    }, '');

    this.waitUserAction = {
        login: string,
        action: 'winner',
        text: 'Winners: ',
        payload: JSON.stringify({winners: this.winners})
    };
    this.sendUserActionAndWait();
    const {room} = this;
    const room_id = room.id;
    const oppenedCards = this.oppenedCards;
    room.game = new module.exports(room_id);
    room.game.oppenedCards = oppenedCards;
    room.game.updateGamers();
    const countTakedPlaces = Object.keys(roomsApi.getRoomGamers(room_id)).length;
    if (room.game.status === 'wait' && countTakedPlaces >= config.minGamers){
        roomsApi.roomStartDelayBeforeGame(room_id);
    }
};
module.exports.prototype.start = function(){
    try {
        this.gamers = $u.clone(roomsApi.getCompactPlaces(this.room.id));
        this.oppenedCards = []; // сбрасываем
        const {room} = this;
        this.status = 'preflop';
        this.updateGamers();
        if (!this.room.dealer){
            roomsApi.updateDealer(room.id);
        } else {
            room.dealer = this.getNextGamer(room.dealer);
        }
        this.waitUserAction = {
            login: this.getNextGamer(room.dealer),
            action: 'smallBlind',
            text: 'Wait small blind'
        };
        this.sendUserActionAndWait();
    } catch (e){
        console.log('Error Create game ' + e);
    }
};

module.exports.prototype.getBank = function(){
    return $u.playersToArray(this.gamers || {}).reduce((s, g) =>{
        return s + this.gamersData[g].totalBet;
    }, 0);
};
/**
 * @description возвращает логин следующего игрока
 * @return {string} 'Vasya'
 */
module.exports.prototype.getNextGamer = function(login){
    login = login || this.waitUserAction.login;
    try {
        const gamers = this.gamersInGame();
        const logins = Object.keys(gamers);
        const pos = logins.findIndex(l=> l === login);
        let nextUserLogin;
        if (pos === logins.length - 1){
            nextUserLogin = logins[0];
        } else {
            nextUserLogin = logins[pos + 1] || logins[0]; // если последний
        }
        // console.log({login, place, gamers, pos, nextUserLogin});
        return nextUserLogin;
    } catch (e){
        console.log('Error game.getNextGamer ', e);
    }
},
/**
 * @description игроки за столом и не вышедшие из игры
 * @return {object} {'Dev': {...}, 'Vasya': {...}
 */
module.exports.prototype.gamersInGame = function () {
    const activeGamers = {};
    const gamers = this.gamersData;
    Object.keys(gamers).forEach(login => {
        if (!gamers[login].isFold){
            activeGamers[login] = gamers[login];
        }
    });
    return activeGamers;
},
module.exports.prototype.setCards = function(){
    try {
        const gamers = this.gamersInGame();
        const deck = new POKER.Deck();
        deck.shuffle();
        for (let l in gamers){
            const cards = new POKER.Hand(deck.deal(2)).cards;
            const cardsString = POKER.handToString(cards).split(' ');
            this.gamersCards[l] = cardsString;
            // отдаем юзеру его карты
            this.room.players[l].socket.emit('uCards', {cards: cardsString});
        }
        this.commonCards = POKER.handToString(new POKER.Hand(deck.deal(config.commonCards)).cards).split(' ');
        this.oppenedCards = [];
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
        if (g.totalBet > maxBet) {
            maxBet = g.totalBet;
            login = g.login;
        }
    });
    return {maxBet, login};
};
module.exports.prototype.setCommonCard = function(){
    let count = 1;
    if (!this.oppenedCards.length){
        count = config.oppenedCards;
    }
    this.oppenedCards = this.oppenedCards.concat(this.commonCards.splice(0, count));
    console.log(' this.oppenedCards', this.oppenedCards);
};


module.exports.prototype.getWinners = function(){
    try {
        var board = this.oppenedCards;
        const hands_ = Object.keys(this.gamersInGame()).map(l =>{
            console.log(l, this.gamersCards[l]);
            return {cards: this.gamersCards[l], id: l};
        });

        const winner = Ranker.orderHands(hands_, board)[0][0];
        const winners = [{login: winner.id, details: winner.description, cards: this.gamersCards[winner.id]}];
        this.winners = winners;

        return winners;
    } catch (e){
        console.log('Error game.getWinners ', e);
    }
};
/**
 * @description аплейтит game.usersData (Dev: {...})
 */
module.exports.prototype.updateGamers = function () {
    try {
        console.log('Update', this.gamers);
        Object.keys(this.gamers).forEach(place => {
            const login = this.gamers[place];
            this.gamersData[login] = this.gamersData[login] || {
                login,
                totalBet: 0,
                round: 0,
                place
            };
        });
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
    // console.log('waitNextAction', this.waitUserAction);
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
            const nextLogin = this.getNextGamer(this.waitUserAction.login || room.dealer);
            this.waitUserAction.login = nextLogin;
            cb();
        };

        this.waitNextActionTimeOut = setTimeout(decorator, (config.waitUserActionSeconds + 2) * 1000);
        roomsApi.emitUpdateRoom({
            room,
            data: {
                event: this.waitUserAction.action,
                msg: this.waitUserAction.text + ' ' + this.waitUserAction.login,
                timer: config.waitUserActionSeconds,
                payload: this.waitUserAction.payload
            }
        });
    } catch (e){
        console.log('Error game.waitNextAction ', e);
    }
};

/**
 * @description Поднимаем изза стола просравшего очередь.
 */
module.exports.prototype.removeGamer = function (login) {
    try {
        if (!this.gamers){
            return;
        }
        const place = $u.getKeyByValue(this.gamers, login); // удаляем просравшего очередь
        delete this.room.places[place];
        if (this.room.dealer === login){
            this.room.dealer = null;
        }
        this.room.players[login].isPlaced = false;
        this.updateGamers();
    } catch (e){
        console.log('Error game.waitNextAction ', e);
    }
};

Object.assign(module.exports.prototype, checkUserActionsProto);
