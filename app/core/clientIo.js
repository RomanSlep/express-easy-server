
import io from 'socket.io-client';
import Store from '../Store';

const socket = io('http://localhost:3300');
Store.socket = socket;

socket.on('connect', function () {
    console.log('Socket connect...');
    let login = Store.user.login;
    if (login.length && Store.user.isLogged){
        socket.emit('player_connect', {login});
    }
});
socket.on('emitRoom', data=>{
    Store.room = data.room;
    console.log('emitRoom', data); // TODO: писать в лог события
});

socket.on('errorApi', data=>{
    Store.$notify({
        type: 'error',
        group: 'foo',
        title: 'Error! ',
        text: data.msg
    });
});

Store.$watch('user.isLogged', val=>{ // перелогин
    let login = Store.user.login;
    if (val){
        login = Store.user.login;
        socket.emit('player_connect', {login});
    } else {
        socket.emit('player_remove', {login});
    }
});
