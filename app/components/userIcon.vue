<template>
    <div id="userInfo" class="bg">
        <div class="avatar" @click="rout('#userpage')">
            <div class="user-lvl avatar-icons">{{user.lvl}}</div>
            <div class="user-left-points avatar-icons" :class="{'activeCount': user.leftStatPoints}">{{user.leftStatPoints}}</div>

            <img src="assets/gif/avatar.gif">
        </div>
        <div class="infoblock">
            <div class="userlogin" :class="'rating-' + (user.rating - 1)">{{user.login}} #{{user.rating}}</div>
            <div class="progressbar" :style="progressBarStyle">Exp: {{user.exp}}/{{levels[user.lvl + 1]}}</div>
            <div class="lineinfo">
                <span class="txt-yellow">{{user.deposit}} SWG </span>
                  <span class="txt-green"> Score: {{user.score | numFormat}}.</span>
                  <span class="txt-red" @click="exit">Exit <i class="fa fa-sign-out" aria-hidden="true"></i></span>
            </div>
        </div>
    </div>
    <!-- {{user.login}}! Lvl {{user.lvl}}, Exp ({{user.exp}}/{{levels[user.lvl + 1]}})
        <span class="txt-green">Deposit: {{user.deposit | numFormat}}.</span>
        <span class="txt-green" :class="'rating-' + (user.rating - 1)">
            Score: {{user.score | numFormat}} (#{{user.rating}}).</span>
        <span class="txt-red" @click="exit">Exit?</span>
    </h2> -->
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {
            // user: Store.user,
            levels: Store.levels
        }
    },
    methods: {
        exit() {
            this.user.isLogged = false;
            this.user.token = false;
        }
    },
    computed: {
        user() {
            return Store.user
        },
        progressBarStyle() {
            if (!this.user.lvl) {
                return {}
            }
            const persent = this.user.exp / this.levels[this.user.lvl + 1] * 100;
            return {
                background: 'linear-gradient(to right, #444 0, #354030 ' + persent + '%, rgba(0,0,0,-0) ' + persent + '%)'
            };
        }
    }
    }
</script>

