<template>
      <div v-show="room.places[n]" 
            class="place-taked"
            :class="{wait: game.waitUserAction.login === room.places[n],'not-in-game': !game.status.includes('wait') && room.places[n] && (!gamersData[room.places[n]] || gamersData[room.places[n]].isFold)}">
                <div class="dialer" v-if="room.places[n] === room.dealer"></div>
                <div class="user-wait-action" v-show="game.waitUserAction.login === room.places[n]">
                    <div class="gif gif-wait"></div>
                    <div class="action txt-yellow">{{game.waitUserAction.text + ' ' + timer.secondsLeft + 's...'}}</div>
                </div>
                 <div class="user-wait-action winner-line" v-show="detailsWin.login === room.places[n]">
                    <div class="gif-winner"></div>
                    <div class="action txt-yellow">WINNER: {{detailsWin.txt}}</div>
                </div>
                <div class="user-place">
                    <div class="user-avatar">
                        <img src="assets/img/avatar.jpg">
                    </div>
                    <div class="user-info">
                        <div class="last-move">
                            {{gamersData[room.places[n]] && gamersData[room.places[n]].lastMove || '-'}}
                        </div>
                        <div>
                            <span class="user-name txt-yellow">{{room.places[n]}}</span>
                            <span class="txt-green"> 
                                {{gamersData[room.places[n]] && gamersData[room.places[n]].totalBet || 0}} <strike>A</strike>
                            </span>
                        </div>
                        <div class="user-last-bet">{{gamersData[room.places[n]] && gamersData[room.places[n]].lastBet || 0}}</div>
                    </div>
                </div>
                <span v-show="room.places[n] === user.login" @click="$parent.leavePlace(n)"><i
                        class="hovered txt-yellow fa fa-arrow-circle-up" aria-hidden="true"></i></span>
            </div>
</template>

<script>
import Store from '../Store';
export default {
    props: [
    "n",
    "room",
    "game",
    "gamersData", 
    "detailsWin",
    "user",
    "timer"],
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
    }
}
</script>


