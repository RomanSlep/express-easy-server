const room = require('./room');
module.exports = {
    players: {},
    rooms: {},
    removePlayer(player){
        delete this.rooms[player.room_id].players[player.user.login];
        delete this.players[player.user.login];
        // console.log('RemovePlayer', this.rooms);
    }
};
Object.assign(module.exports, room);
module.exports.createRoom();

