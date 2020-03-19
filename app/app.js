import Vue from 'vue/dist/vue.js';
import './components/login.vue';
import modal from './components/modal.vue';
import login from './components/login.vue';
import mainApp from './components/mainApp.vue';
import Store from './Store';
import template from './app.htm';
import numFormat from 'vue-filter-number-format';

//https://element.eleme.io/#/en-US/component/quickstart
// import ElementUI from 'element-ui';
import {Checkbox, Input, Link, Form, Button, Dialog, Notification} from 'element-ui';
Vue.use(Input);
Vue.use(Link);  
Vue.use(Form);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Dialog);
Vue.prototype.$notify = Notification;
import 'element-ui/lib/theme-chalk/index.css';
import 'element-theme-dark'; //https://github.com/Arattian/element-theme-dark


Vue.filter('numFormat', numFormat);

new Vue({
    el: '#app',
    components: {
        modal,
        mainApp
    },
    data: {Store},
    template
});