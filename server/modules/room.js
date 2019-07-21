const $u = require('../helpers/utils');
const Store = require('../helpers/Store');

module.exports = class {
    constructor() {
        this.id = $u.unix();
        this.players = {};
        Store.rooms[this.id] = this;
        setInterval(()=>{
            // console.log(Object.keys(this.players));
        }, 1000);
    }
    addPlayer(player){
        console.log('Add', player.user.login);
        this.players[player.user.login] = player;
        player.roomId = this.id;
    }
    removePlayer(login){
        console.log('Remove', login, this.players[login]);
        delete this.players[login];
    }
};
