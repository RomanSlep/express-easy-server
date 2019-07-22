const $u = require('../helpers/utils');
const Game = require('../modules/game');

module.exports = {
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
        const room = this.rooms[room_id];
        player.room_id = room_id;
        room.players[player.user.login] = player;
        this.emitUpdateRoom({
            room,
            data: {
                event: 'addPlayer',
                data: player.user.login
            }
        });
    // console.log('setPlayerToRoom', this.rooms);
    },
    startGameInToRoom(room_id){
        const room = this.rooms[room_id];
        room.game = new Game(room.players);
        this.emitUpdateRoom({
            room,
            data: {
                event: 'gameStarted',
                data: {}
            }
        });
    },
    emitUpdateRoom(req){
        $u.playersToArray(req.room.players).forEach(p=>{
            p.socket.emit(req.data.event, req.data.data);
        });
    }
};
