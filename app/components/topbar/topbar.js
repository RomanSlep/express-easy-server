import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './topbar.htm';
import $u from '../../core/utils';
import api from '../../core/api';
import config from "../../../config";

export default Vue.component('topBar', {
    template,
    data() {
        return {
            Store,
            store: Store.topbar,
            buttonsRate: [
                {text: '+0.1', val: 0.1},
                {text: '+0.5', val: 0.5},
                {text: 'x2', val: 2},
                {text: 'min', val: - 100000000000000},
                {text: '-0.1', val: -0.1},
                {text: '-0.5', val: -0.5},
            ],
            buttonsCountBombs: [1, 3, 5, 10, 20],
            min: config.min_bet,
            className: ''
        };
    },
    methods: {
        changeRate(rate) {
            const dep = Store.user.deposit;
            const min = this.min;
            let bet;
            if (rate.text === 'x2'){
                bet = Store.topbar.bet * 2;
            } else {
                bet = Store.topbar.bet + rate.val;
            }
            bet = $u.round(bet);
            if (bet < min) {
                bet = min;
            }
            if (bet > dep) {
                bet = dep;
            };

            if (bet !== dep && bet !== min) {
                this.className = '';
            } else {
                this.className = 'txt-red';
            }
            Store.topbar.bet = bet;
        },
        addDeposit() {
            api({
                action: 'testDeposit'
            }, () => {
                Store.updateUser();
            });
        },
        sound() {
            $u.sound('click');
        }
    }

});
