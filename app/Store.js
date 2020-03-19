import Vue from 'vue/dist/vue.js';
import api from './core/api';

export default new Vue({
    created() {
        // Router start
        window.addEventListener('popstate', ()=> this.rout(window.location.hash));
        this.rout(window.location.hash);

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
        router: '',
        modal: {}
    },
    methods: {
        defaultUser(){
            this.user = {
                isLogged: false,
                isLoginned: true, // хочет логиниться / регаться
                password: '',
                login: '',
                token: false
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
        },
        rout(hash){
            console.log({hash});
            if (hash === '#' + this.router){
                return;
            }

            this.router = hash.replace('#', '');
            if (this.router === ''){
                this.router = 'mainPage';
            }
            if (window.location.hash !== '#' + this.router){
                window.location.hash = this.router;
            }
        }
    },
    watch: {
        'user.token'() {
            localStorage.setItem('wstoken', this.user.token);
        }
    }
});
