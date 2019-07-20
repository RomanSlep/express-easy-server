import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './field.htm';
import $u from '../../core/utils';
import api from '../../core/api';
import config from '../../../config';

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
                }, 1000 || delays[Store.topbar.countBombs] * 1000); //FIXME:
            });
        }
    }
});

function updateGame(game) { // ОТВЕТ ОТ РАНДОМАЙЗЕРА!!!!
    const status = game.steps[game.lastCell].status;
    let event;
    if (status === 'b'){
        event = 'bomb1';
    } else if (status === 'o'){
        event = 'open';
    } else {
        event = 'drop';
    }
    $u.sound(event);
    updateLog(game);
    Vue.set(Store, 'game', game);
}

function updateLog(game){
    const status = game.steps[game.lastCell].status;
    const predCollected = Store.game.collected.toFixed(3);
    const log = {
        cell: game.lastCell,
        status: status,
        predCollected,
        collected: game.collected.toFixed(3)
    };

    if (game.needUpdateUser) {
        Store.updateUser();
        const drop = game.drops[game.lastCell];
        if (drop){
            if (drop.type === 'scr'){
                drop.value *= config.scoreMult;
            }
            log.dropMsg = `You dropped ${drop.value.toFixed(3)} ${drop.type}!`;
        } else {
            console.log('Error drop ', game);
        }
    }
    Store.logs.push(log);
}
const delays = {
    1: 1,
    3: 4,
    5: 5,
    10: 6,
    20: 8
};
