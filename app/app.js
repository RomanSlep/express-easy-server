import Vue from 'vue/dist/vue.js';
import './components/topbar/topbar';
import './components/field/field';
import './components/login/login';
import Store from './Store';
import api from './core/api';
import $u from './core/utils';
import template from './app.htm';
import Notifications from 'vue-notification';

Vue.use(Notifications);

new Vue({
    el: '#app',
    data: {
        Store
    },
    template,
    methods: {
        startGame() {
            Store.isGame = true;
            api({
                action: 'test',
                data: {
                    userid: 1
                }
            }, (data) => {
                $u.sound('gong');
                Store.field.plots.forEach((p, i) => {
                    setTimeout(() => {
                        Vue.set(Store.field.plots, i, 'c');
                    }, 100 * i);
                });
                console.log(data);
            });
        }
    }
});

const fon = new Audio('./assets/sounds/fone.mp3');
fon.volume = 0.2;
fon.addEventListener("ended", mus);
document.addEventListener('click', mus);
document.addEventListener('mousemove', mus);
let isMus = false;

function mus() {
    if (isMus) {
        return;
    }
    console.log('Start music');
    isMus = true;
    var promise = fon.play();
    if (promise) {
        promise.catch(() => isMus = false);
    }
}
mus();