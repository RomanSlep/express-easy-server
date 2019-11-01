<template>
    <div id="main" v-if="Store.isLoad" @click="Store.user.isLogged && !Store.isGameOver && startGame()">
        
        <div id="top" class="line">
            <img class="getReady" src="/assets/img2/get_ready.png"
                v-if="!Store.isGameOver && Store.user.deposit >= Store.config.bet && !Store.isGame">
            <img class="getReady" src="/assets/img2/game_over.png" v-if="Store.isGameOver">
            <div id="blink2" class="warningDepositMsg" v-if="Store.user.deposit < Store.config.bet">Insert coin to start winning!</div>
        </div>
        <div id="preloader">
            <div class="preloader_container">
                <img src="/assets/img2/bird.png" class="preloaderImg">
                <img src="/assets/img2/logo_fb.png" class="preloaderLogo">
            </div>
        </div>
        <div id="user-content" @click.stop>
            <span v-if="Store.user.isLogged">
                <div class="user-content_line">
                    <span class="txt-red" @click="Store.defaultUser()">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                    </span>
                    {{Store.user.login}}
                </div>
                <div class="user-content_line" @click="billing">
                    <span class="txt-green">
                            <i class="fa fa-credit-card-alt" aria-hidden="true"></i>
                    </span>
                    Pay
                </div>
                <div class="user-content_line" @click="withdraw">
                     <span class="txt-red">
                            <i class="fa fa-credit-card-alt" aria-hidden="true"></i>
                    </span>
                    Withdraw
                </div>

            </span>
            <login v-else></login>
             <modal></modal>
        </div>
         <div id="canvas-container"></div>
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
            body: `Для пополнения депозита отправьте ${config.coinName} с вашего счета:<br> <u class="txt-yellow">${Store.user.address}</u> <br>на счет нашего кольшелька: <br> <u class="txt-yellow">${config.gameMinterAddress}</u>
            <i class="hovered txt-green fa fa-clone" aria-hidden="true" onclick="copy('${config.gameMinterAddress}')"></i>
            `,
            header: 'Пополнить депозит',
            });
        },
        withdraw(){
            const {coinName, bet} = config;
            const max = Store.user.deposit.toFixed(0);
            const min = 10 * bet;
            Store.modal.show({
            body: `Ведите сумму для вывода: <input type="number" step="10" min="${min}" max="${max}" value="${min}" id="withdrawAmount"><br>
            Указанная сумма будет отправлена на адрес привязанный к Вашему аккаунту: <br><u class="txt-yellow">${Store.user.address}</u><br>
            <small>* Минимальная сумма вывода ${min} ${coinName}</small>
            `,
            header: 'Вывести ' + coinName,
            cb: ()=>{
                const amount = +document.getElementById('withdrawAmount').value;
                let err = false;
                if(amount < min){
                    err = `Минимальная сумма вывода ${min} ${coinName}`;
                }
                if(amount > max){
                    err = `Максимальная сумма вывода ${max} ${coinName}`;
                }
                if (err) {
                   return this.$notify({
                        type: 'error',
                        group: 'foo',
                        title: "Не удалось:",
                        text: err
                    });
                }
                 api({action: 'withdraw', data:{amount}}, data => {
                        this.$notify({
                        type: 'success',
                        group: 'foo',
                        title: "Успешно!",
                        text: 'Средства успешно отправлены'
                    });
                    Store.updateUser();
                 });
            }});
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
