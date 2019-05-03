import Vue from 'vue/dist/vue.js';
import './components/topbar/topbar';
import './components/field/field';
import './components/login/login';
import Store from './Store';
import api from './core/api';
import template from './app.htm';
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
                console.log(data)
            });
        }
    }
});