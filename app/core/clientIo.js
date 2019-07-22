
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
socket.on('addPlayer', data=>{
    console.log('addPlayer', data);
});

Store.$watch('user.isLogged', val=>{ // перелогин
    let login = Store.user.login;
    if (val){
        login = Store.user.login;
        socket.emit('player_connect', {login});
        console.log('emit login', login);
    } else {
        console.log('emit remove', login);
        socket.emit('player_remove', {login});
    }
});
