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
            const self = this;
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
                setTimeout(() => {
                    const predCollected = $u.round(Store.game.collected);
                    Vue.set(Store, 'game', game);
                    const status = game.steps[i].status;
                    Store.logs.push({
                        cell: i,
                        status: status,
                        predCollected,
                        collected: $u.round(game.collected)
                    });
                    if (status === 'o') {
                        $u.sound('open');
                        console.log('Норм!');
                    } else {
                        $u.sound('bomb');
                        self.classResult = 'lose';
                        console.warn('BOMB');
                    }
                }, 2000);
            });
        }
    }
});