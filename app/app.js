import Vue from 'vue/dist/vue.js';
import login from './components/login.vue';
import modal from './components/modal.vue';
import Store from './Store';
import $u from './core/utils';
// import $u from './core/utils';
import template from './app.htm';
import Notifications from 'vue-notification';
import numFormat from 'vue-filter-number-format';

Vue.filter('numFormat', numFormat);
Vue.use(Notifications);

new Vue({
    el: '#app',
    components: {
        modal,
        login
    },
    data: {Store},
    template
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

