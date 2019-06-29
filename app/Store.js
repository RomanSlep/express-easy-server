import Vue from 'vue/dist/vue.js';
import api from './core/api';

export default new Vue({
    created () {
        this.$watch('user.token', () => {
            localStorage.setItem('wstoken', this.user.token);
        });
        this.user.token = localStorage.getItem('wstoken') || false;
    },
    data: {
        user: {
            isLogged: false,
            password: '',
            login: '',
            address: '',
            token: false,
        }
    },
    methods: {
        updateUser (cb = false) {
            api('getUser', (data) => {
                Vue.set(this, 'user', Object.assign(this.user, data));
                if (cb) {
                    cb();
                }
            }, true);
        }
    }
});

