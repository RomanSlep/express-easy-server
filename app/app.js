import Vue from 'vue/dist/vue.js';
import './components/topbar/topbar';
import './components/field/field';
import './components/login/login';
import './components/log/logGame';
import Store from './Store';
import api from './core/api';
// import $u from './core/utils';
import template from './app.htm';
import Notifications from 'vue-notification';
import numFormat from 'vue-filter-number-format';

Vue.filter('numFormat', numFormat);
Vue.use(Notifications);

new Vue({
    el: '#app',
    data: {
        Store
    },
    template,
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
});

const fon = new Audio('./assets/sounds/fone.mp3');
fon.volume = 0.2;
fon.addEventListener("ended", () => isMus = false);
document.addEventListener('click', mus);
document.addEventListener('mousemove', mus);
let isMus = false;

function mus() {
    if (isMus) {
        return;
    }
    isMus = true;
    var promise = fon.play();
    if (promise) {
        promise.catch(() => isMus = false);
    }
}
mus();