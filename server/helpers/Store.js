const room = require('./room');
module.exports = {
    players: {},
    rooms: {}
};
Object.assign(module.exports, room);
module.exports.createRoom({
    blind: 2,
    minDeposit: 1 * 10,
    maxDeposit: 1 * 10000,
});

