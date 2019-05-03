import Vue from 'vue/dist/vue.js';
import Store from '../../Store';
import template from './field.htm';
// import $u from '../../core/utils';


export default Vue.component('fieldGame', {
    template,
    data() {
        return {
            store: Store.field
        };
    }
});