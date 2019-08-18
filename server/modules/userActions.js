const $u = require('../helpers/utils');
let roomsApi;
module.exports = {
    checkUserAction: function (data, player) {
        roomsApi = this.roomsApi;
        const action = this.waitUserAction;
        try {
            const {user} = player;
            const {login} = user;
            // console.log('checkUserAction', data, action.action, data.action.action);
            if (action.login !== login){
                console.log('Not Valid checkUserAction LOGIN');
                return 'Not Valid data!';
            }

            if (action.action !== data.action.action){
                console.log('Not Valid checkUserAction ACTION');
                return 'Not Valid data!';
            }
            if (data.value && data.value <= 0 && player.deposit >= data.value){
                // TODO: Проверка баланса, хватит ли бабла юзеру!!
                console.log('Not Valid checkUserAction VALUE');
                return 'Not Valid data!';
            }
            console.log('Valid action', login, action.action);
            this.clearWaitTimeout();
            return this[action.action](data, player);
        } catch (e){
            console.log('Error checkUserAction ->', action.action + '->', e);
        }
    },
    smallBlind(data, player){
        const {user} = player;
        const userData = this.gamersData[user.login];
        if (data.value === undefined || player.deposit < data.value){
            console.log('Error smallBlind not value data...');
            return;
        }

        this.sblind = data.value;
        this.sblindUser = user.login;
        userData.totalBet = data.value;
        userData.lastMove = 'SBlind';
        userData.lastBet = data.value;
        // TODO: транзакцию юзеру на снятие!
        player.updateArts(-data.value);
        // Задаем большой блаинд
        this.waitUserAction = {
            login: this.getNextGamer(user.login),
            action: 'bigBlind',
            text: 'Wait big blind'
        };
        socketLog(this.room, `${user.login} set small blind ${data.value} Arts`);
        this.finalAction(player);
    },
    bigBlind(data, player){ // Получили ответ по большому блаинду
        const {user} = player;
        const userData = this.gamersData[user.login];
        if (data.value === undefined || data.value < this.sblind * 2 || player.deposit < data.value){
            console.log('Error bigBlind not value data...');
            this.waitUserAction.login = this.getNextGamer();
            this.removeGamer(user.login);
            this.sendUserActionAndWait();
            return 'Small BBlind!';
        }
        this.bblind = data.value;
        this.bblindUser = user.login;
        userData.totalBet = data.value;
        userData.lastMove = 'BBlind';
        userData.lastBet = data.value;
        player.updateArts(-data.value);
        // TODO: транзакцию юзеру на снятие!

        // Ставки по кругу пока не уровняются...
        this.waitUserAction = {};
        // сдаем по 2 карты каждому
        this.setCards();
        // Запускаем торги
        this.waitUserAction = {
            login: this.getNextGamer(user.login),
            action: 'bidding',
            text: 'Wait user bidding'
        };
        this.status = 'preflop';
        this.checkNeedFinished();// вдруг игроков 2е и надо выложить карты
        socketLog(this.room, `${user.login} set big blind ${data.value} Arts`);
        this.finalAction();
    },
    bidding(data, player){
        const {user} = player;
        const userData = this.gamersData[user.login];
        const currentBet = this.getCurrentMaximalBet().maxBet - userData.totalBet;
        if (data.move === 'fold'){
            userData.isFold = true;
            socketLog(this.room, `${user.login} FOLD!`, 'red');
        }
        if (data.move === 'call'){
            const call = currentBet;
            if (call > player.deposit){
                console.log('Error: deposit < call', {call, b: player.deposit});
                userData.isFold = true;
            } else {
                player.updateArts(-call);
                userData.totalBet += call;
                userData.lastMove = 'Call';
                userData.lastBet = call;
                socketLog(this.room, `${user.login} CALL ${call} Arts`);
            }
        }
        if (data.move === 'raise'){
            const raise = data.value - userData.totalBet;
            if (raise > player.deposit){
                console.log('Error: balanse < raise', {raise, b: player.deposit});
                userData.isFold = true;
            } else {
                player.updateArts(-raise);
                userData.totalBet += raise;
                userData.lastMove = 'Raise';
                userData.lastBet = data.value;
                socketLog(this.room, `${user.login} RAISE ${raise} Arts`);
            }
        }

        if (data.move === 'check'){
            if (currentBet !== userData.totalBet){
                console.log('Warn CHECK ', {currentBet, userBet: userData.totalBet});
            }
            userData.lastMove = 'Check';
            socketLog(this.room, `${user.login} CHECK!`);
        }
        userData.round = this.round;
        const res = this.checkNeedFinished();
        if (res) { // Проверка на завершение матча
            console.log('Finis game!', res);
            this.winnersBalance();
            this.nextGame();
            return;
        }
        // крутим дальше
        this.waitUserAction = {
            login: this.getNextGamer(user.login),
            action: 'bidding',
            text: 'Wait user bidding'
        };
        this.finalAction(player);
    },
    /**
     * @description Проверка сотсояний игры
     */
    finalAction(player){
        if (player){
            player.sendUserData(this);
        }
        this.sendUserActionAndWait(false);
        this.updateGamers();
    },
    /**
     * @description проверка на необходимость завершать матч
     */
    checkNeedFinished(){
        const nextGamer = this.gamersData[this.getNextGamer()];
        const currentGamer = this.gamersData[this.waitUserAction.login];
        // если круг закончен и все уровнялись
        console.log(currentGamer.login === this.room.dealer, currentGamer.totalBet === this.getCurrentMaximalBet().maxBet);
        if (currentGamer.login === this.room.dealer && currentGamer.totalBet === this.getCurrentMaximalBet().maxBet) {
        // if (nextGamer.round === this.round && nextGamer.totalBet === this.getCurrentMaximalBet().maxBet) {
            this.round++;
            this.setStatusByRound();
            if (this.commonCards.length === 0){ // все открыли
                console.log('winners!!!>', this.getWinners());
                return 'All cards open!';
            }
            if (this.round > 0){ // общую карту на стол!
                this.setCommonCard();
            }
            $u.playersToArray(this.gamersData).forEach(g=> g.lastBet = 0);// сбрасываем ставку раунда
        }
        const inGame = this.gamersInGame();
        if (Object.keys(inGame).length < 2){
            this.winners = [{login: Object.keys(inGame)[0], details: 'Alone'}];
            return 'Alone gamer!';
        }
    },
    /**
     * @description раздать выигрыши
     */
    winnersBalance(){
        try {
            const countWinners = this.winners.length;
            const path = this.getBank() / countWinners;
            this.winners.forEach(w=>{
                const player = this.room.players[w.login];
                player.updateArts(path);
                player.sendUserData(this);
            });

            const msg = this.winners.reduce((s, w)=>{
                return `${s} ${w.login} (${w.details})`;
            }, '');

            this.waitUserAction = {
                login: msg,
                action: 'winner',
                text: 'Winners: ',
                payload: JSON.stringify({winners: this.winners})
            };

            this.roomsApi.emitUpdateRoom({
                room: this.room,
                data: {
                    event: this.waitUserAction.action,
                    msg: this.waitUserAction.text + ' ' + this.waitUserAction.login,
                    payload: this.waitUserAction.payload
                }
            });
        } catch (e){
            console.log('Erroro winnersBalance: ', this.winners, e);
        }
    },
    setStatusByRound(){
        console.log('Round:', this.round);
        switch (this.round){
        case (2):
            this.status = 'flop';
            break;
        case (3):
            this.status = 'tern';
            break;
        case (4):
            this.status = 'river';
            break;
        }
    }
};

function socketLog(room, msg, type = 'yellow'){
    roomsApi.emitUpdateRoom({room, data: {event: 'log', msg, type}});
}
