const $u = require('../helpers/utils');
const Store = require('../helpers/Store');
const io = require('socket.io').listen(3300);

const players = Store.players = {};

io.sockets.on('connection', socket => {
    console.log('CONNECT USER');
    let user;
    socket.on('player_connect', async data=>{
        user = await $u.getUserFromQ({login: data.login});
        if (!user){
            return;
        }
        const player = players[data.login] = {user, socket};
        const room_id = Object.keys(Store.rooms)[0];
        Store.setPlayerToRoom(room_id, player);
        // const room = Store.rooms[room_id];
        // Store.startGameInToRoom(room.id);
        // console.log(room.game.getWinners());
    });
    socket.on('player_remove', async data=>{
        Store.removePlayer(players[data.login]);
    });
    socket.on('takePlace', async data=>{
        console.log('takePlace', data);
        const player = getPlayer({token: data.token});
        if (!player){
            error(socket, 'Player, not found');
            return;
        }
        Store.userTakePlace(player, data.place);
    });
    
    socket.on('leavePlace', async data=>{
        console.log('leavePlace', data);
        const player = getPlayer({token: data.token});
        if (!player){
            error(socket, 'Player, not found');
            return;
        }
        Store.userLeavePlace(player, data.place);
    });

    socket.on('disconnect', async data=>{
        console.log('disconnect', players[data.login]);
    });
});

function getPlayer(q) {
    try {
        const key = Object.keys(q)[0];
        return $u.playersToArray(players).find(p => p.user[key] === q[key]);
    } catch (e) {
        console.log('get plager', e);
        return null;
    }
}
function error(s, msg){
    s.emit('errorApi', {msg});
}