import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './login.htm';
import api from '../../core/api';

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
            // if (!user.login || !user.password || !user.isLoginned && !user.address) {
            if (!user.login || !user.password) {
                this.$notify({
                    type: 'error',
                    group: 'foo',
                    title: 'Error ' + this.status,
                    text: 'Fill in all the fields!'
                });
                return;
            }
            // if (user.address && (user.address.length < 40 || !user.address.startsWith('Mx'))){
            //     this.$notify({
            //         type: 'warn',
            //         group: 'foo',
            //         title: 'Error ' + this.status,
            //         text: 'U minter adress must be Mx345536dsv34344...!'
            //     });
            //     return;
            // }
            api({
                action: this.status.toLowerCase(),
                data: user
            }, (data) => {
                Vue.set(Store, 'user', Object.assign(Store.user, data));
                Store.$notify({
                    type: 'success',
                    group: 'foo',
                    title: 'Success ' + this.status,
                    text: 'Ready!'
                });
                Store.user.isLogged = true;
            });
        }
    }
});
