import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './login.htm';
import api from '../../core/api';
// import $u from '../../core/utils';


export default Vue.component('login', {
    template,
    data() {
        return {
            user: Store.user
        };
    },
    computed: {
        status() {
            return this.user.isLoginned ? 'Login' : 'Registration';
        }
    },
    methods: {
        logreg() {
            api({
                action: this.status,
                data: this.user
            });
        }
    }
});