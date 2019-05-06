import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './logGame.htm';
import api from '../../core/api';
import $u from '../../core/utils';

export default Vue.component('log-game', {
    template,
    data() {
        return {
            Store
        };
    },
    computed: {
        logs() {
            return Store.logs.reverse();
        },
        game() {
            return Store.game;
        }
    },
    methods: {
        pickUpWinnings() {
            api({
                action: 'pickUpWinnings',
                data: {
                    game_id: Store.game._id
                }
            }, game => {
                Store.logs.push({
                    isWin: true,
                    collected: $u.round(game.collected)
                });
                Store.updateUser();
                Store.game.isGame = false;
            });
        }
    }
});