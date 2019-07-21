
import io from 'socket.io-client';
import Store from '../Store';

const socket = io('http://localhost:3300');

socket.on('connect', function () {
    Store.socket = socket;
    let login = Store.user.login;
    if (login.length && Store.user.isLogged){
        socket.emit('player_connect', {login});
    }
    Store.$watch('user.isLogged', val=>{ // перелогин
        if (val){
            login = Store.user.login;
            socket.emit('player_connect', {login});
        } else {
            console.log('emit remove', val);
            socket.emit('player_remove', {login});
        }
    });
});
