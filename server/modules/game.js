const {POKER} = require('./poker');
const $u = require('../helpers/utils');
const _ = require('underscore');
const config = require('../helpers/configReader');

module.exports = function (room_id) {
    try {
        const Store = require('../helpers/Store');
        this.room_id = room_id;
        this.room = Store.rooms[room_id];
        this.status = 'new';
        if (!this.room.diler){
            Store.updateDiler(room_id);
        } else {
            this.room.diler = Store.getNextGamer(room_id, this.room.diler);
        }
        this.waitUserAction = {
            login: Store.getNextGamer(room_id, this.room.diler),
            action: 'waitSmallBlind',
            text: 'Wait small blind'
        };
        const handlerSmallBlind = ()=>{
            Store.emitUpdateRoom({room: this.room, data: {event: 'restartGame', msg: 'Wait small blind from ' + this.waitUserAction.login}});
            this.waitNextAction(handlerSmallBlind);
        };
        this.waitNextAction(handlerSmallBlind);
    } catch (e){
        console.log('Error create game ' + e);
    }
};


module.exports.prototype.gamers = function(){
    const Store = require('../helpers/Store');
    return $u.playersToArray(Store.getRoomGamers(this.room_id));
};
module.exports.prototype.setCards = function(){
    const deck = new POKER.Deck();
    deck.shuffle();
    this.gamers().forEach(p=>{
        const cards = new POKER.Hand(deck.deal(2)).cards;
        p.cardsString = POKER.handToString(cards).split(' ');
    });

    this.commonCards = POKER.handToString(new POKER.Hand(deck.deal(5)).cards).split(' ');
    this.oppenedCards = this.commonCards.splice(0, 3);
};
module.exports.prototype.setCommonCard = function(){
    this.oppenedCards.push(this.commonCards.splice(0, 1));
};

module.exports.prototype.getWinners = function(){
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
};

module.exports.prototype.waitNextAction = function (cb) {
    if (this.waitNextActionTimeOut) {
        clearTimeout(this.waitNextActionTimeOut);
    }
    const Store = require('../helpers/Store');
    const {room_id} = this;
    const decorator = () => {
        const nextLogin = Store.getNextGamer(room_id, this.waitUserAction.login || this.room.diler);

        const place = $u.getKeyByValue(this.room.places, this.waitUserAction.login); // удаляем просравшего очередь
        this.room.places[place] = null;

        this.waitUserAction.login = nextLogin;

        if (Object.keys(Store.getCompactPlaces(room_id)).length < config.minGamers){
            const msg = 'Small blind sailent. And count users < ' + config.minGamers;
            Store.resetGame(room_id, msg);
            console.log('Reset game!!', msg);
            return;
        }
        cb();
    };

    this.waitNextActionTimeOut = setTimeout(decorator, config.waitUserActionSeconds * 1000);
};

