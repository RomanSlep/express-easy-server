import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './field.htm';
import $u from '../../core/utils';
import api from '../../core/api';


export default Vue.component('fieldGame', {
    template,
    data() {
        return {
            Store,
            store: Store.field,
            classResult: ''
        };
    },
    computed: {
        cells() {
            return Store.field.plots.map((p, i) => {
                const step = Store.game.steps[i];
                return step ? step.status : p;
            });
        }
    },
    methods: {
        choice(i) {
            if (Store.game.isWaitRnd) {
                $u.sound('wait');
                // this.$notify({
                //     type: 'info',
                //     group: 'foo',
                //     title: 'Info!',
                //     text: 'Wait randomiser!'
                // });
                return;
            }
            const plots = this.store.plots;
            if (plots[i] !== 'c') {
                return;
            }
            $u.sound('choice', 0.5);

            Vue.set(plots, i, 'w');
            setTimeout(() => {
                Vue.set(plots, i, 's');
            }, 1200);

            // ЭТО ПО ОТВЕТУ ОТ РАНДОМАЙЗЕРА!!!
            api({
                action: 'choice',
                data: {
                    cell: i,
                    game_id: Store.game._id
                }
            }, game => {
                Store.game.isWaitRnd = true;
                setTimeout(() => {
                    updateGame(game);
                }, delays[Store.topbar.countBombs] * 1000);
            });
        }
    }
});

function updateGame(game) { // ОТВЕТ ОТ РАНДОМАЙЗЕРА!!!!
    const predCollected = $u.round(Store.game.collected);
    Vue.set(Store, 'game', game);
    const status = game.steps[game.lastCell].status;
    Store.logs.push({
        cell: game.lastCell,
        status: status,
        predCollected,
        collected: $u.round(game.collected)
    });
    if (status === 'o') {
        $u.sound('open');
        console.warn('Open!');
    } else {
        $u.sound('bomb1');
        // console.log('Finish game', game)
        // self.classResult = 'lose';
        console.warn('BOMB');
    }
}

const delays = {
    1: 1,
    3: 4,
    5: 5,
    10: 6,
    20: 8
};