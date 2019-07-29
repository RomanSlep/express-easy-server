const $u = require('../helpers/utils');
const Game = require('../modules/game');
const _ = require('underscore');
const config = require('../helpers/configReader');

module.exports = {
    createRoom(){
        const room_id = $u.unix();
        const room = {id: room_id, players: {}, places: {}};
        this.rooms[room_id] = room;
        room.game = new Game(room_id, this);
        return room;
    },
    removeRoom(room_id){
        delete this.rooms[room_id];
    // console.log('RemoveRoom', this.rooms);
    },
    setPlayerToRoom(room_id, player){
        try {
            const room = this.rooms[room_id];
            player.room_id = room_id;
            room.players[player.user.login] = player;
            this.emitUpdateRoom({room});
        } catch (e){
            console.log('Error room.setPlayerToRoom ', e);
        }
    // console.log('setPlayerToRoom', this.rooms);
    },
    startGameInToRoom(room_id){
        try {
            const room = this.rooms[room_id];
            room.game.start();
        } catch (e){
            console.log('Error room.startGameInToRoom ', e);
        }
    },
    removePlayer(player){
        try {
            const room = this.rooms[player.room_id];
            const login = player.user.login;
            room.game.removeGamer(login);
            delete room.players[login];
            delete this.players[login];
            Object.keys(room.places).forEach(place=>{
                if (room.places[place] === login){
                    room.places[place] = null;
                }
            });
            this.emitUpdateRoom({room});
        } catch (e){
            console.log('Error room.removePlayer ', e);
        }
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
                room.game.updateGamers();
                const countTakedPlaces = Object.keys(this.getRoomGamers(room_id)).length;
                if (room.game.status === 'wait' && countTakedPlaces >= config.minGamers){
                    this.roomStartDelayBeforeGame(room_id);
                }
            }
        } catch (e){
            console.log('Error room.userTakePlace ' + e);
        }
    },
    userLeavePlace(player, place){ // покдает место
        try {
            const {room_id} = player;
            const room = this.rooms[room_id];
            const login = player.user.login;
            if (room.places[place] === login){ // если действительно там сидел
                room.places[place] = null;
                player.isPlaced = false;
                if (player.user.login === login){
                    this.updateDealer(room_id);
                }
                this.emitUpdateRoom({room, data: {event: 'userLeavePlace', msg: `${player.user.login} leave place.`, type: 'yellow'}});
                room.game.removeGamer(login);
                if (room.game.status === 'waitStartGame'){
                    this.checkResetGame(room_id);
                }
            }
        } catch (e){
            console.log('Error room.userLeavePlace ' + e);
        }
    },
    checkResetGame(room_id){
        try {
            const room = this.rooms[room_id];
            const countTakedPlaces = Object.keys(this.getRoomGamers(room_id)).length;
            if (countTakedPlaces < config.minGamers){
                if (room.timeOutBeforeStartedGame){
                    clearTimeout(room.timeOutBeforeStartedGame);
                }
                room.game = new Game(room_id);
                this.emitUpdateRoom({room, data: {event: 'reset', msg: `reset...`, type: 'red'}});
            }
        } catch (e){
            console.log('Error room.checkResetGame ', e);
        }
    },
    roomStartDelayBeforeGame(room_id){ // Задержка перед началом игры
        try {
            const room = this.rooms[room_id];
            room.game.status = 'waitStartGame';
            this.emitUpdateRoom({room, data: {event: 'waitStartGame', msg: `Wait started game...`, type: 'yellow'}});
            if (room.timeOutBeforeStartedGame){
                clearTimeout(room.timeOutBeforeStartedGame);
            }
            console.log('New timeout start game', room_id);
            room.timeOutBeforeStartedGame = setTimeout(()=>{
                this.startGameInToRoom(room_id);
            }, config.pausedBeforeStartGame * 1000);

        } catch (e){
            console.log('Error room.roomStartDelayBeforeGame ', e);
        }
    },
    getRoomGamers(room_id){
        try {
            const gamers = {};
            const room = this.rooms[room_id];
            for (let login in room.players){
                if ($u.playersToArray(room.places).includes(login)){
                    gamers[login] = room.players[login];
                }
            }
            return gamers;
        } catch (e){
            console.log('Error room.getRoomGamers ', e);
        }
    },
    updateDealer(room_id){
        try {
            const room = this.rooms[room_id];
            const gamers = $u.playersToArray(this.getRoomGamers(room_id));
            const num = _.random(0, gamers.length - 1);
            room.dealer = gamers[num].user.login;
        } catch (e){
            console.log('Error room.updateDealer ', e);
        }
    },
    emitUpdateRoom(req) {
        try {
            req.data = req.data || {};
            req.data.room = prepRoom (req.room);
            // setTimeout(() => {
            $u.playersToArray(req.room.players).forEach(p => {
                p.socket.emit('emitRoom', req.data);
            });
        } catch (e){
            console.log('Error room.emitUpdateRoom ', e);
        }
        // }, 1000);
    },
    getCompactPlaces(room_id){
        try {
            const places = this.rooms[room_id].places;
            const compact = {};
            for (let place in places){
                if (places[place]){
                    compact[place] = places[place];
                }
            }
            return compact;
        } catch (e){
            console.log('Error room.getCompactPlaces ', e);
        }
    },
    resetGame(room_id, msg){
        try {
            this.rooms[room_id].game = new Game(room_id);
            this.emitUpdateRoom({room: this.rooms[room_id], data: {event: 'resetGame', msg, type: 'yellow'}});
        } catch (e){
            console.log('Error room.resetGame ', e);
        }
    }
};

function prepRoom(room) {
    const game = room.game;
    const preped = {
        id: room.id,
        places: room.places,
        dealer: room.dealer,
        game: {
            status: game.status,
            oppenedCards: game.oppenedCards || [],
            waitUserAction: game.waitUserAction,
            bblind: game.bblind,
            sblind: game.sblind,
            gamersData: game.gamersData,
            currentMaximalBet: game.getCurrentMaximalBet(),
            bank: game.getBank()
        }
    };
    // console.log('game.gamersData', game.gamersData);
    return preped;
}
