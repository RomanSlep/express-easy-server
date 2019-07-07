import Vue from 'vue/dist/vue.js';
import api from './core/api';
import $u from './core/utils';
import config from '../config';

export default new Vue({
    created() {
        this.user.token = localStorage.getItem('wstoken') || false;
        if (this.user.token) {
            this.updateUser(() => {
                if (this.user.lvl){
                    this.rout(window.location.hash || '#game');
                    this.getNoFinished();
                }
            });
        } else {
            this.isLoad = true;
        }
        this.updatePublic();
        setInterval(() => {
            this.updatePublic();
        }, 60 * 1000);
    },
    data: {
        isLoad: false,
        router: '',
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
            isLogged: false,
            isLoginned: true, // хочет логиниться / регаться
            password: '',
            login: '',
            address: '',
            token: false,
            deposit: 0
        },
        levels: mathLvl(config.levelsOpt),
        totalPrize: 0,
        totalRatings: [],
        logs: []
    },
    methods: {
        updatePublic() {
            api({
                action: 'getPublic'
            }, (data) => {
                this.totalRatings = data.totalRatings;
                this.totalPrize = data.totalPrize;
            }, true, 'public');
        },
        updateUser(cb = false) {
            this.isLoad = true;
            const self = this;
            api({
                action: 'getUser',
                token: this.user.token
            }, (data) => {
                const lvl = this.user.lvl;
                if (data.lvl > lvl){
                    $u.sound('level_up');
                    this.$notify({
                        type: 'success',
                        group: 'foo',
                        title: 'Congratulation!',
                        text: `You level UP to ${data.lvl}!`
                    });
                }
                data.score = +data.score.toFixed(0);
                self.user = data;
                cb && cb();
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
                }, 50 * i);
            });
        }
    },
    watch: {
        'user.token'() {
            localStorage.setItem('wstoken', this.user.token);
        },
        'game.cellsBomb'(){
            if (this.game.cellsBomb) {
                this.game.cellsBomb.forEach((c, i) => {
                    this.field.plots[c] = 'b';
                });
            }
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


function mathLvl(opts) {
    const lvls = {
        2: opts.first
    };
    for (let i = 3; i <= opts.maxLvl; i++) {
        let res = Math.floor(lvls[i - 1] + opts.martin * i);
        lvls[i] = res;
    };
    for (let l in lvls){
        lvls[l] *= 100;
    }
    return lvls;
};
