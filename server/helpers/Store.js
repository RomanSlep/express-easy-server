const room = require('./room');
module.exports = {
    players: {},
    rooms: {}
};
Object.assign(module.exports, room);
module.exports.createRoom();

