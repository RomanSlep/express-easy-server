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
            if (Store.game.isWaitRnd) {
                this.$notify({
                    type: 'info',
                    group: 'foo',
                    title: 'Info!',
                    text: 'Wait randomiser!'
                });
                return;
            }
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
                if (game.collected){
                    $u.sound('win');
                } else {
                    
                }
                Store.updateUser();
                Store.game.isGame = false;
            });
        }
    }
});