import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './topbar.htm';
import $u from '../../core/utils';
import api from '../../core/api';

export default Vue.component('topBar', {
    template,
    data() {
        return {
            Store,
            store: Store.topbar,
            buttonsRate: [10, 50, 100, -100, -50, -10],
            buttonsCountBombs: [1, 3, 5, 10, 20],
            min: 0.001,
            className: ''
        };
    },
    methods: {
        changeRate(r) {
            const dep = Store.user.deposit;
            const min = this.min;
            let bet = $u.round(Store.topbar.bet * (1 + r / 100));
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