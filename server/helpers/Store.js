const $u = require('../helpers/utils');

module.exports = {
    players: {},
    rooms: {},
    removePlayer(player){
        delete this.rooms[player.room_id].players[player.user.login];
        delete this.players[player.user.login];
        console.log('RemovePlayer', this.rooms);
    },
    createRoom(){
        const room_id = $u.unix();
        const room = {id: room_id, players: {}, game: {}};
        this.rooms[room_id] = room;
        // console.log('CreateRoom', this.rooms);
        return room;
    },
    removeRoom(room_id){
        delete this.rooms[room_id];
        // console.log('RemoveRoom', this.rooms);
    },
    setPlayerToRoom(room_id, player){
        player.room_id = room_id;
        this.rooms[room_id].players[player.user.login] = player;
        console.log('setPlayerToRoom', this.rooms);
    }
};
module.exports.createRoom();

