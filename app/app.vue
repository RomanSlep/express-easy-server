<template>
    <div id="main" v-if="Store.isLoad" @click="Store.user.isLogged && !Store.isGameOver && startGame()">
        <div id="top" class="line">
            <!-- <img src="/assets/img2/logo_fb.png"> -->
            <img class="getReady" src="/assets/img2/get_ready.png"
                v-if="!Store.isGameOver && Store.user.deposit >= Store.config.bet && !Store.isGame">
            <img class="getReady" src="/assets/img2/game_over.png" v-if="Store.isGameOver">
        </div>
        <div id="canvas-container">
            <!-- <canvas id="flappy" width="500" height="650"></canvas> -->
        </div>
        <div id="user-content">
            <span v-if="Store.user.isLogged">
                <div>
                    {{Store.user.login}}
                    <span class="txt-red" @click="Store.defaultUser()">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                    </span>
                </div>
                <div>Pay
                    <span class="txt-green" @click.prevent="billing">
                        <span class="txt-gren" @click.prevent="billing">
                            <i class="fa fa-credit-card-alt" aria-hidden="true"></i>
                        </span>
                    </span>
                </div>

            </span>
            <login v-else></login>
        </div>
        <modal></modal>
        <notifications group="foo" />
    </div>
</template>

<script>
import modal from './components/modal.vue';
import login from './components/login.vue';
import config from '../config';
import Store from './Store';
import $u from './core/utils';
import game from './core/game';
import api from './core/api';

export default {
    components: {
        modal,
        login
    },
    mounted() {
        game.init();
    },
    data() {
        return {Store}
    },
    methods: {
        billing(){
            Store.modal.show({
            body: `Для пополнения депозита отправьте ${config.coinName} с вашего счета:<br> <u class="txt-yellow">${Store.user.address}</u> <br>на счет нашего кольшелька: <br> <u class="txt-yellow">${config.gameMinterAddress}</u>`,
            header: 'Пополнить депозит',
            });
        },
        startGame() {
            if (game.isGame) {
                return;
            }
            api({action: 'startGame'}, data => {
                game.start(data);
                Store.updateUser();
            });
        }
    }
};

</script>
