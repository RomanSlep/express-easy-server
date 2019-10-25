import Vue from 'vue/dist/vue.js';
import './components/login/login';
import modal from './components/modal.vue';
import Store from './Store';
import $u from './core/utils';
import './core/filters';
import template from './app.htm';
import Notifications from 'vue-notification';
import game from './core/game';
Vue.use(Notifications);

new Vue({
    el: '#app',
    components: {
        modal
    },
    mounted(){
        game.init();
    },
    data: {Store},
    template,
    methods: {
        startGame(){
            // TODO: апи!
            game.start();
        }
    }
});

Vue.prototype.rout = function(hash){
    if (hash === Store.hash){
        return;
    }
    $u.sound('click');
    window.location.hash = hash;
    Store.router = hash;
};
window.addEventListener('popstate', ()=>{
    Store.rout(window.location.hash);
});

