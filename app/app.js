import Vue from 'vue';
import './core/filters';
import Notifications from 'vue-notification';
Vue.use(Notifications);

import App from './app.vue';
new Vue({
    render: h => h(App)
}).$mount('#app');
