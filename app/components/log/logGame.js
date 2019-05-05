import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './logGame.htm';
// import $u from '../../core/utils';
// import api from '../../core/api';

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
    }
});