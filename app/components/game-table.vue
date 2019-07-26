<template>
<div id="table">
    <div v-for="n in [1, 2, 3, 4, 5, 6]" :key="n" :id="'player' + n" class="player-place" :class="{hovered: !user.isPlaced && !room.places[n]}">
        <div v-show="room.places[n]" class="place-taked">
            <div class="user-wait-action" v-show="game.waitUserAction.login === room.places[n]">
                <div class="gif"></div>
                <div class="action txt-yellow">{{game.waitUserAction.text + ' ' + timer.secondsLeft + 's...'}}</div>
            </div>
            <div class="user-place">
                <div class="user-avatar">
                    <img src="assets/img/avatar.jpg">
                </div>
                <div class="user-info">
                    <span class="user-name">{{room.places[n]}}</span>
                </div>
            </div>
            <span v-show="room.places[n] === user.login" @click="leavePlace(n)"><i class="hovered txt-yellow fa fa-arrow-circle-up" aria-hidden="true"></i></span>
        </div>

        <div class="place-free" @click="takePlace(n)" v-show="!user.isPlaced && !room.places[n]"></div>
        <div class="place-not-taked" v-show="user.isPlaced && !room.places[n]"></div>

        <div class="user-cards" v-show="room.places[n]">
            <div v-for="n in [0, 1]" :key="n" class="card-place user-card"></div>
        </div>
    </div>
    <div id="common-cards">
        <div id="delay-before-start" v-show="game.status === 'waitStartGame'">
            Game started after {{timer.secondsLeft}}s...
        </div>
        <div v-for="n in [1, 2, 3, 4, 5]" :key="n" :id="'card' + n" class="card-place"></div>
    </div>
</div>
</template>

<script>
import Store from '../Store';
import api from '../core/api';
import config from '../../config';

export default {
    data() {
        return {
            timer: {
                secondsLeft: 0,
                timeOut: null
            }
        }
    },
    computed: {
        room() {
            return Store.room;
        },
        game(){
            return this.room.game;
        },
        user() {
            return Store.user;
        }
    },
    mounted() {
        setPositions();
        Store.timer = (t)=> this.secondsTimerStart(t);
    },
    methods: {
        takePlace(place) {
            Store.emit('takePlace', {
                place,
                room_id: this.room.id
            });
        },
        leavePlace(place) {
            Store.emit('leavePlace', {
                place,
                room_id: this.room.id
            })
        },
        secondsTimerStart(t){
            const {timer} = this;
         if (timer.timeOutId){
                clearInterval(timer.timeOutId);
            }
            timer.secondsLeft = t || config.waitUserActionSeconds;
            timer.timeOutId = setInterval(()=>{
                timer.secondsLeft--;
                if (timer.secondsLeft <= 0){
                    clearInterval(timer.timeOutId);
                }
            }, 1000);
        }
    }
}

function setPositions() {
    const table = document.getElementById('table');
    const width = table.offsetWidth;
    const height = table.offsetHeight;

    const widthPlayer = document.getElementById('player3').offsetWidth;
    const heightPlayer = document.getElementById('player3').offsetHeight;

    const leftPos = 0;
    const topPos = height - heightPlayer * 0.5;
    const rightPos = width - widthPlayer;
    const bottomPos = -heightPlayer * 0.5;

    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const player3 = document.getElementById('player3');
    const player4 = document.getElementById('player4');
    const player5 = document.getElementById('player5');
    const player6 = document.getElementById('player6');

    player6.style.marginLeft = leftPos + 'px';
    player6.style.marginTop = bottomPos + 'px';

    player2.style.marginLeft = rightPos + 'px';
    player2.style.marginTop = bottomPos + 'px';

    player1.style.marginLeft = rightPos / 2 + 'px';
    player1.style.marginTop = bottomPos - 0.5 * heightPlayer + 'px';

    player4.style.marginLeft = rightPos / 2 + 'px';
    player4.style.marginTop = topPos + 0.5 * heightPlayer + 'px';

    player5.style.marginLeft = leftPos + 'px';
    player5.style.marginTop = topPos + 'px';

    player3.style.marginLeft = rightPos + 'px';
    player3.style.marginTop = topPos + 'px';
}
</script>
