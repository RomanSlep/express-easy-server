import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './field.htm';
import $u from '../../core/utils';


export default Vue.component('fieldGame', {
    template,
    data() {
        return {
            Store
        };
    },
    methods: {
        choice(i) {
            if (Store.field.plots[i] !== 'c') {
                return;
            }
            $u.sound('choice', 0.5);
            Vue.set(Store.field.plots, i, 'w');
            setTimeout(() => {
                Vue.set(Store.field.plots, i, 's');
            }, 1200);
        }
    }
});