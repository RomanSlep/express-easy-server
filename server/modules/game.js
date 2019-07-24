const {POKER} = require('./poker');
const $u = require('../helpers/utils');

module.exports = function (players) {
    this.players = players;
    this.status = 'new';

    const deck = new POKER.Deck();
    deck.shuffle();
    $u.playersToArray(players).forEach(p=>{
        const cards = new POKER.Hand(deck.deal(2)).cards;
        p.cardsString = POKER.handToString(cards).split(' ');
    });
    this.commonCards = deck.deal(5);
    this.oppenedCards = this.commonCards.splice(0, 3);
};

module.exports.prototype.setCommonCard = function(){
    this.oppenedCards.push(this.commonCards.splice(0, 1));
};

module.exports.prototype.getWinners = function(){
    const hands = $u.playersToArray(this.players).map(p =>{
        const hand = POKER.handFromString((p.cardsString.join(' ') + ' ' + this.oppenedCards.join(' ')).trim());
        hand.login = p.user.login;
        return hand;
    });
    const winners = POKER.getWinners(hands).map(w=>{
        const details = w.getHandDetails().name;
        const player = this.players[w.login];
        return {player, details};
    });
    return winners;
};