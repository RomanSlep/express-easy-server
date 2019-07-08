<template>
<span id="user-page">
    <h3><i class="fa fa-arrow-circle-left txt-blue" aria-hidden="true" @click="rout('#game')"></i> Hellow, {{user.login}}! </h3>
    <div class="user-page-main">
        <div class="user-data">
            <div class="mage-gif">
                <img src="assets/gif/mage.gif">
            </div>
            <div class="user-acount-info">
                <h3>Account data</h3>
                <div class="line-user-info"><span>Nick:</span> {{user.login}}</div>
                <div class="line-user-info"><span>Level:</span> {{user.lvl}} (Exp: {{user.exp}}/{{levels[user.lvl + 1]}})</div>
                <div class="line-user-info"><span>Points:</span> {{user.leftStatPoints}}</div>
                <div class="line-user-info"><span>Deposit:</span> {{user.deposit}}</div>
                <div class="line-user-info"><span>Score:</span> {{user.score}}</div>
                <div class="line-user-info"><span>Rating:</span> {{user.rating}}</div>
            </div>
        </div>
        <div class="statList">
          <h3>Upgrade you pers! Left {{user.leftStatPoints}} points.</h3>
            <div class="stat-line"><span>Probobility drop scores: </span>{{user.stats.probDropScore}}%</div>
            <div class="stat-line"><span>Probobility drop exp: </span>{{user.stats.probDropExp}}%</div>
        </div>
    </div>

</span>
</template>

<script>
import Store from '../Store';
import api from '../core/api';
import Vue from 'vue/dist/vue.js';

export default {
    data(){
        return {
            levels: Store.levels
        }
    },
    computed: {
        user() {
            return Store.user;
        }
    }
}
// "stats":{"probDropScore":50,"probDropExp":50,"probDropArtefact":0.1,"probDropBaff":0.1,"escapeBomb":20},
</script>
