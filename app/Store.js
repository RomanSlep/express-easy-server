import Vue from 'vue/dist/vue.js';
import api from './core/api';
import $u from './core/utils';

export default new Vue({
    created () {
        this.$watch('user.token', () => {
            localStorage.setItem('wstoken', this.user.token);
        });
        this.user.token = localStorage.getItem('wstoken') || false;
    },
    data: {
        user: {
            password: '',
            login: '',
            address: '',
            token: false,
        }
    },
    methods: {
        updateUser (cb = false) {
            const self = this;
            api({
                action: 'getUser',
                token: this.user.token
            }, (data) => {
                Vue.set(self, 'user', Object.assign(self.user, data));
                if (cb) {
                    cb();
                }
            }, true);
        }
    }
});

