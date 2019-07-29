<template>
<div id="user-panel">
    <div id="action-buttons-blind" v-if="action.login === user.login && action.action.includes('Blind')">
        <div class="hovered but bg-yellow action-button" @click="setBlind">Set&nbsp;{{action.action === 'smallBlind' ? 'S' : 'B'}}.&nbsp;Blind {{blind}}
        </div>
        <div class="ranger">
            <div class="runger-but but hovered bg-red" @click="changeBling('-')">-</div>
            <input class="ranger-input" v-model="blind" />
            <div class="runger-but but hovered bg-green" @click="changeBling('+')">+</div>
        </div>
    </div>
    <div id="action-buttons" :class="{'no-clicked': user.login!==action.login}" v-else>
        <div class="hovered but bg-blue action-button" @click="check" :class="{'no-clicked': called !== 0}">Check</div>
        <div class="hovered but bg-red action-button" @click="fold">Fold<div class="buttons-value">{{game.gamersData[user.login] && game.gamersData[user.login].totalBet || 0}}</div>
        </div>
        <div class="hovered but bg-yellow action-button" :class="{'no-clicked': called === 0}" @click="call">Call:<div class="buttons-value">{{called}}</div>
        </div>
          <div class="hovered but bg-green action-button" @click="raise">{{txtRaise}} to:
              <div class="buttons-value">{{raised}}</div>
        </div>
         <div class="ranger" >
            <div class="runger-but but hovered bg-red" @click="changeraise('-')">-</div>
            <input class="ranger-input" v-model="raised" />
            <div class="runger-but but hovered bg-green" @click="changeraise('+')">+</div>
        </div>
    </div>
</div>
</template>

<script>
import Store from '../Store';
import config from '../../config';

export default {
    data() {
        return {
            raised: 10,
            blind: 10,
            minBlind: config.min_bet
        };
    },
    created() {},
    computed: {
        userData(){
            return this.game.gamersData[this.user.login] || {};
        },
        called() {
            return this.game.currentMaximalBet.maxBet - this.userData.totalBet || 0;
        },
        game() {
            return Store.room.game;
        },
        user() {
            return Store.user;
        },
        action() {
            return this.game.waitUserAction
        },
        txtRaise(){
            if(this.game.currentMaximalBet.maxBet <= this.game.bblind){
                return 'Bet';
            }
            return 'Raise';
        }
    },
    methods: {
        changeBling(current) {
            if (current === '+') {
                this.blind++;
            } else {
                this.blind--;
                if(this.blind < this.minBlind){
                    this.blind = this.minBlind;
                }
            }
        },
        changeraise(current) {
            if (current === '+') {
                this.raised++;
            } else {
                this.raised--;
                if(this.raised <= this.game.currentMaximalBet.maxBet){
                    this.raised = this.game.currentMaximalBet.maxBet + 1;
                }
            }
        },
        setBlind() {
            Store.emit('waitAction', {
                action: this.action,
                value: this.blind
            });
        },
        raise() {
            Store.emit('waitAction', {
                action: this.action,
                move: 'raise',
                value: this.raised
            });
        },
        fold() {
            Store.emit('waitAction', {action: this.action, move: 'fold'});
        },
        call() {
            Store.emit('waitAction', {action: this.action, move: 'call'});
        },
        check() {
            Store.emit('waitAction', {action: this.action, move: 'check'});
        }
    },
    watch: {
        'game.sblind'(value) {
            if (value) { // если SB->BB
                this.blind = value * 2;
                this.minBlind = this.blind;
            } else {
                this.blind = this.minBlind = config.min_bet;
            }

        },
         'game.currentMaximalBet.maxBet'(value) {
            this.raised = value + 1;
         }
    }
}
</script>
