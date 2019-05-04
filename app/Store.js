import Vue from 'vue/dist/vue.js';


export default new Vue({
    created() {
        this.$watch('topbar', () => {
            // console.log('ch');
        }, {
            deep: true
        });
    },
    data: {
        isGame: false,
        topbar: {
            bet: 0.001, // ставка
            deposit: 100, // депозит юзера
            countBombs: 1
        },
        field: {
            plots: createField(),
        },
        game: {
            collected: 0, // сколько выиграно в матче 
            nextPrize: 0, // следуюзий выигрыш
        },
        user: {
            isLoged: true,
            isLoginned: true, // хочет логиниться / регаться
            password: '',
            login: '',
            address: '',
            token: false
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