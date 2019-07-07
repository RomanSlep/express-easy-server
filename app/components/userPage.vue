<template>
<span id="user-page">
    <h3>Hellow, {{user.login}}!</h3>

    <div class="statList">
        <span @click="rout('#game')">Back</span>
        <div class="stat" v-for="(s, i) in Object.keys(user.stats)" :key="i">
            {{s}} -> {{user.stats[s]}}% <b>+</b>
        </div>
    </div>

</span>
</template>

<script>
import Store from '../Store';
import api from '../core/api';
import Vue from 'vue/dist/vue.js';

export default {
    computed: {
        user() {
            return Store.user;
        }
    }
}
// "stats":{"probDropScore":50,"probDropExp":50,"probDropArtefact":0.1,"probDropBaff":0.1,"escapeBomb":20},
</script>
