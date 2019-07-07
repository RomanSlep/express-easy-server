<template>
<span>
    <top-bar></top-bar>
    <div class="but but_play" :class="!game.isGame ? 'hovered bg-green' : 'no-events bg-yellow'" @click="newGame">
        <span v-if="!game.isGame">Go</span>
        <span v-else>Play Bet</span>
        {{bet}}!
    </div>
    <div id="game-line" :class="{'no-events' : !game.isGame}">
        <field-game></field-game>
        <log-game></log-game>
    </div>
</span>
</template>

<script>
import Store from '../Store';
import api from '../core/api';
import Vue from 'vue/dist/vue.js';

export default {
    computed: {
        game() {
            return Store.game
        },
        bet() {
            return Store.topbar.bet;
        }
    },
    methods: {
        newGame() {
            api({
                action: 'startGame',
                data: {
                    bet: Store.topbar.bet,
                    countBombs: Store.topbar.countBombs
                }
            }, (game) => {
                Store.game.isGame = true;
                Vue.set(Store, 'logs', []);
                Vue.set(Store, 'game', game);
                Store.startGame();
                Store.updateUser();
            });
        }
    }
}
</script>
