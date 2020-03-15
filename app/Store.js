import Vue from 'vue/dist/vue.js';
import api from './core/api';

export default new Vue({
    created() {
        this.defaultUser();
        this.user.token = localStorage.getItem('wstoken') || false;
        if (this.user.token) {
            this.updateUser();
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
        user: {},
        rout: '',
        modal: {}
    },
    methods: {
        defaultUser(){
            this.user = {
                isLogged: false,
                isLoginned: true, // хочет логиниться / регаться
                password: '',
                login: '',
                address: '',
                token: false,
                deposit: 0
            };
        },
        updatePublic() {
            api({action: 'getPublic'}, data => {}, true, 'public');
        },
        updateUser(cb = false) {
            this.isLoad = true;
            const self = this;
            api({action: 'getUser', token: this.user.token}, data => {
                self.user = data;
                cb && cb();
            }, true);
        }
    },
    watch: {
        'user.token'() {
            localStorage.setItem('wstoken', this.user.token);
        }
    }
});
