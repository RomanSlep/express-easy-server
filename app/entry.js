import Vue from 'vue/dist/vue.js';
import './components/topbar';

new Vue({
    el: '#app',
    template: /*html*/ `
    <div id="main">
    <h1>Saper!</h1>
    <top-bar></top-bar>
</div>
</div>
    `,
});