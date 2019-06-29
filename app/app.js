import Vue from 'vue/dist/vue.js';
import template from './app.html';
import Store from './Store';
import dashboard from "./components/dashboard.vue";
import login from "./components/login.vue";

export default new Vue({
    components: {
        login,
        dashboard
    },
    template,
    el: '#app',
    data: {
        user: Store.user,
        test: 'Hello Vue!'
    },
    created (){
        console.log('Create!');
    },
    mounted (){
        console.log('Mounted!');
    }
});
