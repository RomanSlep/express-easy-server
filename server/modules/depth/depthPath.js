const DB = require('../DB');
/**
 * @constructor type sell или buy
 */
module.exports = class {
    constructor(type) {
        this.type = type;
        this.init();
    }
    async init(){
        const memory = DB[this.type + 'Depth'];
        this.orders = await memory.findOne({}) || new memory();
        this.orders.save();
    }
};
