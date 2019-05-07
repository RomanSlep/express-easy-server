import Vue from 'vue/dist/vue.js';
import api from './core/api';
import $u from './core/utils';

export default new Vue({
    created() {
        this.$watch('user.token', () => {
            localStorage.setItem('wstoken', this.user.token);
        });

        this.$watch('game.cellsBomb', () => {
            console.log(this.game.cellsBomb);
            if (this.game.cellsBomb) {
                this.game.cellsBomb.forEach((c, i) => {

                    this.field.plots[c] = 'b';

                });
            }
        });

        this.user.token = localStorage.getItem('wstoken') || false;
        this.updateUser(() => {
            this.getNoFinished();
        });
    },
    data: {
        isLoad: false,
        topbar: {
            bet: 0.1, // ставка
            countBombs: 1
        },
        field: {
            plots: createField(),
        },
        game: {
            isWaitRnd: false,
            isGame: false,
            collected: 0, // сколько выиграно в матче 
            nextPrize: 0, // следуюзий выигрыш
            steps: {}
        },
        user: {
            isLoged: false,
            isLoginned: true, // хочет логиниться / регаться
            password: '',
            login: '',
            address: '',
            token: false,
            deposit: 0
        },
        logs: []
    },
    methods: {
        updateUser(cb = false) {
            const self = this;
            api({
                action: 'getUser',
                token: this.user.token
            }, (data) => {
                Vue.set(self, 'user', Object.assign(self.user, data));
                if (cb) {
                    cb();
                }
            }, true);
        },
        getNoFinished() {
            const self = this;
            api({
                action: 'getNoFinished'
            }, g => {
                this.isLoad = true;
                if (g) {
                    Vue.set(self, 'game', g);
                    self.topbar.bet = g.bet;
                    self.topbar.countBombs = g.countBombs;
                    self.startGame();
                }
            });
        },
        startGame() {
            this.game.isGame = true;
            $u.sound('gong');
            this.field.plots.forEach((p, i) => {
                setTimeout(() => {
                    const self = this;
                    Vue.set(this.field.plots, i, self.game.steps[i] && self.game.steps[i].status || 'c');
                }, 80 * i);
            });
        }
    }
});


function createField() {
    const arr = [];
    for (let i = 0; i < 25; i++) {
        arr.push('w');
    }
    return arr;
}