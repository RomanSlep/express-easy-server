import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './topbar.htm';
import $u from '../../core/utils';

export default Vue.component('topBar', {
    template,
    data() {
        return {
            Store,
            store: Store.topbar,
            buttonsRate: [10, 50, 100, -100, -50, -10],
            buttonsCountBombs: [1, 3, 5, 10, 25],
            min: 0.001
        };
    },
    methods: {
        changeRate(r) {
            Store.topbar.bet = $u.round(Store.topbar.bet * (1 + r / 100));
            Store.topbar.bet = Math.max(Store.topbar.bet, this.min);

        },
        sound() {
            $u.sound('click');
        }
    }

});