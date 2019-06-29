<template name="login">
    <div>
        <div class="form">
            <h3>{{action}}</h3>
            <input v-model="user.login" placeholder="Login">
            <input v-model="user.address" placeholder="Address" v-show="action === 'Registration'">
            <input v-model="user.password" placeholder="Password" type="password">
            <div @click="logreg" class="but">{{action}}</div>
            <i @click="action = antoAction"><u>U got {{antoAction}}?</u></i>
        </div>
    </div>
</template>

<script>
import Store from '../Store';
import api from '../core/api';
import Vue from 'vue/dist/vue.js';

export default {
    data() {
        return {
            action: 'Login',
            user: Store.user
        }
    },
    methods: {
        logreg() {
            const user = this.user;
            if (!user.login || !user.password || this.action === 'Registration' && !user.address) {
                console.log({
                    type: 'error',
                    group: 'foo',
                    title: 'Error ' + this.action,
                    text: 'Fill in all the fields!'
                });
                return;
            }
            api({
                action: this.action.toLowerCase(),
                data: user
            }, (data) => {
                Vue.set(Store, 'user', Object.assign(Store.user, data));
               console.log({
                    type: 'success',
                    group: 'foo',
                    title: 'Success ' + this.action,
                    text: 'Ready!'
                });
                Store.user.isLogged = true;
            });
        }
    },
        computed: {
            antoAction() {
                return this.action === 'Registration' ? 'Login' : 'Registration'
            }
        }
    }
</script>
