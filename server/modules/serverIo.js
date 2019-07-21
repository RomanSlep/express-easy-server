const $u = require('../helpers/utils');
const Store = require('../helpers/Store');
const io = require('socket.io').listen(3300);
const players = Store.players = {};

io.sockets.on('connection', socket => {
    console.log('CONNECT USER')
    let user;
    socket.on('player_connect', async data=>{
        user = await $u.getUserFromQ({login: data.login});
        if (!user){
            return;
        }
        const player = players[data.login] = {user, socket};
        console.log('player_connect', data.login);
        Store.setPlayerToRoom(Object.keys(Store.rooms)[0], player);
    });
    socket.on('player_remove', async data=>{
        console.log('player_remove', data.login);
        Store.removePlayer(players[data.login]);
    });
    socket.on('disconnect', async data=>{
        console.log('disconnect', players[data.login]);
    });
});

