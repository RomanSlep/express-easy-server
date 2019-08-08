
import io from 'socket.io-client';
import Store from '../Store';
import config from '../../config';
import Vue from 'vue';
const socket = io(location.hostname + ':3300');
Store.socket = socket;

socket.on('connect', function () {
    console.log('Socket connect...');
    let login = Store.user.login;
    if (login.length && Store.user.isLogged){
        socket.emit('player_connect', {login});
    }
});
socket.on('log', data=>{
    Store.log.push({msg: data.msg, type: data.type});
});
socket.on('emitRoom', data=>{
    Store.room = data.room;
    console.log('emitRoom', data); // TODO: писать в лог события
    if (data.msg){
        Store.log.push({msg: data.msg, type: data.type});
    }
    if (data.timer){
        Store.timer(data.timer);
    }
    if (data.event === 'waitStartGame') {
        Store.timer(config.pausedBeforeStartGame);
    }
    if (data.event === 'smallBlind') {
        Store.gamersPlaces = data.room.game.gamersData;
    }

    if (data.event === 'winner') {
        try {
            const info = JSON.parse(data.payload);
            const winner = info.winners[0];
            Vue.set(Store.uCards, winner.login, winner.cards);
            Store.detailsWin = {login: winner.login, txt: winner.details};
            // Store.room.game.oppenedCards = info.oppenedCards;
            setTimeout(()=>{
                Store.uCards = {}; // сбрасываем карты
                Store.detailsWin = {};
                Store.room.game.oppenedCards = [];
                Store.gamersPlaces = {};
            }, (config.pausedBeforeStartGame - 2) * 1000);
        } catch (e) {
            Store.uCards = {}; // сбрасываем карты
            Store.detailsWin = {};
        }
    }
});

socket.on('errorApi', data=>{
    Store.$notify({
        type: 'error',
        group: 'foo',
        title: 'Error! ',
        text: data.msg
    });
});
socket.on('userData', user=>{
    console.log('userData', user);
    Object.assign(Store.user, user);
});
socket.on('uCards', data=>{
    console.log('Socket', data.cards);
    Vue.set(Store.uCards, Store.user.login, data.cards);
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
