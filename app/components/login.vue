<template>
    <el-form id="form" class="center">

        <h4 class="mt10">{{status}}</h4>

        <el-input placeholder="Input login" maxlength="10" v-model="user.login" clearable class="mt5"></el-input>
        <el-input placeholder="Input password" v-model="user.password" clearable show-password class="mt5"></el-input>

        <el-button type="info" @click="logreg" plain class="mt10">{{status}}</el-button>

        <div class="hovered mt10" @click="user.isLoginned =!user.isLoginned">
            <el-link v-if="user.isLoginned" href="#">Got registration?</el-link>
            <el-link v-else href="#">Got login?</el-link>
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
            });
        }
    }
});
</script>