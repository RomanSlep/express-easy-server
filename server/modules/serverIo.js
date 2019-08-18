const $u = require('../helpers/utils');
const Store = require('../helpers/Store');
const io = require('socket.io').listen(3300);

const players = Store.players = {};
const timers = {};
io.sockets.on('connection', socket => {
    // console.log('CONNECT USER');
    let user,
        player,
        room;
    socket.on('player_connect', async data=>{
        user = await $u.getUserFromQ({login: data.login});
        if (!user){
            return;
        }
        clearTimeout(timers[data.login]);// сбрасываем разлогин юзера, если был офф меньше
        player = players[data.login] = {user, socket, sendUserData, updateArts};
        const room_id = Object.keys(Store.rooms)[0];// FIXME: номер румы индивидуальный
        room = Store.rooms[room_id];
        Store.setPlayerToRoom(room_id, player);
        player.sendUserData(room.game);
    });
    socket.on('player_remove', async data=>{
        Store.removePlayer(players[data.login]);
    });
    socket.on('getUserData', () =>{
        player.sendUserData(room.game);
    });
    socket.on('takePlace', async data=>{
        const player = getPlayer({token: data.token});
        if (!player){
            error(socket, 'Player, not found');
            return;
        }
        const {deposit} = data;
        if (deposit > user.balance){
            error(socket, 'Have not deposit!');
            return;
        }
        if (deposit < room.minDeposit || deposit > room.maxDeposit){
            error(socket, 'Deposit is not to range!');
            return;
        }
        player.deposit = deposit;
        Store.userTakePlace(player, data.place);
    });

    socket.on('leavePlace', async data=>{
        // console.log('leavePlace', data);
        const player = getPlayer({token: data.token});
        if (!player){
            error(socket, 'Player, not found');
            return;
        }
        Store.userLeavePlace(player, data.place);
    });

    socket.on('waitAction', data => {
        const player = getPlayer({token: data.token});
        if (!player){
            error(socket, 'Player, not found');
            return;
        }
        const err = Store.rooms[player.room_id].game.checkUserAction(data, player);
        if (err){
            error(socket, err);
        }
    });
    socket.on('disconnect', async data=>{
        const {login} = user;
        timers[login] = setTimeout(()=>{
            console.log('Выкинули ' + user.login);
            Store.removePlayer(players[user.login]); // удаляем если вышел и не зашел
            delete players[user.login];
        }, 60 * 1000);
        console.log('disconnect', user.login);
    });
    socket.on('chatMsg', data=>{
        const {login} = user;
        console.log({login, msg: data.msg});
        $u.playersToArray(room.players).forEach(p => p.socket.emit('chatMsg', {login, msg: data.msg}));
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

function sendUserData(game){
    const {user} = this;
    const clearUser = {
        balance: user.balance,
        cards: game.gamersCards[user.login]
    };
    this.socket.emit('userData', clearUser);
    // user.save();
}
function updateArts(count){
    this.deposit += count;
    this.user.balance += count;
}
