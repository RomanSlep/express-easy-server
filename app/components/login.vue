<template>
    <el-form id="form" class="center">

        <h4 class="mt10">{{status}}</h4>

        <el-input placeholder="Login" maxlength="10" v-model="user.login" clearable class="mt10"></el-input>
        <el-input placeholder="Password" v-model="user.password" clearable show-password class="mt10"></el-input>
        <div class="mt5" v-show="!user.isLoginned">
            <el-checkbox v-model="checked"></el-checkbox>&nbsp;
            <span class="smallsmall hovered" @click="checked = !checked">Я подтверждаю, что мне исполнилось 18 полных лет, и я понимаю и принимаю
                риски связанные с использованнием криптовалют.</span>
        </div>
        <el-button type="info" @click="logreg" plain class="mt15">{{status}}</el-button>

        <div class="mt10" @click="user.isLoginned =!user.isLoginned">
            <el-link v-if="user.isLoginned">Got registration?</el-link>
            <el-link v-else>Got login?</el-link>
        </div>

    </el-form>

</template>
<script>

import Vue from 'vue/dist/vue.js';
import Store from '../Store';
import api from '../core/api';

export default Vue.component('login', {
    data() {
        return {
            user: Store.user,
            checked: false
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
            if (!user.login || !user.password || !user.isLoginned && !this.checked) {
                this.$notify({
                    title: 'Error ' + this.status,
                    message: 'Fill in all the fields!',
                    type: 'error'
                });
                return;
            }
            api({
                action: this.status.toLowerCase(),
                data: user
            }, (data) => {
                Vue.set(Store, 'user', Object.assign(Store.user, data));
                Store.$notify({
                    type: 'success',
                    title: 'Success ' + this.status,
                    message: 'Ready!'
                });
                Store.user.isLogged = true;
                Store.rout('mainPage');
            });
        }
    }
});
</script>