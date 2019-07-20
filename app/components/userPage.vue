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
                <div class="line-user-info"><span>Status:</span> {{user.isActive ? 'Active' : 'Demo'}}</div>
            </div>
        </div>
        <div class="statList">
            <h3>Upgrade you pers! Left {{user.leftStatPoints}} points.</h3>
            <div class="stat-line">
                <div class="plot score"></div><span>Probobility drop scores: </span>{{user.stats.probDropScore}}%
                <span v-show="user.leftStatPoints">
                    <i class="fa fa-long-arrow-right txt-yellow" aria-hidden="true"></i>
                    {{(user.stats.probDropScore + 0.1).toFixed(1)}}%
                    <i class="hovered txt-green fa fa-plus" aria-hidden="true" @click="upgradePers('probDropScore')"></i>
                </span>
            </div>

            <div class="stat-line">
                <div class="plot exp"></div><span>Probobility drop exp: </span>{{user.stats.probDropExp}}%
                <span v-show="user.leftStatPoints">
                    <i class="fa fa-long-arrow-right txt-yellow" aria-hidden="true"></i>
                    {{(user.stats.probDropExp + 0.1).toFixed(1)}}%
                    <i class="hovered txt-green fa fa-plus" aria-hidden="true" @click="upgradePers('probDropExp')"></i>
                </span>
            </div>
        </div>
    </div>

</span>
</template>

<script>
import config from '../../config';
import Store from '../Store';
import api from '../core/api';
import Vue from 'vue/dist/vue.js';
import $u from '../core/utils';

export default {
    data() {
        return {
            stepStat: config.stepStat,
            levels: Store.levels
        }
    },
    computed: {
        user() {
            return Store.user;
        }
    },
    methods: {
        upgradePers(stat) {
            $u.sound('click');
            api({
                action: 'updateStat',
                data: {
                    param: stat
                }
            }, data => {
                this.$notify({
                    type: 'success',
                    group: 'foo',
                    title: 'Congritulations!',
                    text: data
                });
                Store.updateUser();
            });
        }
    }
}
// "stats":{"probDropScore":50,"probDropExp":50,"probDropArtifact":0.1,"probDropBaff":0.1,"escapeBomb":20},
</script>
