import Vue from 'vue/dist/vue.js';

export default new Vue({
    data: {
        bet: 0.001, // ставка
        deposit: 0, // депозит юзера
        collected: 0, // сколько выиграно в матче 
        nextPrize: 0, // следуюзий выигрыш
        activeCount: 1,
        field: createField(),
    }
});


function createField() {
    const arr = [];
    for (let i = 0; i < 25; i++) {
        arr.push('с');
    }
    return arr;
}