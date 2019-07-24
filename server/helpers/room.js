const $u = require('../helpers/utils');
const Game = require('../modules/game');
const _ = require('underscore');
const config = require('../helpers/configReader');

module.exports = {
    createRoom(){
        const room_id = $u.unix();
        const room = {id: room_id, players: {}, game: {status: 'wait'}, places: {}};
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
        this.emitUpdateRoom({room});
    // console.log('setPlayerToRoom', this.rooms);
    },
    startGameInToRoom(room_id){
        const room = this.rooms[room_id];
        room.game = new Game(room_id);
        this.emitUpdateRoom({room, data: {event: 'newGame', msg: 'Start new game!'}});
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
        this.emitUpdateRoom({room});
        // console.log('RemovePlayer', this.rooms);
    },
    userTakePlace(player, place){ // занимает место
        try {
            if (player.isPlaced){
                return;
            }
            const {room_id} = player;
            const room = this.rooms[room_id];
            if (!room.places[place]){ // если свободно
                room.places[place] = player.user.login;
                player.isPlaced = true;
                this.emitUpdateRoom({room, data: {event: 'userTakePlace', msg: `${player.user.login} take ${place} place.`}});
                // Пытаемся начать игру
                const countTakedPlaces = Object.keys(this.getRoomGamers(room_id)).length;
                if (room.game.status === 'wait' && countTakedPlaces >= config.minGamers){
                    this.startGameInToRoom(room_id);
                }
            }
        } catch (e){
            console.log('userTakePlace ' + e);
        }
    },
    userLeavePlace(player, place){ // занимает место
        try {
            const {room_id} = player;
            const room = this.rooms[room_id];
            const login = player.user.login;
            if (room.places[place] === login){ // если свободно
                room.places[place] = null;
                player.isPlaced = false;
                if (player.user.login === login){
                    this.updateDiler(room_id);
                }
                this.emitUpdateRoom({room, data: {event: 'userLeavePlace', msg: `${player.user.login} leave place.`, type: 'yellow'}});
            }
        } catch (e){
            console.log('userLeavePlace ' + e);
        }
    },
    getRoomGamers(room_id){
        const gamers = {};
        const room = this.rooms[room_id];
        for (let login in room.players){
            if ($u.playersToArray(room.places).includes(login)){
                gamers[login] = room.players[login];
            }
        }
        return gamers;
    },
    updateDiler(room_id){
        const room = this.rooms[room_id];
        const gamers = $u.playersToArray(this.getRoomGamers(room_id));
        const num = _.random(0, gamers.length - 1);
        room.diler = gamers[num].user.login;
    },
    emitUpdateRoom(req) {
        req.data = req.data || {};
        req.data.room = prepRoom (req.room);
        setTimeout(() => {
            $u.playersToArray(req.room.players).forEach(p => {
                p.socket.emit('emitRoom', req.data);
            });
        }, 1000);
    },
    getNextGamer(room_id, login){
        const room = this.rooms[room_id];
        const place = $u.getKeyByValue(room.places, login);
        const places = this.getCompactPlaces(room_id);
        const keysArray = Object.keys(places);
        const pos = keysArray.findIndex(p=> p === place);
        let nextUserLogin;
        if (pos === keysArray.length - 1){
            nextUserLogin = places[Object.keys(places)[0]];
        } else {
            nextUserLogin = places[keysArray[pos + 1]];
        }
        console.log({place, places, pos, nextUserLogin});
        return nextUserLogin;
    },
    getCompactPlaces(room_id){
        const places = this.rooms[room_id].places;
        const compact = {};
        for (let place in places){
            if (places[place]){
                compact[place] = places[place];
            }
        }
        return compact;
    },
    resetGame(room_id, msg){
        this.rooms[room_id].game = {status: 'wait'};
        this.emitUpdateRoom({room: this.rooms[room_id], data: {event: 'resetGame', msg, type: 'yellow'}});
    }
};

function prepRoom(room) {
    const game = room.game;
    const preped = {
        id: room.id,
        places: room.places,
        diler: room.diler,
        game: {
            status: game.status,
            oppenedCards: game.oppenedCards,
            waitUserAction: game.waitUserAction || {}
        }
    };
    return preped;
}
