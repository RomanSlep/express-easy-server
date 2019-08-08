<template>
<div id="table">
    <div v-for="n in [1, 2, 3, 4, 5, 6]" :key="n" :id="'player' + n" class="player-place" :class="{hovered: !isUserPlaced && !room.places[n]}">
        <user-place :n="n" :room="room" :game="game" :gamers-data="gamersData" :details-win="detailsWin" :user="user" :timer="timer"></user-place>

        <div class="place-free" @click="takePlace(n)" v-show="!isUserPlaced && !room.places[n]"></div>
        <div class="place-free" v-show="isUserPlaced && !room.places[n]"></div>

        <div class="user-cards" v-if="cards[n]">
            <div v-for="(c, i) in cards[n]" :key="i" class="user-card-place">
                <img v-show="Object.keys(uCards).length" class="card-img" :src="'assets/img/cards/' + c +'.png'">
            </div>
        </div>
    </div>

    <div class="play-field">
        <div class="bank">
            <div class="bets">
                <div class="total-bank">Pot: {{game.bank || 0}}</div>
            </div>
        </div>

        <div id="common-cards">
            <div v-for="n in [0, 1, 2, 3, 4]" :key="n" :id="'card' + n" class="card-place">
                <img :src="'assets/img/cards/' + game.oppenedCards[n] +'.png'" class="common-card card-img" v-if="game.oppenedCards[n]">
            </div>
            <div id="delay-before-start" v-show="game.status === 'waitStartGame'">
                Game started after {{timer.secondsLeft}}s...
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Store from '../Store';
import api from '../core/api';
import config from '../../config';
import userPlace from './user-place.vue';

export default {
    components: {
        userPlace
    },
    data() {
        return {
            timer: {
                secondsLeft: 0,
                timeOut: null,
            }
        }
    },
    computed: {
        room() {
            return Store.room;
        },
        game() {
            return this.room.game;
        },
        user() {
            return Store.user;
        },
        uCards() {
            return Store.uCards;
        },
        isUserPlaced() {
            return JSON.stringify(this.room.places).includes(`"${this.user.login}"`);
        },
        detailsWin() {
            return Store.detailsWin
        },
        gamersData() {
            return this.game.gamersData;
        },
        cards() {
            const gamers = Store.gamersPlaces;
            const cards = {};
            Object.keys(gamers).forEach(l => {
                const {
                    place
                } = gamers[l]
                if (this.uCards[l]) {
                    cards[place] = this.uCards[l];
                } else {
                    cards[place] = ['0_0', '0_0'];
                }
            });
            return cards;
        },
    },
    mounted() {
        setPositions();
        Store.timer = (t) => this.secondsTimerStart(t);
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
        secondsTimerStart(t) {
            const {
                timer
            } = this;
            if (timer.timeOutId) {
                clearInterval(timer.timeOutId);
            }
            timer.secondsLeft = t || config.waitUserActionSeconds;
            timer.timeOutId = setInterval(() => {
                timer.secondsLeft--;
                if (timer.secondsLeft <= 0) {
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
