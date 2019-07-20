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
                {text: '+100', val: 100},
                {text: '+500', val: 500},
                {text: 'x2', val: 2},
                {text: 'min', val: - 100000000000000},
                {text: '-100', val: -100},
                {text: '-500', val: -500},
            ],
            buttonsCountBombs: [1, 3, 5, 10, 20],
            min: config.min_bet,
            max: config.max_bet,
            className: ''
        };
    },
    methods: {
        changeRate(rate) {
            const dep = Store.user.deposit;
            const {min, max} = this;
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
            if (bet > max) {
                bet = max;
            };
            if (bet !== dep && bet !== min) {
                this.className = '';
            } else {
                this.className = 'txt-red';
            }
            Store.topbar.bet = bet;
        },
        addDeposit() {
            Store.modal.show({
                header: 'Deposit Artifacts',
                body: `To replenish the game deposit, send to the wallet <br><big class="txt-yellow"><i>${config.gameMinterAddress}</i> <b>ARTIFACTS</b></big><br> Within a minute, your account will be .`,
            });
        },
        sound() {
            $u.sound('click');
        }
    }

});
