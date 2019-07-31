import Vue from 'vue/dist/vue.js';
import api from './core/api';

export default new Vue({
    created() {
        this.user.token = localStorage.getItem('wstoken') || false;
        if (this.user.token) {
            this.updateUser(() => {
                if (this.user.lvl) {
                    this.rout(window.location.hash || '#game');
                    this.getNoFinished();
                }
            });
        } else {
            this.isLoad = true;
        }
        this.updatePublic();
        setInterval(() => {
            this.updatePublic();
        }, 60 * 1000);
    },
    data: {
        isLoad: false,
        isSoundOn: localStorage.isSoundOn === "false" ? false : true,
        router: '',
        user: {
            isLogged: false,
            isLoginned: true, // хочет логиниться / регаться
            password: '',
            login: '',
            address: '',
            token: false,
            balance: 0
        },
        socket: null,
        room: {
            game: {
                oppenedCards: [],
                status: 'wait',
                waitUserAction: {},
                gamersData: {},
                currentMaximalBet: {}
            },
            places: {}
        },
        log: [],
        uCards: {},
        detailsWin: {},
        secondsLeft: 0,
        gamersPlaces: {} // размещение игроков на начало матча
    },
    methods: {
        updatePublic() {
            // api({
            //     action: 'getPublic'
            // }, (data) => {
            //     this.totalRatings = data.totalRatings;
            //     this.totalPrize = data.totalPrize;
            // }, true, 'public');
        },
        updateUser(cb = false) {
            this.isLoad = true;
            const self = this;
            api({
                action: 'getUser',
                token: this.user.token
            }, (data) => {
                self.user = data;
                cb && cb();
            }, true);
        },
        logOut() {
            this.user.isLogged = false;
            this.user.token = false;
        },
        emit(action, data){
            data.token = this.user.token;
            this.socket.emit(action, data);
        },
        timer: ()=>{}
    },
    computed: {
        isUserPlaced() {
            for (let p in this.room.places) {
                if (this.room.places[p] === this.user.login) {
                    this.user.isPlaced = true;
                    return true;
                }
            }
            this.user.isPlaced = false;
            return false;
        }
    },
    watch: {
        'user.token'() {
            localStorage.setItem('wstoken', this.user.token);
        }
    }
});
