const $u = require('../helpers/utils');
const Game = require('../modules/game');

module.exports = {
    createRoom(){
        const room_id = $u.unix();
        const room = {id: room_id, players: {}, places: {}, game: {}};
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
                data: {login: player.user.login}
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
    removePlayer(player){
        const room = this.rooms[player.room_id];
        const login = player.user.login;
        delete room.players[login];
        delete this.players[login];
        Object.keys(room.places).forEach(place=>{
            if (room.places[place] === login){
                room.places[place] = null;
            }
        });
        this.emitUpdateRoom({
            room,
            data: {
                event: 'userLeaveRoom',
                data: {login}
            }
        });
        // console.log('RemovePlayer', this.rooms);
    },
    userTakePlace(player, place){ // занимает место
        try {
            if (player.isPlaced){
                return;
            }
            const room = this.rooms[player.room_id];
            if (!room.places[place]){ // если свободно
                room.places[place] = player.user.login;
                player.isPlaced = true;
                this.emitUpdateRoom({
                    room,
                    data: {
                        event: 'userTakePlace',
                        data: {login: player.user.login, place}
                    }
                });
            }
        } catch (e){
            console.log('userTakePlace ' + e);
        }
    },
    userLeavePlace(player, place){ // занимает место
        try {
            const room = this.rooms[player.room_id];
            if (room.places[place] === player.user.login){ // если свободно
                room.places[place] = null;
                player.isPlaced = false;
                this.emitUpdateRoom({
                    room,
                    data: {
                        event: 'userLeavePlace',
                        data: {login: player.user.login, place}
                    }
                });
            }
        } catch (e){
            console.log('userLeavePlace ' + e);
        }
    },
    emitUpdateRoom(req) {
        req.data.room = prepRoom (req.room);
        setTimeout(() => {
            $u.playersToArray(req.room.players).forEach(p => {
                p.socket.emit('emitRoom', req.data);
            });
        }, 1000);
    }
};

function prepRoom(room) {
    const game = room.game;
    const preped = {
        id: room.id,
        places: room.places,
        game: game.status && {
            status: game.status,
            oppenedCards: game.oppenedCards
        } || null
    };
    return preped;
}