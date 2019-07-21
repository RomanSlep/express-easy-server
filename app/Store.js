import Vue from 'vue/dist/vue.js';
import api from './core/api';
import $u from './core/utils';
import config from '../config';

export default new Vue({
    created() {
        this.user.token = localStorage.getItem('wstoken') || false;
        if (this.user.token) {
            this.updateUser(() => {
                if (this.user.lvl) {
                    this.rout(window.location.hash || '#game');
                    this.getNoFinished();
                }
            });
        } else {
            this.isLoad = true;
        }
        this.updatePublic();
        setInterval(() => {
            this.updatePublic();
        }, 60 * 1000);
    },
    data: {
        isLoad: false,
        isSoundOn: localStorage.isSoundOn === "false" ? false : true,
        router: '',
        user: {
            isLogged: false,
            isLoginned: true, // хочет логиниться / регаться
            password: '',
            login: '',
            address: '',
            token: false,
            deposit: 0
        },
        socket: null,
        match: {}
    },
    methods: {
        updatePublic() {
            // api({
            //     action: 'getPublic'
            // }, (data) => {
            //     this.totalRatings = data.totalRatings;
            //     this.totalPrize = data.totalPrize;
            // }, true, 'public');
        },
        updateUser(cb = false) {
            this.isLoad = true;
            const self = this;
            api({
                action: 'getUser',
                token: this.user.token
            }, (data) => {
                self.user = data;
                cb && cb();
            }, true);
        },
        logOut() {
            this.user.isLogged = false;
            this.user.token = false;
        }
    },
    watch: {
        'user.token'() {
            localStorage.setItem('wstoken', this.user.token);
        }
    }
});
