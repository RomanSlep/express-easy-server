import Vue from 'vue/dist/vue.js';
import './components/login.vue';
import modal from './components/modal.vue';
import Store from './Store';
import $u from './core/utils';
import template from './app.htm';
// import Notifications from 'vue-notification';
import numFormat from 'vue-filter-number-format';




//https://element.eleme.io/#/en-US/component/quickstart
import ElementUI from 'element-ui';
Vue.use(ElementUI); 
import 'element-ui/lib/theme-chalk/index.css';
import 'element-theme-dark'; //https://github.com/Arattian/element-theme-dark


Vue.filter('numFormat', numFormat);
// Vue.use(Notifications);


new Vue({
    el: '#app',
    components: {
        modal
    },
    data: {Store},
    template
});

Store.rout = function(hash){
    if (hash === Store.hash){
        return;
    }
    window.location.hash = hash;
    Store.router = hash;
};
window.addEventListener('popstate', ()=>{
    Store.rout(window.location.hash);
    console.log('router', Store.router);
});

