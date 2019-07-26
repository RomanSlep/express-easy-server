let roomsApi;
module.exports = {
    checkUserAction: function (data, player) {
        roomsApi = this.roomsApi;
        const action = this.waitUserAction;
        try {
            const {user} = player;
            const {login} = user;
            console.log('checkUserAction', data, action.action, data.action.action);
            if (action.login !== login){
                console.log('Not Valid checkUserAction LOGIN');
                return 'Not Valid data!';
            }

            if (action.action !== data.action.action){
                console.log('Not Valid checkUserAction ACTION');
                return 'Not Valid data!';
            }
            if (data.value && data.value <= 0){
                // TODO: Проверка баланса, хватит ли бабла юзеру!!
                console.log('Not Valid checkUserAction VALUE');
                return 'Not Valid data!';
            }
            console.log('Valid action', login, action.action);
            if (this.waitNextActionTimeOut) {
                clearTimeout(this.waitNextActionTimeOut);
            }
            return this[action.action](data, user);
        } catch (e){
            console.log('Error checkUserAction ->', action.action + '->', e);
        }
    },
    smallBlind(data, user){
        if (!data.value){
            console.log('Error smallBlind not value data...');
            return;
        }

        this.sblind = data.value;
        this.sblindUser = user.login;
        console.log(user.login, this.gamersData[user.login]);
        this.gamersData[user.login].totalBet = data.value;
        // TODO: транзакцию юзеру на снятие!
        // Задаем большой блаинд
        this.waitUserAction = {
            login: this.getNextGamer(user.login),
            action: 'bigBlind',
            text: 'Wait big blind'
        };
        this.sendUserActionAndWait();
    },
    bigBlind(data, user){ // Получили ответ по большому блаинду
        if (!data.value){
            console.log('Error bigBlind not value data...');
            return;
        }
        if (data.value < this.sblind){ // попытка наибать
            this.waitUserAction.login = this.getNextGamer();
            this.removeGamer(user.login);
            this.sendUserActionAndWait();
            return 'Small BBlind!';
        }
        this.bblind = data.value;
        this.bblindUser = user.login;
        this.gamersData[user.login].totalBet = data.value;
        // TODO: транзакцию юзеру на снятие!

        // Ставки по кругу пока не уровняются...
        this.waitUserAction = {
            login: this.getNextGamer(user.login),
            action: 'bidding',
            text: 'Wait bidding action'
        };
        this.sendUserActionAndWait();
    },
    bidding(data, user){
        if (data.move === 'flop'){
            this.game.flopped.push(user.login);
            this.gamersData[user.login].isFlopped = true;
        }
        if (data.move === 'call'){
            this.game.flopped.push(user.login);
            this.gamersData[user.login].isFlopped = true;
        }


        // ПРоверка что все уровнялись или за столом остался один - победитель

    }
};
