
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

socket.on('log', data=> Store.log.push({msg: data.msg, type: data.type}));
socket.on('chatMsg', data=> Store.chat.push(data));

socket.on('emitRoom', data=>{
    console.log('emitRoom', data);
    Store.room = data.room;
    if (data.msg){
        Store.log.push({msg: data.msg, type: data.type});
    }
    if (data.timer){
        Store.timer(data.timer);
    }
    // Если не авто блинды
    if (data.event === 'waitStartGame') {
        Store.timer(config.pausedBeforeStartGame);
    }
    if (data.event === 'smallBlind') {
        Store.gamersPlaces = data.room.game.gamersData;
    }

    if (data.event === 'bidding') {
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
    Store.gamersPlaces = Store.room.game.gamersData || {};
    Object.assign(Store.user, user);
    Store.uCards[Store.user.login] = user.cards;
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
