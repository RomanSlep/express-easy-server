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
            const user = this.user;
            if (!user.login || !user.password || !user.isLoginned && !user.address) {
                this.$notify({
                    type: 'error',
                    group: 'foo',
                    title: 'Error ' + this.status,
                    text: 'Fill in all the fields!'
                });
                return;
            }
            api({
                action: this.status.toLowerCase(),
                data: user
            }, (data) => {
                
            });
        }
    }
});