<template>
<div id="user-panel">
    <div id="action-buttons-blind" v-if="action.login === user.login && action.action.includes('smallBlind')">
        <div class="hovered but bg-yellow action-button" @click="setBlind">Set&nbsp;{{action.action === 'smallBlind' ? 'S' : 'B'}}.&nbsp;Blind {{blind}}
        </div>
        <div class="ranger">
            <div class="runger-but but hovered bg-red" @click="changeBling('-')">-</div>
            <input class="ranger-input" v-model="blind" />
            <div class="runger-but but hovered bg-green" @click="changeBling('+')">+</div>
        </div>
    </div>
    <div id="action-buttons" v-else>
        <div class="hovered but bg-red action-button" @click="fold">Fold<div class="buttons-value">{{game.gamersData[user.login] && game.gamersData[user.login].totalBet || 0}}</div>
        </div>
        <div class="hovered but bg-yellow action-button">Call:<div class="buttons-value">{{called}}</div>
        </div>
        <div class="hovered but bg-green action-button">Rise to: <div class="buttons-value">{{rised}}</div>
        </div>
        <div class="hovered but bg-blue action-button">Check</div>
    </div>
</div>
</template>

<script>
import Store from '../Store';
export default {
    data() {
        return {
            rised: 10,
            blind: 10
        };
    },
    created() {

    },
    computed: {
        called() {
            return 10;
        },
        folded() {
            return 15;
        },
        game() {
            return Store.room.game;
        },
        user() {
            return Store.user;
        },
        action() {
            return this.game.waitUserAction
        }
    },
    methods: {
        changeBling(current){
            if(current === '+'){
                this.blind++;
            } else {
                this.blind--;
            }
        },
        setBlind(){
            Store.emit('waitAction', {action: this.action, value: this.blind});
        },
        fold(){
             Store.emit('waitAction', {action: this.action});
        }
    }
}
</script>
