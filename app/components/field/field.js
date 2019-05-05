import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './field.htm';
import $u from '../../core/utils';


export default Vue.component('fieldGame', {
    template,
    data() {
        return {
            Store,
            store: Store.field,
        };
    },
    methods: {
        choice(i) {
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
            setTimeout(() => {
                Vue.set(plots, i, 'o');
            }, 5000);
        }
    }
});